class AccountsPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Accounts Overview' });
    this.logoutLink = page.getByRole('link', { name: 'Log Out' });
  }

  async logout() {
    await this.logoutLink.click();
  }
    async goto() {
    await this.page.goto('overview.htm');
  }

  accountRow(accountId) {
    return this.page.locator('#accountTable tr', {
      has: this.page.getByRole('link', { name: accountId }),
    });
  }
    async getBalanceCents(accountId) {
    const { toCents } = require('../utils/money');
    await this.goto();
    const text = await this.accountRow(accountId).locator('td').nth(1).innerText();
    return toCents(text);
  }
}

module.exports = { AccountsPage };