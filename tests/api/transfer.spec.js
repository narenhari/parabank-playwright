const { test, expect } = require('../../fixtures/base');
const { OpenAccountPage } = require('../../pages/OpenAccountPage');
const { getCustomerAccounts, getBalanceCents } = require('../../utils/api');

test('transfer via API moves the exact amount between two accounts', async ({ page, request, customer }) => {
  // Setup: give the customer a second account (done through the website)
  const openAccountPage = new OpenAccountPage(page);
  await openAccountPage.goto();
  await openAccountPage.openAccount('SAVINGS');
  await expect(openAccountPage.successHeading).toBeVisible();

  const { accounts } = await getCustomerAccounts(request, customer);
  expect(accounts.length).toBe(2);
  const [from, to] = accounts;

  const fromBefore = await getBalanceCents(request, from.id);
  const toBefore = await getBalanceCents(request, to.id);

  // Transfer $50.00 through the API
  const response = await request.post('services/bank/transfer', {
    params: { fromAccountId: from.id, toAccountId: to.id, amount: 50 },
  });
  expect(response.status()).toBe(200);

  expect(await getBalanceCents(request, from.id)).toBe(fromBefore - 5000);
  expect(await getBalanceCents(request, to.id)).toBe(toBefore + 5000);
});