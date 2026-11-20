const { expect } = require('@playwright/test');

const JSON_HEADERS = { Accept: 'application/json' };

// Logs in through the API and returns the customer id and their accounts
async function getCustomerAccounts(request, user) {
  const loginResponse = await request.get(
    `services/bank/login/${user.username}/${user.password}`,
    { headers: JSON_HEADERS }
  );
  expect(loginResponse.status()).toBe(200);
  const customerData = await loginResponse.json();

  const accountsResponse = await request.get(
    `services/bank/customers/${customerData.id}/accounts`,
    { headers: JSON_HEADERS }
  );
  expect(accountsResponse.status()).toBe(200);
  const accounts = await accountsResponse.json();

  return { customerId: customerData.id, accounts };
}

// Returns an account's balance in whole cents, read through the API
async function getBalanceCents(request, accountId) {
  const response = await request.get(`services/bank/accounts/${accountId}`, {
    headers: JSON_HEADERS,
  });
  expect(response.status()).toBe(200);
  const account = await response.json();
  return Math.round(account.balance * 100);
}

module.exports = { JSON_HEADERS, getCustomerAccounts, getBalanceCents };