const { test, expect } = require('../../fixtures/base');
const { AccountsPage } = require('../../pages/AccountsPage');
const { OpenAccountPage } = require('../../pages/OpenAccountPage');
const { TransferPage } = require('../../pages/TransferPage');
const { getBalanceCents: getApiBalanceCents } = require('../../utils/api');

test('a transfer made in the UI shows the same balances in the API', async ({ page, request, customer }) => {
  const accountsPage = new AccountsPage(page);
  const openAccountPage = new OpenAccountPage(page);
  const transferPage = new TransferPage(page);

  // Setup: give the customer a second account
  await openAccountPage.goto();
  await openAccountPage.openAccount('SAVINGS');
  await expect(openAccountPage.successHeading).toBeVisible();

  await transferPage.goto();
  await expect(transferPage.fromSelect.locator('option')).toHaveCount(2);
  const [fromId, toId] = await transferPage.accountIds();

  // Balances according to the API, before the transfer
  const apiFromBefore = await getApiBalanceCents(request, fromId);
  const apiToBefore = await getApiBalanceCents(request, toId);

  // Make the transfer in the browser
  await transferPage.transfer(50, fromId, toId);
  await expect(transferPage.successHeading).toBeVisible();

  // Balances according to the website
  const uiFrom = await accountsPage.getBalanceCents(fromId);
  const uiTo = await accountsPage.getBalanceCents(toId);

  // The API must agree with the website...
  expect(await getApiBalanceCents(request, fromId)).toBe(uiFrom);
  expect(await getApiBalanceCents(request, toId)).toBe(uiTo);

  // ...and both must reflect exactly the $50.00 that moved
  expect(uiFrom).toBe(apiFromBefore - 5000);
  expect(uiTo).toBe(apiToBefore + 5000);
});