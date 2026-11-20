class AccountActivityPage {
  constructor(page) {
    this.page = page;
    this.accountType = page.locator('#accountType');
    this.balance = page.locator('#balance');
    this.transactionTable = page.locator('#transactionTable');
  }

  async open(accountId) {
    await this.page.goto('overview.htm');
    await this.page.getByRole('link', { name: accountId }).click();
  }

  transactionRow(text) {
    return this.transactionTable.locator('tr', { hasText: text });
  }
}

module.exports = { AccountActivityPage };