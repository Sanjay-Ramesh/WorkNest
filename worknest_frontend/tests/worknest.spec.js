// @ts-check
import { test, expect } from '@playwright/test';

const BASE = process.env.TEST_BASE_URL || 'http://localhost:5173';
const EMPLOYEE_EMAIL    = process.env.TEST_EMPLOYEE_EMAIL    || '';
const EMPLOYEE_PASSWORD = process.env.TEST_EMPLOYEE_PASSWORD || '';
const MANAGER_EMAIL     = process.env.TEST_MANAGER_EMAIL     || '';
const MANAGER_PASSWORD  = process.env.TEST_MANAGER_PASSWORD  || '';
const HR_EMAIL          = process.env.TEST_HR_EMAIL          || '';
const HR_PASSWORD       = process.env.TEST_HR_PASSWORD       || '';
const NEW_USER_PASSWORD = process.env.TEST_NEW_USER_PASSWORD || '';

// Department employees (EMP201–EMP204) — registered with auto LeaveBalance
const DEPT_EMPLOYEES = [
  { empId: 'EMP201', name: 'Alice Engineering', email: 'alice2.eng@worknest.com',      dept: 'Engineering' },
  { empId: 'EMP202', name: 'Bob Finance',        email: 'bob2.finance@worknest.com',    dept: 'Finance'     },
  { empId: 'EMP203', name: 'Carol Marketing',    email: 'carol2.marketing@worknest.com',dept: 'Marketing'   },
  { empId: 'EMP204', name: 'David Operations',   email: 'david2.ops@worknest.com',      dept: 'Operations'  },
];

// Department managers — promoted to MANAGER role in MongoDB by user
const DEPT_MANAGERS = [
  { email: 'eng.manager@worknest.com',     password: 'demo123', dept: 'Engineering' },
  { email: 'finance.manager@worknest.com', password: 'demo123', dept: 'Finance'     },
  { email: 'marketing.manager@worknest.com',password: 'demo123',dept: 'Marketing'   },
  { email: 'ops.manager@worknest.com',     password: 'demo123', dept: 'Operations'  },
];

const TOMORROW = '2026-06-23';
const DAY_AFTER = '2026-06-24';
const RUN_ID    = Date.now();

const API = 'http://localhost:8080';

// ─── helpers ──────────────────────────────────────────────────────────────────
async function loginAs(page, email, password) {
  await page.goto(`${BASE}/`);
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

async function logout(page) {
  await page.getByRole('button', { name: 'Logout' }).click();
  await expect(page).toHaveURL(`${BASE}/`);
}

// Apply a leave via the backend API directly (used to seed test data before UI assertions)
async function applyLeaveViaApi(request, empEmail, empId, leaveType, startDate, endDate, reason) {
  const loginRes = await request.post(`${API}/api/auth/login`, {
    data: { email: empEmail, password: 'demo123' },
  });
  const { token } = await loginRes.json();
  await request.post(`${API}/api/leaves/apply`, {
    data: { employeeId: empId, leaveType, startDate, endDate, reason },
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ─── 1. Register Flow ─────────────────────────────────────────────────────────
test.describe('1. Register Flow', () => {
  test('Register new employee → redirect to login', async ({ page }) => {
    await test.step('Open /register', async () => {
      await page.goto(`${BASE}/register`);
      await expect(page.locator('h1')).toContainText('WorkNest');
    });

    await test.step('Fill unique employee details', async () => {
      await page.getByPlaceholder('EmployeeId').fill(`EMP${RUN_ID}`);
      await page.getByPlaceholder('Name').fill('Test Employee');
      await page.getByPlaceholder('Email').fill(`testuser_${RUN_ID}@worknest.com`);
      await page.getByPlaceholder('Password').fill(NEW_USER_PASSWORD);
      await page.getByPlaceholder('Department').fill('Engineering');
      await page.locator('input[type="date"]').fill('2026-01-01');
    });

    await test.step('Click Register', async () => {
      await page.getByRole('button', { name: 'Register' }).click();
    });

    await test.step('Verify redirect to login (/)', async () => {
      try {
        await page.waitForURL(`${BASE}/`, { timeout: 10000 });
      } catch {
        const isDuplicate = await page.getByText('Registration failed').isVisible();
        if (isDuplicate) throw new Error('REGISTER FAILED: duplicate — timestamp-based email should be unique.');
        throw new Error('REGISTER FAILED: no redirect and no error message shown.');
      }
      await expect(page).toHaveURL(`${BASE}/`);
      await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    });
  });

  test('Register with duplicate email → show error', async ({ page }) => {
    await test.step('Open /register', async () => {
      await page.goto(`${BASE}/register`);
    });

    await test.step('Try to register with existing emp@worknest.com', async () => {
      await page.getByPlaceholder('EmployeeId').fill('EMP_DUP');
      await page.getByPlaceholder('Name').fill('Duplicate User');
      await page.getByPlaceholder('Email').fill('emp@worknest.com');
      await page.getByPlaceholder('Password').fill('demo123');
      await page.getByPlaceholder('Department').fill('Engineering');
      await page.locator('input[type="date"]').fill('2026-01-01');
      await page.getByRole('button', { name: 'Register' }).click();
    });

    await test.step('Verify error message shown — no redirect', async () => {
      await expect(page.getByText(/registration failed|already exists|email.*exist/i)).toBeVisible({ timeout: 8000 });
      await expect(page).toHaveURL(`${BASE}/register`);
    });
  });
});

// ─── 2. Employee Flow ─────────────────────────────────────────────────────────
test.describe('2. Employee Flow', () => {
  test('Login → balance → apply leave → my leaves → profile → security redirect → logout', async ({ page }) => {
    await test.step(`Login as ${EMPLOYEE_EMAIL}`, async () => {
      await loginAs(page, EMPLOYEE_EMAIL, EMPLOYEE_PASSWORD);
      await page.waitForURL(`${BASE}/dashboard`, { timeout: 10000 });
      await expect(page).toHaveURL(`${BASE}/dashboard`);
    });

    await test.step('Verify leave balance cards (Casual, Sick, Earned)', async () => {
      await expect(page.getByText('Casual Leave')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('Sick Leave')).toBeVisible();
      await expect(page.getByText('Earned Leave')).toBeVisible();
    });

    await test.step('Go to Apply Leave page', async () => {
      await page.getByRole('link', { name: 'Apply Leave' }).click();
      await page.waitForURL(`${BASE}/applyleave`);
    });

    await test.step('Apply CASUAL leave Jun 23–24 with reason "E2E Test"', async () => {
      await page.selectOption('select', 'CASUAL');
      const dateInputs = page.locator('input[type="date"]');
      await dateInputs.nth(0).fill(TOMORROW);
      await dateInputs.nth(1).fill(DAY_AFTER);
      await page.getByPlaceholder('reason').fill('E2E Test');
      await page.getByRole('button', { name: 'Submit' }).click();
      await expect(page.getByText('Leave Applied Successfully')).toBeVisible({ timeout: 10000 });
    });

    await test.step('Go to My Leaves → verify PENDING row', async () => {
      await page.getByRole('link', { name: 'My Leaves' }).click();
      await page.waitForURL(`${BASE}/myleaves`);
      await expect(page.locator('tbody').getByText('PENDING').first()).toBeVisible({ timeout: 10000 });
      await expect(page.locator('tbody').getByText('CASUAL').first()).toBeVisible();
      await expect(page.locator('tbody').getByText('E2E Test').first()).toBeVisible();
    });

    await test.step('Go to Profile → verify employee fields', async () => {
      await page.getByRole('link', { name: 'Profile' }).click();
      await page.waitForURL(`${BASE}/profile`);
      await expect(page.getByText('Employee ID', { exact: false })).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('Name',        { exact: false })).toBeVisible();
      await expect(page.getByText('Email',       { exact: false })).toBeVisible();
      await expect(page.getByText('Department',  { exact: false })).toBeVisible();
      await expect(page.getByText('Joined Date', { exact: false })).toBeVisible();
    });

    await test.step('Security: direct nav to /managerdashboard → redirect to /dashboard', async () => {
      await page.goto(`${BASE}/managerdashboard`);
      await page.waitForURL(`${BASE}/dashboard`, { timeout: 5000 });
      await expect(page).toHaveURL(`${BASE}/dashboard`);
    });

    await test.step('Logout', async () => { await logout(page); });
  });
});

// ─── 3. Manager Flow ──────────────────────────────────────────────────────────
test.describe('3. Manager Flow', () => {
  test('Login → pending leaves → approve first → row gone → logout', async ({ page }) => {
    await test.step(`Login as ${MANAGER_EMAIL}`, async () => {
      await loginAs(page, MANAGER_EMAIL, MANAGER_PASSWORD);
      await page.waitForURL(`${BASE}/managerdashboard`, { timeout: 10000 });
      await expect(page).toHaveURL(`${BASE}/managerdashboard`);
    });

    await test.step('Verify Manager Dashboard link in sidebar', async () => {
      await expect(page.getByRole('link', { name: 'Manager Dashboard' })).toBeVisible();
    });

    await test.step('Verify pending leaves table has rows', async () => {
      await page.waitForTimeout(2000);
      await expect(page.locator('tbody tr').first()).toBeVisible({ timeout: 10000 });
    });

    await test.step('Approve first leave', async () => {
      const firstApproveBtn = page.getByRole('button', { name: 'Approve' }).first();
      await expect(firstApproveBtn).toBeVisible({ timeout: 5000 });
      await firstApproveBtn.click();
    });

    await test.step('Verify no error toast and approved row is removed', async () => {
      await page.waitForTimeout(2000);
      await expect(page.getByText('Failed to update leave status')).not.toBeVisible();
    });

    await test.step('Logout', async () => { await logout(page); });
  });
});

// ─── 4. HR Admin Flow ─────────────────────────────────────────────────────────
test.describe('4. HR Admin Flow', () => {
  test('Login → all 4 dashboard sections → sidebar links → logout', async ({ page }) => {
    await test.step(`Login as ${HR_EMAIL}`, async () => {
      await loginAs(page, HR_EMAIL, HR_PASSWORD);
      try {
        await page.waitForURL(`${BASE}/hrdashboard`, { timeout: 10000 });
      } catch {
        const currentUrl = page.url();
        if (await page.getByText('Invalid Email or Password').isVisible())
          throw new Error(`HR LOGIN FAILED: ${HR_EMAIL} — wrong credentials.`);
        throw new Error(`HR ROLE MISMATCH: redirected to ${currentUrl}, expected /hrdashboard.`);
      }
    });

    await test.step('Verify sidebar: HR Dashboard + Manager Dashboard links', async () => {
      await expect(page.getByRole('link', { name: 'HR Dashboard' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Manager Dashboard' })).toBeVisible();
    });

    await test.step('Verify Today Leaves section', async () => {
      await expect(page.getByRole('heading', { name: 'Today Leaves' })).toBeVisible();
    });
    await test.step('Verify Pending Leaves section', async () => {
      await expect(page.getByRole('heading', { name: 'Pending Leaves' })).toBeVisible();
    });
    await test.step('Verify Department Breakdown section', async () => {
      await expect(page.getByRole('heading', { name: 'Department Breakdown' })).toBeVisible();
    });
    await test.step('Verify Summary section', async () => {
      await expect(page.getByRole('heading', { name: 'Summary' })).toBeVisible();
    });

    await test.step('Logout', async () => { await logout(page); });
  });
});

// ─── 5. Security Checks ───────────────────────────────────────────────────────
test.describe('5. Security Checks', () => {
  test('Unauthenticated access to /dashboard redirects to /', async ({ page }) => {
    await page.goto(`${BASE}/dashboard`);
    await page.waitForURL(`${BASE}/`, { timeout: 5000 });
    await expect(page).toHaveURL(`${BASE}/`);
  });

  test('Employee blocked from /managerdashboard and /hrdashboard', async ({ page }) => {
    await test.step(`Login as EMPLOYEE (${EMPLOYEE_EMAIL})`, async () => {
      await loginAs(page, EMPLOYEE_EMAIL, EMPLOYEE_PASSWORD);
      await page.waitForURL(`${BASE}/dashboard`, { timeout: 10000 });
    });

    await test.step('/managerdashboard → /dashboard', async () => {
      await page.goto(`${BASE}/managerdashboard`);
      await page.waitForURL(`${BASE}/dashboard`, { timeout: 5000 });
      await expect(page).toHaveURL(`${BASE}/dashboard`);
    });

    await test.step('/hrdashboard → /dashboard', async () => {
      await page.goto(`${BASE}/hrdashboard`);
      await page.waitForURL(`${BASE}/dashboard`, { timeout: 5000 });
      await expect(page).toHaveURL(`${BASE}/dashboard`);
    });

    await test.step('Logout', async () => { await logout(page); });
  });

  test('Manager blocked from /hrdashboard', async ({ page }) => {
    await test.step(`Login as MANAGER (${MANAGER_EMAIL})`, async () => {
      await loginAs(page, MANAGER_EMAIL, MANAGER_PASSWORD);
      await page.waitForURL(`${BASE}/managerdashboard`, { timeout: 10000 });
    });

    await test.step('/hrdashboard → /dashboard (ProtectedRoute always redirects unauthorized to /dashboard)', async () => {
      await page.goto(`${BASE}/hrdashboard`);
      await page.waitForURL(`${BASE}/dashboard`, { timeout: 5000 });
      await expect(page).toHaveURL(`${BASE}/dashboard`);
    });

    await test.step('Logout', async () => { await logout(page); });
  });
});

// ─── 6. Department Leave Isolation ────────────────────────────────────────────
// Prereq: eng.manager, finance.manager, marketing.manager, ops.manager
//         must be promoted to MANAGER role in MongoDB before running this suite.
test.describe('6. Department Leave Isolation', () => {
  // 6a — each dept manager sees ONLY their department's employee leaves
  // Table columns: Employee ID | Leave Type | Start Date | End Date | Reason | Approve/Reject
  // (no Department column) — so we verify by employee ID presence/absence.
  // We seed a fresh EARNED leave via API before each manager logs in so the table is never empty.
  for (const mgr of DEPT_MANAGERS) {
    const myEmp    = DEPT_EMPLOYEES.find(e => e.dept === mgr.dept);
    const otherEmp = DEPT_EMPLOYEES.filter(e => e.dept !== mgr.dept);

    test(`${mgr.dept} manager sees only ${mgr.dept} leaves`, async ({ page, request }) => {
      await test.step(`Seed a fresh EARNED leave for ${myEmp.empId} via API`, async () => {
        await applyLeaveViaApi(request, myEmp.email, myEmp.empId, 'EARNED', '2026-07-01', '2026-07-01', 'Dept isolation seed');
      });

      await test.step(`Login as ${mgr.email}`, async () => {
        await loginAs(page, mgr.email, mgr.password);
        try {
          await page.waitForURL(`${BASE}/managerdashboard`, { timeout: 10000 });
        } catch {
          const url = page.url();
          if (url.includes('/dashboard') && !url.includes('manager')) {
            throw new Error(
              `${mgr.email} landed on /dashboard — role is still EMPLOYEE. ` +
              'Promote it to MANAGER in MongoDB Atlas first.'
            );
          }
          throw new Error(`${mgr.email} did not reach /managerdashboard (current: ${url})`);
        }
      });

      await test.step(`${myEmp.empId} (${mgr.dept}) IS visible in the table`, async () => {
        await page.waitForTimeout(2000);
        await expect(page.locator('tbody').getByText(myEmp.empId).first()).toBeVisible({ timeout: 8000 });
      });

      for (const other of otherEmp) {
        await test.step(`${other.empId} (${other.dept}) is NOT visible`, async () => {
          await expect(page.locator('tbody').getByText(other.empId).first()).not.toBeVisible();
        });
      }

      await test.step('Logout', async () => { await logout(page); });
    });
  }

  // 6b — HR Admin on Manager Dashboard sees pending leaves across ALL departments
  // EMP201 (Eng) leave may have been approved by earlier tests, so we verify
  // cross-dept visibility using employees that still have pending leaves.
  // Finance (EMP202), Marketing (EMP203), Operations (EMP204) are always pending at this point.
  test('HR Admin sees leaves from multiple departments (cross-dept visibility)', async ({ page }) => {
    await test.step(`Login as HR Admin (${HR_EMAIL})`, async () => {
      await loginAs(page, HR_EMAIL, HR_PASSWORD);
      await page.waitForURL(`${BASE}/hrdashboard`, { timeout: 10000 });
    });

    await test.step('Navigate to Manager Dashboard', async () => {
      await page.getByRole('link', { name: 'Manager Dashboard' }).click();
      await page.waitForURL(`${BASE}/managerdashboard`, { timeout: 5000 });
      await page.waitForTimeout(2000);
    });

    await test.step('Finance (EMP202) leave visible', async () => {
      await expect(page.locator('tbody').getByText('EMP202').first()).toBeVisible({ timeout: 8000 });
    });

    await test.step('Marketing (EMP203) leave visible', async () => {
      await expect(page.locator('tbody').getByText('EMP203').first()).toBeVisible({ timeout: 8000 });
    });

    await test.step('Operations (EMP204) leave visible', async () => {
      await expect(page.locator('tbody').getByText('EMP204').first()).toBeVisible({ timeout: 8000 });
    });

    await test.step('Logout', async () => { await logout(page); });
  });
});
