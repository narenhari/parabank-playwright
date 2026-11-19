const { test, expect } = require('../../fixtures/base');
const { AccountsPage } = require('../../pages/AccountsPage');
const { BillPayPage } = require('../../pages/BillPayPage');

test('bill payment is confirmed and shows in transaction history', async ({ page, customer }) => {
  const accountsPage = new AccountsPage(page);
  const billPayPage = new BillPayPage(page);
  const payee = { name: 'Electric Co', accountNumber: '12345' };

  await billPayPage.goto();
  await billPayPage.fromSelect.locator('option').first().waitFor({ state: 'attached' });
  const fromId = (await billPayPage.fromSelect.locator('option').first().innerText()).trim();

  await billPayPage.pay(payee, 25, fromId);
  await expect(billPayPage.successHeading).toBeVisible();

  // Open the account's activity page and look for the payment
  await accountsPage.goto();
  await page.getByRole('link', { name: fromId }).click();
  const row = page.locator('#transactionTable tr', { hasText: 'Bill Payment to Electric Co' });
  await expect(row).toContainText('$25.00');
});