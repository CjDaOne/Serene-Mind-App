import { test, expect } from '@playwright/test';

test.describe('Journal Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/signin');
  });

  test.skip('should create a new journal entry', async ({ page }) => {
    await page.goto('/journal');
    
    const createButton = page.getByRole('button', { name: /new entry|create|add/i });
    await createButton.click();
    
    const titleInput = page.getByLabel(/title/i);
    await titleInput.fill('E2E Test Journal Entry');
    
    const contentInput = page.getByLabel(/content|entry|what/i);
    await contentInput.fill('This is a test journal entry created by Playwright automation.');
    
    const moodSelect = page.getByLabel(/mood|feeling/i);
    await moodSelect.click();
    await page.getByRole('option', { name: /happy|good/i }).click();
    
    const saveButton = page.getByRole('button', { name: /save|create/i });
    await saveButton.click();
    
    await expect(page.getByText('E2E Test Journal Entry')).toBeVisible();
  });

  test.skip('should view past journal entries', async ({ page }) => {
    await page.goto('/journal');
    
    const entries = page.locator('[data-testid="journal-entry"]');
    await expect(entries.first()).toBeVisible();
    
    await entries.first().click();
    
    await expect(page.getByRole('heading')).toBeVisible();
  });

  test.skip('should display journal entry with AI insights', async ({ page }) => {
    await page.goto('/journal');
    
    const entry = page.locator('[data-testid="journal-entry"]').first();
    await entry.click();
    
    const insightSection = page.locator('[data-testid="ai-insights"]');
    await expect(insightSection).toBeVisible({ timeout: 10000 });
  });

  test.skip('should edit an existing journal entry', async ({ page }) => {
    await page.goto('/journal');
    
    const entry = page.getByText('E2E Test Journal Entry').first();
    await entry.hover();
    
    const editButton = page.getByRole('button', { name: /edit/i });
    await editButton.click();
    
    const contentInput = page.getByLabel(/content|entry/i);
    await contentInput.fill('Updated content from Playwright');
    
    const saveButton = page.getByRole('button', { name: /save|update/i });
    await saveButton.click();
    
    await expect(page.getByText('Updated content from Playwright')).toBeVisible();
  });
});
