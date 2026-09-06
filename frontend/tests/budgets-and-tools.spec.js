import { test, expect } from '@playwright/test';
import { setupApiMocks } from './helpers/mockApi';

test.describe('Financial Tools: Budgets, EMIs, Net Worth & Ledger', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page, { loggedIn: true });
  });

  test('should render Budgets page with existing categories and limits', async ({ page }) => {
    await page.goto('/#/budgets');

    // Heading
    await expect(page.getByRole('heading', { name: 'Category Budgets' })).toBeVisible();

    // Mock budgets items
    await expect(page.locator('text=Food').first()).toBeVisible();
    await expect(page.locator('text=Bills').first()).toBeVisible();
  });

  test('should render Loans & EMI tracker with loan metrics', async ({ page }) => {
    await page.goto('/#/emis');

    // Heading
    await expect(page.getByRole('heading', { name: 'Loans & EMIs' })).toBeVisible();

    // Home Loan mock entry
    await expect(page.locator('text=Home Loan').first()).toBeVisible();
  });

  test('should render Net Worth summary with assets and liabilities', async ({ page }) => {
    await page.goto('/#/networth');

    // Heading
    await expect(page.getByRole('heading', { name: 'Net Worth', exact: true })).toBeVisible();

    // Verify Asset and Liquid balance from mock
    await expect(page.locator('text=Mutual Funds').first()).toBeVisible();
    await expect(page.locator('text=Total Assets').first()).toBeVisible();
  });

  test('should render Ledger with contact records and balances', async ({ page }) => {
    await page.goto('/#/ledger');

    // Heading
    await expect(page.getByRole('heading', { name: 'Borrow & Lend' })).toBeVisible();

    // Contact name from mock
    await expect(page.locator('text=Rahul Sharma').first()).toBeVisible();
  });
});
