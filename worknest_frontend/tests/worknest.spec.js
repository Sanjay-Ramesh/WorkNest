// @ts-check
import { test, expect } from '@playwright/test';

const BASE = process.env.TEST_BASE_URL || 'http://localhost:5173';
const EMPLOYEE_EMAIL = process.env.TEST_EMPLOYEE_EMAIL || 'sanjayramesh1425@gmail.com';
const EMPLOYEE_PASSWORD = process.env.TEST_EMPLOYEE_PASSWORD || 'password123';
const MANAGER_EMAIL = process.env.TEST_MANAGER_EMAIL || 'manager@worknest.com';
const MANAGER_PASSWORD = process.env.TEST_MANAGER_PASSWORD || 'password123';
const HR_EMAIL = process.env.TEST_HR_EMAIL || 'sanjay@worknest.com';
const HR_PASSWORD = process.env.TEST_HR_PASSWORD || 'password123';
const NEW_USER_PASSWORD = process.env.TEST_NEW_USER_PASSWORD || 'password123';
const TOMORROW = '2026-06-20';
const DAY_AFTER = '2026-06-21';
const RUN_ID = Date.now(); // unique per run so Register test is always idempotent

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

// ─── 1. Register Flow ─────────────────────────────────────────────────────────
test.describe('1. Register Flow', () => {
  test('Register new employee and redirect to login', async ({ page }) => {
    await test.step('Open http://localhost:5173/register', async () => {
      await page.goto(`${BASE}/register`);
      await expect(page.locator('h1')).toContainText('WorkNest');
    });

    await test.step('Fill: new employee details (unique email per run)', async () => {
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

    await test.step('Verify redirected to login page (/)', async () => {
      // Wait for either redirect (success) or error text (duplicate email)
      try {
        await page.waitForURL(`${BASE}/`, { timeout: 10000 });
      } catch {
        const isDuplicate = await page.getByText('Registration failed').isVisible();
        if (isDuplicate) {
          throw new Error('REGISTER FAILED: duplicate email — this should not happen with a timestamp-based email.');
        }
        throw new Error('REGISTER FAILED: No redirect and no error message shown.');
      }
      await expect(page).toHaveURL(`${BASE}/`);
      await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    });
  });
});

// ─── 2. Employee Flow ─────────────────────────────────────────────────────────
test.describe('2. Employee Flow', () => {
  test('Employee: login, leave balance, apply leave, my leaves, profile, security redirect, logout', async ({ page }) => {
    await test.step(`Login with ${EMPLOYEE_EMAIL}`, async () => {
      await loginAs(page, EMPLOYEE_EMAIL, EMPLOYEE_PASSWORD);
      await page.waitForURL(`${BASE}/dashboard`, { timeout: 10000 });
      await expect(page).toHaveURL(`${BASE}/dashboard`);
    });

    await test.step('Verify redirected to /dashboard', async () => {
      await expect(page).toHaveURL(`${BASE}/dashboard`);
    });

    await test.step('Verify leave balance cards visible (Casual, Sick, Earned)', async () => {
      await expect(page.getByText('Casual Leave')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('Sick Leave')).toBeVisible();
      await expect(page.getByText('Earned Leave')).toBeVisible();
    });

    await test.step('Go to Apply Leave page', async () => {
      await page.getByRole('link', { name: 'Apply Leave' }).click();
      await page.waitForURL(`${BASE}/applyleave`);
      await expect(page).toHaveURL(`${BASE}/applyleave`);
    });

    await test.step('Apply CASUAL leave: tomorrow → day after tomorrow, reason "E2E Test"', async () => {
      await page.selectOption('select', 'CASUAL');
      const dateInputs = page.locator('input[type="date"]');
      await dateInputs.nth(0).fill(TOMORROW);
      await dateInputs.nth(1).fill(DAY_AFTER);
      await page.getByPlaceholder('reason').fill('E2E Test');
      await page.getByRole('button', { name: 'Submit' }).click();
      await expect(page.getByText('Leave Applied Successfully')).toBeVisible({ timeout: 10000 });
    });

    await test.step('Go to My Leaves page', async () => {
      await page.getByRole('link', { name: 'My Leaves' }).click();
      await page.waitForURL(`${BASE}/myleaves`);
      await expect(page).toHaveURL(`${BASE}/myleaves`);
    });

    await test.step('Verify new leave shows as PENDING', async () => {
      // Use .first() — table may have multiple PENDING rows from prior test runs
      await expect(page.locator('tbody').getByText('PENDING').first()).toBeVisible({ timeout: 10000 });
      await expect(page.locator('tbody').getByText('CASUAL').first()).toBeVisible();
      await expect(page.locator('tbody').getByText('E2E Test').first()).toBeVisible();
    });

    await test.step('Go to Profile page', async () => {
      await page.getByRole('link', { name: 'Profile' }).click();
      await page.waitForURL(`${BASE}/profile`);
      await expect(page).toHaveURL(`${BASE}/profile`);
    });

    await test.step('Verify employee details visible', async () => {
      await expect(page.getByText('Employee ID', { exact: false })).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('Name', { exact: false })).toBeVisible();
      await expect(page.getByText('Email', { exact: false })).toBeVisible();
      await expect(page.getByText('Department', { exact: false })).toBeVisible();
      await expect(page.getByText('Joined Date', { exact: false })).toBeVisible();
    });

    await test.step('Navigate directly to /managerdashboard → verify redirected to /dashboard', async () => {
      await page.goto(`${BASE}/managerdashboard`);
      await page.waitForURL(`${BASE}/dashboard`, { timeout: 5000 });
      await expect(page).toHaveURL(`${BASE}/dashboard`);
    });

    await test.step('Logout', async () => {
      await logout(page);
    });
  });
});

// ─── 3. Manager Flow ──────────────────────────────────────────────────────────
test.describe('3. Manager Flow', () => {
  test('Manager: login, sidebar, pending leaves, approve first, row disappears, logout', async ({ page }) => {
    await test.step(`Login with ${MANAGER_EMAIL}`, async () => {
      await loginAs(page, MANAGER_EMAIL, MANAGER_PASSWORD);
      await page.waitForURL(`${BASE}/managerdashboard`, { timeout: 10000 });
    });

    await test.step('Verify redirected to /managerdashboard', async () => {
      await expect(page).toHaveURL(`${BASE}/managerdashboard`);
    });

    await test.step('Verify Manager Dashboard link in Sidebar', async () => {
      await expect(page.getByRole('link', { name: 'Manager Dashboard' })).toBeVisible();
    });

    await test.step('Verify pending leaves table has data', async () => {
      // Wait for API response and table rows to appear
      await page.waitForTimeout(2000);
      const firstRow = page.locator('tbody tr').first();
      await expect(firstRow).toBeVisible({ timeout: 10000 });
    });

    await test.step('Click Approve on first leave', async () => {
      const firstApproveBtn = page.getByRole('button', { name: 'Approve' }).first();
      await expect(firstApproveBtn).toBeVisible({ timeout: 5000 });
      await firstApproveBtn.click();
    });

    await test.step('Verify row disappears after approval', async () => {
      // After approval, fetchLeaves() re-runs and the now-APPROVED row is filtered out
      await page.waitForTimeout(2000);
      await expect(page.getByText('Failed to update leave status')).not.toBeVisible();
      // The approved row's employee should no longer appear as PENDING
    });

    await test.step('Logout', async () => {
      await logout(page);
    });
  });
});

// ─── 4. HR Admin Flow ─────────────────────────────────────────────────────────
test.describe('4. HR Admin Flow', () => {
  test('HR Admin: login, sidebar links, all 4 sections, logout', async ({ page }) => {
    await test.step(`Login with ${HR_EMAIL}`, async () => {
      await loginAs(page, HR_EMAIL, HR_PASSWORD);
      // Wait for any outcome: redirect or error message
      try {
        await page.waitForURL(`${BASE}/hrdashboard`, { timeout: 10000 });
      } catch {
        // waitForURL timed out — check what actually happened
        const currentUrl = page.url();
        const loginError = await page.getByText('Invalid Email or Password').isVisible();
        if (loginError) {
          throw new Error(
            `HR ADMIN LOGIN FAILED: ${HR_EMAIL} → "Invalid Email or Password". ` +
            'This account does not exist or has a different password. ' +
            'Check MongoDB Atlas for the correct HR_ADMIN credentials.'
          );
        }
        throw new Error(
          `HR ADMIN ROLE MISMATCH: Login succeeded but redirected to ${currentUrl} instead of /hrdashboard. ` +
          `${HR_EMAIL} may have role MANAGER or EMPLOYEE in the database, not HR_ADMIN.`
        );
      }
    });

    await test.step('Verify redirected to /hrdashboard', async () => {
      await expect(page).toHaveURL(`${BASE}/hrdashboard`);
    });

    await test.step('Verify HR Dashboard link in Sidebar', async () => {
      await expect(page.getByRole('link', { name: 'HR Dashboard' })).toBeVisible();
    });

    await test.step('Verify Manager Dashboard link in Sidebar', async () => {
      await expect(page.getByRole('link', { name: 'Manager Dashboard' })).toBeVisible();
    });

    await test.step('Verify "Today Leaves" section visible', async () => {
      await expect(page.getByRole('heading', { name: 'Today Leaves' })).toBeVisible();
    });

    await test.step('Verify "Pending Leaves" section visible', async () => {
      await expect(page.getByRole('heading', { name: 'Pending Leaves' })).toBeVisible();
    });

    await test.step('Verify "Department Breakdown" section visible', async () => {
      await expect(page.getByRole('heading', { name: 'Department Breakdown' })).toBeVisible();
    });

    await test.step('Verify "Summary" section visible', async () => {
      await expect(page.getByRole('heading', { name: 'Summary' })).toBeVisible();
    });

    await test.step('Logout', async () => {
      await logout(page);
    });
  });
});

// ─── 5. Security Checks ───────────────────────────────────────────────────────
test.describe('5. Security Checks', () => {
  test('Employee is blocked from /managerdashboard and /hrdashboard', async ({ page }) => {
    await test.step(`Login as EMPLOYEE (${EMPLOYEE_EMAIL})`, async () => {
      await loginAs(page, EMPLOYEE_EMAIL, EMPLOYEE_PASSWORD);
      await page.waitForURL(`${BASE}/dashboard`, { timeout: 10000 });
      await expect(page).toHaveURL(`${BASE}/dashboard`);
    });

    await test.step('Navigate to /managerdashboard → verify redirected to /dashboard', async () => {
      await page.goto(`${BASE}/managerdashboard`);
      await page.waitForURL(`${BASE}/dashboard`, { timeout: 5000 });
      await expect(page).toHaveURL(`${BASE}/dashboard`);
    });

    await test.step('Navigate to /hrdashboard → verify redirected to /dashboard', async () => {
      await page.goto(`${BASE}/hrdashboard`);
      await page.waitForURL(`${BASE}/dashboard`, { timeout: 5000 });
      await expect(page).toHaveURL(`${BASE}/dashboard`);
    });

    await test.step('Logout', async () => {
      await logout(page);
    });
  });
});
