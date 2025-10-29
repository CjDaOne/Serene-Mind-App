import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should load landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Serene Mind/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to sign in page', async ({ page }) => {
    await page.goto('/');
    const signInButton = page.getByRole('link', { name: /sign in|login|get started/i });
    await signInButton.click();
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test('should redirect to sign in when accessing protected route', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test('should show email and Google sign in options', async ({ page }) => {
    await page.goto('/auth/signin');
    const googleButton = page.getByRole('button', { name: /google/i });
    const emailInput = page.getByPlaceholder(/email/i);
    
    await expect(googleButton).toBeVisible();
    await expect(emailInput).toBeVisible();
  });

  test('should not allow access to tasks without authentication', async ({ page }) => {
    await page.goto('/tasks');
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test('should not allow access to journal without authentication', async ({ page }) => {
    await page.goto('/journal');
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test('should not allow access to rewards without authentication', async ({ page }) => {
    await page.goto('/rewards');
    await expect(page).toHaveURL(/\/auth\/signin/);
  });
});
