class AccountsPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Accounts Overview' });
    this.logoutLink = page.getByRole('link', { name: 'Log Out' });
  }

  async logout() {
    await this.logoutLink.click();
  }
}

module.exports = { AccountsPage };