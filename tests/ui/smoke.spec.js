const { test, expect } = require('@playwright/test');

test('ParaBank login page loads', async ({ page }) => {
  await page.goto('index.htm');
  await expect(page.getByRole('button', { name: 'Log In' })).toBeVisible();
});