const { test, expect } = require('../../fixtures/base');
const { BillPayPage } = require('../../pages/BillPayPage');
const { FindTransactionsPage } = require('../../pages/FindTransactionsPage');

test('find transactions by amount returns the matching payment', async ({ page, customer }) => {
  const billPayPage = new BillPayPage(page);
  const findPage = new FindTransactionsPage(page);

  // An unusual amount makes the search result unambiguous
  await billPayPage.payFromDefaultAccount({ name: 'Water Co', accountNumber: '54321' }, 37.42);
  await expect(billPayPage.successHeading).toBeVisible();

  await findPage.goto();
  await findPage.findByAmount('37.42');

  const row = findPage.resultRow('Bill Payment to Water Co');
  await expect(row).toBeVisible();
  await expect(row).toContainText('$37.42');
});//