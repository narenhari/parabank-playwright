const { test, expect } = require('../../fixtures/base');
const { JSON_HEADERS, getCustomerAccounts } = require('../../utils/api');

test('account details match the customer accounts list', async ({ request, customer }) => {
  const { customerId, accounts } = await getCustomerAccounts(request, customer);
  const fromList = accounts[0];

  const response = await request.get(`services/bank/accounts/${fromList.id}`, {
    headers: JSON_HEADERS,
  });
  expect(response.status()).toBe(200);
  const details = await response.json();

  expect(details.id).toBe(fromList.id);
  expect(details.customerId).toBe(customerId);
  expect(details.balance).toBe(fromList.balance);
});

test('unknown account id returns an error', async ({ request }) => {
  const response = await request.get('services/bank/accounts/99999999', {
    headers: JSON_HEADERS,
  });
  expect(response.status()).toBe(400);
});