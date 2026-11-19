const { test, expect } = require('@playwright/test');
const { uniqueUser } = require('../../utils/testData');
const { RegisterPage } = require('../../pages/RegisterPage');
const { LoginPage } = require('../../pages/LoginPage');
const { AccountsPage } = require('../../pages/AccountsPage');

test('new customer can register, log out and log back in', async ({ page }) => {
  const user = uniqueUser();
  const registerPage = new RegisterPage(page);
  const loginPage = new LoginPage(page);
  const accountsPage = new AccountsPage(page);

  // Register (ParaBank logs the new user in automatically)
  await registerPage.goto();
  await registerPage.register(user);
  await expect(registerPage.successMessage).toBeVisible();

  // Log out, then log in again with the same credentials
  await accountsPage.logout();
  await loginPage.login(user.username, user.password);

  await expect(accountsPage.heading).toBeVisible();
});
test('login with a wrong password shows an error and no account data', async ({ page }) => {
  const user = uniqueUser();
  const registerPage = new RegisterPage(page);
  const loginPage = new LoginPage(page);
  const accountsPage = new AccountsPage(page);

  // Create a real user so we are testing a wrong password, not a missing user
  await registerPage.goto();
  await registerPage.register(user);
  await expect(registerPage.successMessage).toBeVisible();
  await accountsPage.logout();

  await loginPage.login(user.username, 'WrongPassword!1');

  await expect(loginPage.errorMessage).toBeVisible();
  await expect(accountsPage.heading).not.toBeVisible();
});