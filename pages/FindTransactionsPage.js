class FindTransactionsPage {
  constructor(page) {
    this.page = page;
    this.amountInput = page.locator('#amount');
    this.findByAmountButton = page.locator('#findByAmount');
    this.resultsTable = page.locator('#transactionTable');
  }

  async goto() {
    await this.page.goto('findtrans.htm');
  }

  async findByAmount(amount) {
    await this.amountInput.fill(String(amount));
    await this.findByAmountButton.click();
  }

  resultRow(text) {
    return this.resultsTable.locator('tr', { hasText: text });
  }
}

module.exports = { FindTransactionsPage };