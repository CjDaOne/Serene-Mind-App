import { test, expect } from '@playwright/test';

test.describe('Tasks Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/signin');
  });

  test.skip('should create a new task', async ({ page }) => {
    await page.goto('/tasks');
    
    const addButton = page.getByRole('button', { name: /add task|new task|create/i });
    await addButton.click();
    
    const titleInput = page.getByLabel(/title|name/i);
    await titleInput.fill('Test Task from E2E');
    
    const descriptionInput = page.getByLabel(/description/i);
    await descriptionInput.fill('This is a test task created by Playwright');
    
    const saveButton = page.getByRole('button', { name: /save|create/i });
    await saveButton.click();
    
    await expect(page.getByText('Test Task from E2E')).toBeVisible();
  });

  test.skip('should mark task as complete', async ({ page }) => {
    await page.goto('/tasks');
    
    const firstTask = page.locator('[data-testid="task-item"]').first();
    const checkbox = firstTask.locator('input[type="checkbox"]');
    
    await checkbox.check();
    await expect(checkbox).toBeChecked();
  });

  test.skip('should delete a task', async ({ page }) => {
    await page.goto('/tasks');
    
    const taskToDelete = page.getByText('Test Task from E2E').first();
    await taskToDelete.hover();
    
    const deleteButton = page.getByRole('button', { name: /delete|remove/i }).first();
    await deleteButton.click();
    
    const confirmButton = page.getByRole('button', { name: /confirm|yes|delete/i });
    await confirmButton.click();
    
    await expect(taskToDelete).not.toBeVisible();
  });

  test.skip('should filter tasks by status', async ({ page }) => {
    await page.goto('/tasks');
    
    const filterButton = page.getByRole('button', { name: /all|active|completed/i });
    await filterButton.click();
    
    await expect(page).toHaveURL(/filter|status/);
  });
});
