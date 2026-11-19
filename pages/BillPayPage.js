class BillPayPage {
  constructor(page) {
    this.page = page;
    this.field = (name) => page.locator(`input[name="${name}"]`);
    this.fromSelect = page.locator('select[name="fromAccountId"]');
    this.sendButton = page.getByRole('button', { name: 'Send Payment' });
    this.successHeading = page.getByRole('heading', { name: 'Bill Payment Complete' });
  }

  async goto() {
    await this.page.goto('billpay.htm');
  }

  async pay(payee, amount, fromId) {
    await this.field('payee.name').fill(payee.name);
    await this.field('payee.address.street').fill('1 Payee Street');
    await this.field('payee.address.city').fill('Melbourne');
    await this.field('payee.address.state').fill('VIC');
    await this.field('payee.address.zipCode').fill('3000');
    await this.field('payee.phoneNumber').fill('0400000000');
    await this.field('payee.accountNumber').fill(payee.accountNumber);
    await this.field('verifyAccount').fill(payee.accountNumber);
    await this.field('amount').fill(String(amount));
    await this.fromSelect.selectOption(fromId);
    await this.sendButton.click();
  }
}

module.exports = { BillPayPage };