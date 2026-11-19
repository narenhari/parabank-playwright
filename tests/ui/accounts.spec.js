const { test, expect } = require('@playwright/test');
const { uniqueUser } = require('../../utils/testData');
const { RegisterPage } = require('../../pages/RegisterPage');
const { AccountsPage } = require('../../pages/AccountsPage');
const { OpenAccountPage } = require('../../pages/OpenAccountPage');

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