const { test, expect } = require('../../fixtures/base');
const { AccountsPage } = require('../../pages/AccountsPage');
const { OpenAccountPage } = require('../../pages/OpenAccountPage');
const { TransferPage } = require('../../pages/TransferPage');

const invalidAmounts = ['', '0', 'abc'];

for (const amount of invalidAmounts) {
  test(`transfer with invalid amount "${amount}" is not completed`, async ({ page, customer }) => {

    test.fail(amount === '0', 'Known bug: ParaBank accepts a transfer of $0');
    const accountsPage = new AccountsPage(page);
    const openAccountPage = new OpenAccountPage(page);
    const transferPage = new TransferPage(page);

    // Setup: two accounts, so the only thing wrong with the transfer is the amount
    await openAccountPage.goto();
    await openAccountPage.openAccount('SAVINGS');
    await expect(openAccountPage.successHeading).toBeVisible();

    await transferPage.goto();
    await expect(transferPage.fromSelect.locator('option')).toHaveCount(2);
    const [fromId, toId] = await transferPage.accountIds();

    const fromBefore = await accountsPage.getBalanceCents(fromId);
    const toBefore = await accountsPage.getBalanceCents(toId);

    // Attempt the transfer with the bad amount
    await transferPage.goto();
    await transferPage.transfer(amount, fromId, toId);
    await page.waitForLoadState('networkidle');

    // It must not complete, and no money may move
    await expect(transferPage.successHeading).not.toBeVisible();
    expect(await accountsPage.getBalanceCents(fromId)).toBe(fromBefore);
    expect(await accountsPage.getBalanceCents(toId)).toBe(toBefore);
  });
}