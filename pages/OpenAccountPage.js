class OpenAccountPage {
  constructor(page) {
    this.page = page;
    this.typeSelect = page.locator('#type');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.openButton = page.getByRole('button', { name: 'Open New Account' });
    this.successHeading = page.getByRole('heading', { name: 'Account Opened!' });
    this.newAccountId = page.locator('#newAccountId');
  }

  async goto() {
    await this.page.goto('openaccount.htm');
  }

  async openAccount(type) {
    await this.typeSelect.selectOption(type); // 'SAVINGS' or 'CHECKING'
    // The "from account" list is filled in by the page after it loads
    await this.fromAccountSelect.locator('option').first().waitFor({ state: 'attached' });
    await this.openButton.click();
  }
}

module.exports = { OpenAccountPage };