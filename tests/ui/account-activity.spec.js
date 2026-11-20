const { test, expect } = require('../../fixtures/base');
const { toCents } = require('../../utils/money');
const { AccountsPage } = require('../../pages/AccountsPage');
const { BillPayPage } = require('../../pages/BillPayPage');
const { AccountActivityPage } = require('../../pages/AccountActivityPage');

test('account details and activity reflect a bill payment', async ({ page, customer }) => {
  const accountsPage = new AccountsPage(page);
  const billPayPage = new BillPayPage(page);
  const activityPage = new AccountActivityPage(page);

  // Find the customer's account and its starting balance
  await accountsPage.goto();
  const accountId = (await page.locator('#accountTable a').first().innerText()).trim();
  const balanceBefore = await accountsPage.getBalanceCents(accountId);

  // Pay $15.00 from the default account
  await billPayPage.payFromDefaultAccount({ name: 'Gas Co', accountNumber: '99999' }, 15);
  await expect(billPayPage.successHeading).toBeVisible();

  // Check the details page
  await activityPage.open(accountId);
  await expect(activityPage.balance).toContainText('$'); // waits until the value is there
  const shownBalance = toCents(await activityPage.balance.innerText());
  expect(shownBalance).toBe(balanceBefore - 1500);

  // Check the payment is listed with the right amount
  const row = activityPage.transactionRow('Bill Payment to Gas Co');
  await expect(row).toBeVisible();
  await expect(row).toContainText('$15.00');
});