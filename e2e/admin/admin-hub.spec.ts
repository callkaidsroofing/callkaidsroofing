import { test, expect } from '@playwright/test';

/**
 * Admin Hub E2E Tests
 *
 * These tests verify that all admin pages load correctly and
 * critical user flows work end-to-end.
 *
 * To run: npx playwright test
 * To debug: npx playwright test --debug
 */

// Test data - update with real test credentials
const TEST_USER = {
  email: process.env.TEST_ADMIN_EMAIL || 'admin@test.com',
  password: process.env.TEST_ADMIN_PASSWORD || 'test-password',
};

test.describe('Admin Hub - Authentication', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/auth');
    await expect(page).toHaveTitle(/Call Kaids Roofing/);
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/auth');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');

    // Should redirect to admin home after login
    await expect(page).toHaveURL(/\/admin/);
  });
});

test.describe('Admin Hub - Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/);
  });

  test('should navigate to CRM - Leads page', async ({ page }) => {
    await page.click('text=Leads');
    await expect(page).toHaveURL(/\/admin\/crm\/leads/);
    await expect(page.getByRole('heading', { name: /leads/i })).toBeVisible();
  });

  test('should navigate to CRM - Quotes page', async ({ page }) => {
    await page.click('text=Quotes');
    await expect(page).toHaveURL(/\/admin\/crm\/quotes/);
    await expect(page.getByRole('heading', { name: /inspections.*quotes/i })).toBeVisible();
  });

  test('should navigate to CRM - Jobs page', async ({ page }) => {
    await page.click('text=Jobs');
    await expect(page).toHaveURL(/\/admin\/crm\/jobs/);
    await expect(page.getByRole('heading', { name: /jobs.*quotes/i })).toBeVisible();
  });

  test('should navigate to CRM - Intelligence page', async ({ page }) => {
    await page.click('text=Intelligence');
    await expect(page).toHaveURL(/\/admin\/crm\/intelligence/);
    await expect(page.getByRole('heading', { name: /lead intelligence/i })).toBeVisible();
  });
});

test.describe('Admin Hub - CRM Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/);
  });

  test('Leads page should display pipeline', async ({ page }) => {
    await page.goto('/admin/crm/leads');

    // Check for pipeline stages
    await expect(page.getByText(/new/i)).toBeVisible();
    await expect(page.getByText(/contacted/i)).toBeVisible();
    await expect(page.getByText(/qualified/i)).toBeVisible();
  });

  test('Jobs List - View Details button should work', async ({ page }) => {
    await page.goto('/admin/crm/jobs');

    // Wait for jobs to load
    await page.waitForSelector('table', { timeout: 5000 }).catch(() => {
      // No jobs yet - that's okay
    });

    // If there are jobs, click View Details on first one
    const viewDetailsButton = page.getByRole('button', { name: /view details/i }).first();
    const isVisible = await viewDetailsButton.isVisible().catch(() => false);

    if (isVisible) {
      await viewDetailsButton.click();
      await expect(page).toHaveURL(/\/admin\/crm\/jobs\/[^/]+/);
      await expect(page.getByRole('heading', { name: /job details/i })).toBeVisible();
    }
  });

  test('Lead Intelligence should show metrics', async ({ page }) => {
    await page.goto('/admin/crm/intelligence');

    // Check for metric cards
    await expect(page.getByText(/total leads/i)).toBeVisible();
    await expect(page.getByText(/conversion rate/i)).toBeVisible();
    await expect(page.getByText(/hot leads/i)).toBeVisible();
  });
});

test.describe('Admin Hub - Tools Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/);
  });

  test('Inspection & Quote Builder should load', async ({ page }) => {
    await page.goto('/admin/tools/inspection-quote');
    await expect(page.getByText(/inspection/i)).toBeVisible();
  });

  test('Calculator should calculate estimates', async ({ page }) => {
    await page.goto('/admin/tools/calculator');

    // Fill in calculator form
    await page.selectOption('select', 'roof-restoration');
    await page.fill('input[placeholder*="area"]', '100');

    // Should show estimate
    await expect(page.getByText(/estimated/i)).toBeVisible();
  });

  test('Published Forms should display forms', async ({ page }) => {
    await page.goto('/admin/tools/forms');
    await expect(page.getByRole('heading', { name: /published forms/i })).toBeVisible();
  });
});

test.describe('Admin Hub - Content Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/);
  });

  test('Services Admin should load service list', async ({ page }) => {
    await page.goto('/admin/cms/services');
    await expect(page.getByRole('heading', { name: /services/i })).toBeVisible();
  });

  test('Suburbs Admin should load suburb list', async ({ page }) => {
    await page.goto('/admin/cms/suburbs');
    await expect(page.getByRole('heading', { name: /suburbs/i })).toBeVisible();
  });

  test('Case Studies should load', async ({ page }) => {
    await page.goto('/admin/cms/case-studies');
    await expect(page.getByText(/case study/i)).toBeVisible();
  });
});

test.describe('Admin Hub - Settings Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/);
  });

  test('Business Settings should show warning about persistence', async ({ page }) => {
    await page.goto('/admin/settings/business');

    // Click save to trigger warning
    await page.click('button:has-text("Save")');

    // Should show warning toast
    await expect(page.getByText(/not saved to database/i)).toBeVisible({ timeout: 3000 });
  });

  test('Pricing should load pricing items', async ({ page }) => {
    await page.goto('/admin/settings/pricing');
    await expect(page.getByText(/financial constants/i)).toBeVisible();
  });

  test('Forms Studio should load', async ({ page }) => {
    await page.goto('/admin/settings/forms');
    await expect(page.getByRole('heading', { name: /forms/i })).toBeVisible();
  });
});

test.describe('Admin Hub - Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/);
  });

  test('should handle non-existent job detail gracefully', async ({ page }) => {
    // Navigate to non-existent job
    await page.goto('/admin/crm/jobs/00000000-0000-0000-0000-000000000000');

    // Should show "Job Not Found" message
    await expect(page.getByText(/job not found/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /back to jobs/i })).toBeVisible();
  });

  test('should not crash on missing data', async ({ page }) => {
    // Navigate to various pages and ensure no crashes
    const pages = [
      '/admin/crm/leads',
      '/admin/crm/quotes',
      '/admin/crm/jobs',
      '/admin/cms/services',
      '/admin/cms/media-gallery',
    ];

    for (const url of pages) {
      await page.goto(url);
      // Page should load without errors
      await expect(page).toHaveURL(new RegExp(url));
      // Should not show generic error page
      await expect(page.getByText(/something went wrong/i)).not.toBeVisible();
    }
  });
});
