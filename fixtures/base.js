const base = require('@playwright/test');
const { uniqueUser } = require('../utils/testData');
const { RegisterPage } = require('../pages/RegisterPage');

const test = base.test.extend({
  // Registers a fresh customer and leaves the browser logged in as them
  customer: async ({ page }, use) => {
    const user = uniqueUser();
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.register(user);
    await base.expect(registerPage.successMessage).toBeVisible();
    await use(user);
  },
});

module.exports = { test, expect: base.expect };