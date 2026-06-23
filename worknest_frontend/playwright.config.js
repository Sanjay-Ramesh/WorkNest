// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

config(); // load .env before tests read process.env

export default defineConfig({
  globalSetup: './tests/global-setup.js',
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.TEST_BASE_URL || 'http://localhost:5173',
    headless: false,
    screenshot: 'only-on-failure',
    video: 'off',
    trace: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
