# Admin Hub E2E Tests

End-to-end tests for the Admin Hub using Playwright.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers (if not in restricted environment):
```bash
npx playwright install
```

3. Set environment variables:
```bash
export TEST_ADMIN_EMAIL="your-test-admin@email.com"
export TEST_ADMIN_PASSWORD="your-test-password"
export PLAYWRIGHT_BASE_URL="http://localhost:5173"
```

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run specific test file
```bash
npx playwright test e2e/admin/admin-hub.spec.ts
```

### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

### Run tests in debug mode
```bash
npx playwright test --debug
```

### Run specific test by name
```bash
npx playwright test -g "should navigate to CRM - Leads page"
```

### Run tests in specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Viewing Test Results

### Show HTML report
```bash
npx playwright show-report
```

### View test traces (for debugging failures)
```bash
npx playwright show-trace trace.zip
```

## Test Structure

- `e2e/admin/admin-hub.spec.ts` - Main admin hub tests covering:
  - Authentication
  - Navigation across all 29 pages
  - CRM section functionality
  - Tools section functionality
  - Content section functionality
  - Settings section functionality
  - Error handling

## Test Coverage

Current test coverage:
- ✅ Authentication flow
- ✅ Navigation to all major sections
- ✅ CRM section (4 pages)
- ✅ Tools section (5 pages)
- ✅ Content section (4 pages)
- ✅ Settings section (3 pages)
- ✅ Error handling (404s, missing data)

## Adding New Tests

1. Create new test file in `e2e/` directory
2. Import test and expect from '@playwright/test'
3. Use `test.describe()` for grouping
4. Use `test.beforeEach()` for setup (like login)
5. Write tests using `test('description', async ({ page }) => {})`

Example:
```typescript
import { test, expect } from '@playwright/test';

test.describe('My Feature', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/my-page');
    await expect(page.getByRole('heading')).toBeVisible();
  });
});
```

## CI/CD Integration

Add to your CI pipeline:
```yaml
- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npx playwright test
  env:
    TEST_ADMIN_EMAIL: ${{ secrets.TEST_ADMIN_EMAIL }}
    TEST_ADMIN_PASSWORD: ${{ secrets.TEST_ADMIN_PASSWORD }}

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Notes

- Tests require a running instance of the application (dev server or production)
- Tests use real Supabase backend - ensure test database is configured
- Sensitive credentials should be stored in environment variables
- Browser downloads may be blocked in some environments - tests can still be written
