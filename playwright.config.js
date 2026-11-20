// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // One test at a time: ParaBank is a shared public site that rate-limits bursts
  fullyParallel: false,
  workers: 1,

  forbidOnly: !!process.env.CI,
  // Retries add more traffic when the site is blocking us, so keep them low
  retries: process.env.CI ? 1 : 0,
  reporter: [['html', { open: 'never' }]],

  use: {
    baseURL: 'https://parabank.parasoft.com/parabank/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});