const { test, expect } = require('../../fixtures/base');

const JSON_HEADERS = { Accept: 'application/json' };

test('API returns the customer and their account', async ({ request, customer }) => {
  // Log in through the API with the user the fixture just registered
  const loginResponse = await request.get(
    `services/bank/login/${customer.username}/${customer.password}`,
    { headers: JSON_HEADERS }
  );
  expect(loginResponse.status()).toBe(200);
  const customerData = await loginResponse.json();
  console.log('LOGIN RESPONSE:', customerData);

  // Fetch that customer's accounts
  const accountsResponse = await request.get(
    `services/bank/customers/${customerData.id}/accounts`,
    { headers: JSON_HEADERS }
  );
  expect(accountsResponse.status()).toBe(200);
  const accounts = await accountsResponse.json();
  console.log('ACCOUNTS RESPONSE:', accounts);

  expect(accounts.length).toBeGreaterThan(0);
  expect(typeof accounts[0].balance).toBe('number');
});