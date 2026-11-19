const { test, expect } = require('@playwright/test');
const { uniqueUser } = require('../../utils/testData');
const { RegisterPage } = require('../../pages/RegisterPage');
const { AccountsPage } = require('../../pages/AccountsPage');
const { OpenAccountPage } = require('../../pages/OpenAccountPage');
const { TransferPage } = require('../../pages/TransferPage');

test('customer can open a new savings account with the right opening balance', async ({ page }) => {
  const user = uniqueUser();
  const registerPage = new RegisterPage(page);
  const accountsPage = new AccountsPage(page);
  const openAccountPage = new OpenAccountPage(page);

  await registerPage.goto();
  await registerPage.register(user);
  await expect(registerPage.successMessage).toBeVisible();

  await openAccountPage.goto();
  await openAccountPage.openAccount('SAVINGS');
  await expect(openAccountPage.successHeading).toBeVisible();
  const newAccountId = await openAccountPage.newAccountId.innerText();

  await accountsPage.goto();
  await expect(accountsPage.accountRow(newAccountId)).toContainText('$100.00');
});

test('transfer moves the exact amount between two accounts', async ({ page }) => {
  const user = uniqueUser();
  const registerPage = new RegisterPage(page);
  const accountsPage = new AccountsPage(page);
  const openAccountPage = new OpenAccountPage(page);
  const transferPage = new TransferPage(page);

  // Setup: a new customer with two accounts
  await registerPage.goto();
  await registerPage.register(user);
  await expect(registerPage.successMessage).toBeVisible();
  await openAccountPage.goto();
  await openAccountPage.openAccount('SAVINGS');
  await expect(openAccountPage.successHeading).toBeVisible();

  await transferPage.goto();
  await expect(transferPage.fromSelect.locator('option')).toHaveCount(2);
  const [fromId, toId] = await transferPage.accountIds();

  const fromBefore = await accountsPage.getBalanceCents(fromId);
  const toBefore = await accountsPage.getBalanceCents(toId);

  // Transfer $50.00
  await transferPage.goto();
  await transferPage.transfer(50, fromId, toId);
  await expect(transferPage.successHeading).toBeVisible();

  const fromAfter = await accountsPage.getBalanceCents(fromId);
  const toAfter = await accountsPage.getBalanceCents(toId);

  expect(fromAfter).toBe(fromBefore - 5000);
  expect(toAfter).toBe(toBefore + 5000);
});