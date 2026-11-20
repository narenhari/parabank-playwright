# ParaBank Test Automation (Playwright + JavaScript)

A growing UI and API test suite for [ParaBank](https://parabank.parasoft.com/parabank/index.htm), Parasoft's public demo banking application. I built it to practise test automation end to end: page objects, fixtures, API testing, hybrid UI + API checks, and a CI pipeline.

> Built with AI assistance. I reviewed, ran, broke on purpose and fixed every test myself.



## What is covered

**UI tests**
- Register a new customer, log out and log back in
- Login with a wrong password shows an error and no account data
- Open a new savings account and check its opening balance
- Transfer funds between two accounts and check both balances change by the exact amount
- Bill payment is confirmed and appears in the transaction history
- Find transactions by amount
- Account details and activity reflect a payment
- Transfer validation: blank, zero and non-numeric amounts must not complete a transfer

**API tests** (Playwright's `request` fixture, against ParaBank's REST service)
- Log in and list a customer's accounts
- Account details match the customer's account list
- An unknown account id returns an error
- Transfer through the API moves the exact amount between two accounts
- Hybrid check: a transfer made in the UI shows the same balances through the API

## How it is built

- **Page Object Model.** Each page of the site has a class in `pages/`, so locators live in one place and tests read as steps.
- **Fixtures.** `fixtures/base.js` provides a `customer` fixture that registers a fresh user before a test starts.
- **Unique test data per test.** ParaBank is a shared public instance, so every test registers its own user instead of reusing one. Tests never touch other people's data and don't depend on each other.
- **Assertions on differences, not fixed numbers.** Balance checks compare "before" and "after" (in whole cents) because opening balances are not guaranteed.
- **Hybrid tests.** Some API tests use the UI for setup and the API for verification, and the other way round.

```
parabank-playwright/
├── pages/            page objects (login, register, accounts, transfer, bill pay, ...)
├── fixtures/         shared test setup (the `customer` fixture)
├── tests/
│   ├── ui/           browser tests
│   └── api/          API and hybrid tests
├── utils/            test data, money helpers, API helpers
└── .github/workflows/  CI pipeline
```

## Running it

Requires Node.js.

```bash
git clone https://github.com/narenhari/parabank-playwright.git
cd parabank-playwright
npm install
npx playwright install chromium
npx playwright test
```

Useful variations:

```bash
npx playwright test tests/api          # API tests only
npx playwright test tests/ui           # UI tests only
npx playwright test --headed           # watch the browser
npx playwright show-report             # open the HTML report
```

On Windows, use forward slashes in path filters (`tests/api`), because Playwright treats them as regular expressions.

## CI

GitHub Actions runs the suite in Chromium and uploads the HTML report as an artifact. It runs on demand (the **Run workflow** button) and once a day, not on every push. The reason is in the next section.

## Findings

Things this project turned up along the way:

- **ParaBank appears to accept a transfer of $0.** The validation test for a zero amount fails because the "Transfer Complete" page is shown. I treat this as a likely bug, since a zero transfer has no meaning in a banking app. The test is marked as an expected failure (`test.fail`) with a comment, so the suite stays green, and it will flag itself if the behaviour is ever fixed. Blank and non-numeric amounts are rejected correctly.
- **A file-name case bug caught by CI.** A page object was saved as `openAccountPage.js` but imported as `OpenAccountPage`. Windows ignores case, so it passed locally, but the Linux runner failed. Fixed by renaming the file through git.
- **A slow pipeline caused by installing every browser.** The default workflow downloaded Chromium, Firefox and WebKit each run (one run spent about 14 minutes on it). The tests only use Chromium, so the workflow installs only that.
- **CI got rate-limited by the target site.** After several runs in a row, ParaBank's Cloudflare protection started returning "Error 1015, you are being rate limited" to the GitHub runner, which made the registration step fail. That is why CI runs on demand and daily instead of on every push.

## Limitations

- The target is a shared public demo that other people use too. It can be slow, reset its data or rate-limit, so occasional failures from the site itself are possible.
- The `test.fail` marker for the zero-amount case sits inside the test body. If the `customer` fixture fails before the body runs (for example, during a rate limit), that test counts as a normal failure.
- Cross-browser runs, accessibility checks and more edge cases around money handling are not included yet.

## Tech

Playwright Test, JavaScript (Node.js), GitHub Actions.
