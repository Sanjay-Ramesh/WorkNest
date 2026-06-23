// Global setup — runs once before the entire Playwright suite.
// Validates that every required env var is present and non-empty.
// A missing var fails loudly here rather than silently passing auth steps
// and producing misleading "wrong credentials" failures mid-suite.

import { config } from 'dotenv';
config();

const REQUIRED = [
  ['TEST_EMPLOYEE_EMAIL',    'email of the seeded EMPLOYEE account'],
  ['TEST_EMPLOYEE_PASSWORD', 'password of the seeded EMPLOYEE account'],
  ['TEST_MANAGER_EMAIL',     'email of the seeded MANAGER account'],
  ['TEST_MANAGER_PASSWORD',  'password of the seeded MANAGER account'],
  ['TEST_HR_EMAIL',          'email of the seeded HR_ADMIN account'],
  ['TEST_HR_PASSWORD',       'password of the seeded HR_ADMIN account'],
  ['TEST_NEW_USER_PASSWORD', 'password to use when registering a fresh test user'],
  ['TEST_DEPT_PASSWORD',     'shared password for seeded dept-manager / dept-employee accounts'],
];

export default async function globalSetup() {
  const missing = REQUIRED.filter(([key]) => !process.env[key]);

  if (missing.length === 0) return;

  const lines = missing.map(([key, desc]) => `  ${key.padEnd(28)} — ${desc}`);

  throw new Error(
    `\n\nPlaywright env validation failed — ${missing.length} required variable(s) missing from .env:\n\n` +
    lines.join('\n') +
    '\n\nCopy worknest_frontend/.env.example → .env and fill in the real values.\n'
  );
}
