import { test, expect } from '@playwright/test';
import { setupApiMocks } from './helpers/mockApi';

test.describe('Dashboard & Core Navigation UI', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page, { loggedIn: true });
    await page.goto('/#/');
  });

  test('should render Dashboard summary metrics, balance card, and period selectors', async ({ page }) => {
    // Total Balance card
    await expect(page.locator('text=Total Balance').first()).toBeVisible();
    await expect(page.locator('text=Active').first()).toBeVisible();

    // Period selectors (using exact match)
    await expect(page.getByRole('button', { name: 'This Month', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'This Year', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'All Time', exact: true })).toBeVisible();

    // Click another period and verify active style
    await page.getByRole('button', { name: 'This Year', exact: true }).click();
    await expect(page.getByRole('button', { name: 'This Year', exact: true })).toHaveClass(/gradient-blue/);

    // Metric stat cards
    await expect(page.locator('text=Income').first()).toBeVisible();
    await expect(page.locator('text=Expenses').first()).toBeVisible();
    await expect(page.locator('text=Net Worth').first()).toBeVisible();
    await expect(page.locator('text=Savings Rate').first()).toBeVisible();
  });

  test('should open and close the Account Breakdown modal', async ({ page }) => {
    // Click 'View Details' on balance card
    const viewDetailsBtn = page.getByRole('button', { name: /view details/i });
    await expect(viewDetailsBtn).toBeVisible();
    await viewDetailsBtn.click();

    // Modal should show breakdown details
    await expect(page.getByRole('heading', { name: 'Account Summary' })).toBeVisible();
    await expect(page.locator('text=UPI').first()).toBeVisible();

    // Close modal via Close button
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('heading', { name: 'Account Summary' })).not.toBeVisible();
  });

  test('should toggle dark/light theme mode', async ({ page }) => {
    const html = page.locator('html');

    // Find the theme toggle button in the header
    const themeBtn = page.locator('header button[title*="mode"], header button:has(svg.lucide-sun), header button:has(svg.lucide-moon)').first();
    await expect(themeBtn).toBeVisible();

    // Initial state check
    const initialTheme = await html.getAttribute('data-theme');

    // Click toggle
    await themeBtn.click();

    // Expect theme attribute or class to change
    if (initialTheme === 'dark') {
      await expect(html).toHaveAttribute('data-theme', 'light');
    } else {
      await expect(html).toHaveAttribute('data-theme', 'dark');
    }

    // Toggle back
    await themeBtn.click();
    if (initialTheme === 'dark') {
      await expect(html).toHaveAttribute('data-theme', 'dark');
    }
  });

  test('should toggle sidebar collapse state', async ({ page }) => {
    const aside = page.locator('aside.sidebar');
    await expect(aside).toBeVisible();

    const collapseBtn = aside.locator('button[title*="sidebar"]');
    await expect(collapseBtn).toBeVisible();

    // Click collapse
    await collapseBtn.click();
    await expect(aside).toHaveClass(/w-20/);

    // Click expand
    await collapseBtn.click();
    await expect(aside).toHaveClass(/w-60/);
  });

  test('should navigate to all core modules via sidebar', async ({ page }) => {
    const aside = page.locator('aside.sidebar');

    // 1. History
    await aside.getByRole('button', { name: 'History' }).click();
    await expect(page).toHaveURL(/#\/history/);
    await expect(page.getByRole('heading', { name: 'Transaction History' })).toBeVisible();

    // 2. Loans & EMIs
    await aside.getByRole('button', { name: /loans & emis|loans/i }).click();
    await expect(page).toHaveURL(/#\/emis/);
    await expect(page.getByRole('heading', { name: 'Loans & EMIs' })).toBeVisible();

    // 3. Net Worth
    await aside.getByRole('button', { name: 'Net Worth' }).click();
    await expect(page).toHaveURL(/#\/networth/);
    await expect(page.getByRole('heading', { name: 'Net Worth', exact: true })).toBeVisible();

    // 4. Analytics
    await aside.getByRole('button', { name: 'Analytics' }).click();
    await expect(page).toHaveURL(/#\/analytics/);
    await expect(page.getByRole('heading', { name: 'Financial Analytics' })).toBeVisible();

    // 5. Budgets
    await aside.getByRole('button', { name: 'Budgets' }).click();
    await expect(page).toHaveURL(/#\/budgets/);
    await expect(page.getByRole('heading', { name: 'Category Budgets' })).toBeVisible();

    // 6. Ledger
    await aside.getByRole('button', { name: 'Ledger' }).click();
    await expect(page).toHaveURL(/#\/ledger/);
    await expect(page.getByRole('heading', { name: 'Borrow & Lend' })).toBeVisible();

    // 7. Profile
    await aside.getByRole('button', { name: 'Profile' }).click();
    await expect(page).toHaveURL(/#\/profile/);
    await expect(page.locator('text=Settings').first()).toBeVisible();

    // 8. Add Transaction
    await aside.getByRole('button', { name: 'Add Transaction' }).click();
    await expect(page).toHaveURL(/#\/add/);
    await expect(page.getByRole('heading', { name: 'New Transaction' })).toBeVisible();
  });
});
