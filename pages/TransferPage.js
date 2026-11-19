class TransferPage {
  constructor(page) {
    this.page = page;
    this.amountInput = page.locator('#amount');
    this.fromSelect = page.locator('#fromAccountId');
    this.toSelect = page.locator('#toAccountId');
    this.transferButton = page.getByRole('button', { name: 'Transfer' });
    this.successHeading = page.getByRole('heading', { name: 'Transfer Complete!' });
  }

  async goto() {
    await this.page.goto('transfer.htm');
  }

  async accountIds() {
    return this.fromSelect.locator('option').allInnerTexts();
  }

  async transfer(amount, fromId, toId) {
    await this.amountInput.fill(String(amount));
    await this.fromSelect.selectOption(fromId);
    await this.toSelect.selectOption(toId);
    await this.transferButton.click();
  }
}

module.exports = { TransferPage };