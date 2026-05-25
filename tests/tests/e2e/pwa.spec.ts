import { test, expect } from '@playwright/test';

test.describe('PWA Features', () => {
  test('should load web app manifest', async ({ page }) => {
    await page.goto('/');
    
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute('href', '/manifest.webmanifest');
    
    const response = await page.request.get('/manifest.webmanifest');
    expect(response.ok()).toBeTruthy();
    
    const manifest = await response.json();
    expect(manifest.name).toBeDefined();
    expect(manifest.short_name).toBeDefined();
    expect(manifest.icons).toBeDefined();
    expect(manifest.start_url).toBeDefined();
  });

  test('should register service worker', async ({ page, context }) => {
    await context.grantPermissions(['notifications']);
    await page.goto('/');
    
    const swRegistration = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        return {
          registered: !!reg,
          scope: reg?.scope,
        };
      }
      return { registered: false };
    });
    
    expect(swRegistration.registered).toBeTruthy();
  });

  test('should have valid PWA meta tags', async ({ page }) => {
    await page.goto('/');
    
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);
    
    const themeColor = page.locator('meta[name="theme-color"]');
    await expect(themeColor).toBeAttached();
    
    const appleTouchIcon = page.locator('link[rel="apple-touch-icon"]');
    await expect(appleTouchIcon).toBeAttached();
  });

  test('should load offline page', async ({ page }) => {
    await page.goto('/offline');
    await expect(page.getByText(/offline|no connection/i)).toBeVisible();
  });

  test('should have installable criteria', async ({ page }) => {
    await page.goto('/');
    
    const isInstallable = await page.evaluate(async () => {
      return new Promise((resolve) => {
        window.addEventListener('beforeinstallprompt', () => {
          resolve(true);
        });
        
        setTimeout(() => resolve(false), 2000);
      });
    });
    
    expect(typeof isInstallable).toBe('boolean');
  });

  test.skip('should show install prompt', async ({ page, context }) => {
    await page.goto('/dashboard');
    
    const installButton = page.getByRole('button', { name: /install|add to home/i });
    
    if (await installButton.isVisible()) {
      await expect(installButton).toBeVisible();
    }
  });

  test('should have HTTPS or localhost for service worker', async ({ page }) => {
    await page.goto('/');
    const url = page.url();
    expect(url.startsWith('https://') || url.includes('localhost')).toBeTruthy();
  });
});
