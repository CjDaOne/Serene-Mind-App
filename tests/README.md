# Testing Guide

This document outlines the testing strategy and setup for the Serene Mind App.

## Table of Contents

- [Overview](#overview)
- [Unit Tests (Jest)](#unit-tests-jest)
- [E2E Tests (Playwright)](#e2e-tests-playwright)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [CI/CD Integration](#cicd-integration)

## Overview

The Serene Mind App uses a dual testing approach:

1. **Unit Tests**: Jest + React Testing Library for component and utility testing
2. **E2E Tests**: Playwright for end-to-end user flow testing

## Unit Tests (Jest)

### Setup

Jest is configured with TypeScript support and React Testing Library integration.

**Configuration:** `jest.config.js`

**Setup File:** `jest.setup.ts`

### Running Unit Tests

```bash
npm test                 # Run all unit tests
npm test -- --watch      # Run in watch mode
npm test -- --coverage   # Run with coverage report
```

### Test Structure

Unit tests should be placed next to the components they test with a `.test.tsx` or `.test.ts` extension.

Example:
```
src/components/
  ├── TaskCard.tsx
  └── TaskCard.test.tsx
```

## E2E Tests (Playwright)

### Setup

Playwright is configured to test across multiple browsers (Chromium, Firefox, WebKit) and devices.

**Configuration:** `playwright.config.ts`

**Test Directory:** `tests/e2e/`

### Installing Playwright Browsers

Before running E2E tests for the first time, install the required browsers:

```bash
npx playwright install
```

### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run in debug mode
npm run test:e2e:debug

# Run specific test file
npx playwright test tests/e2e/auth.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium
```

### Test Files

- **auth.spec.ts**: Authentication flows (sign in, sign out, protected routes)
- **tasks.spec.ts**: Task management (create, complete, delete)
- **journal.spec.ts**: Journal functionality (create, view, edit entries)
- **pwa.spec.ts**: PWA features (manifest, service worker, offline mode)

### Authentication in E2E Tests

Many tests require authentication. Currently, tests that need authentication are marked with `test.skip()` and require:

1. **Test User Setup**: Create a test user in your development database
2. **Auth State Storage**: Use Playwright's `storageState` to persist authentication
3. **Environment Variables**: Configure test credentials

#### Setting Up Test Authentication

```typescript
// tests/e2e/auth.setup.ts (create this file)
import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/auth/signin');
  await page.getByPlaceholder(/email/i).fill('test@example.com');
  await page.getByRole('button', { name: /sign in/i }).click();
  
  // Wait for authentication to complete
  await page.waitForURL('/dashboard');
  
  // Save authentication state
  await page.context().storageState({ path: authFile });
});
```

Then update `playwright.config.ts`:

```typescript
export default defineConfig({
  // ... existing config
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    // ... other projects
  ],
});
```

## Writing Tests

### Best Practices

1. **Use Semantic Selectors**: Prefer `getByRole`, `getByLabel`, `getByText` over `locator` with CSS selectors
2. **Test User Behavior**: Focus on what users do, not implementation details
3. **Keep Tests Independent**: Each test should be able to run in isolation
4. **Use Test IDs Sparingly**: Only when semantic selectors aren't available
5. **Wait for Elements**: Use `expect().toBeVisible()` instead of arbitrary timeouts

### Example Unit Test

```typescript
import { render, screen } from '@testing-library/react';
import { TaskCard } from './TaskCard';

describe('TaskCard', () => {
  it('renders task title', () => {
    render(<TaskCard title="Test Task" completed={false} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });
});
```

### Example E2E Test

```typescript
import { test, expect } from '@playwright/test';

test('user can create a task', async ({ page }) => {
  await page.goto('/tasks');
  
  await page.getByRole('button', { name: /add task/i }).click();
  await page.getByLabel(/title/i).fill('New Task');
  await page.getByRole('button', { name: /save/i }).click();
  
  await expect(page.getByText('New Task')).toBeVisible();
});
```

## Test Coverage Areas

### Current Coverage

- ✅ **Authentication**: Sign in page, protected routes, redirects
- ✅ **PWA**: Manifest loading, service worker registration, meta tags
- ⏳ **Tasks**: CRUD operations (needs auth setup)
- ⏳ **Journal**: Entry management (needs auth setup)
- ⏳ **Dashboard**: Overview page (needs auth setup)

### Planned Coverage

- Calendar functionality
- Affirmations system
- Rewards system
- Offline mode behavior
- Push notifications
- Mobile responsiveness

## CI/CD Integration

### GitHub Actions

Add this workflow to `.github/workflows/playwright.yml`:

```yaml
name: Playwright Tests
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: npm run test:e2e
        env:
          MONGODB_URI: ${{ secrets.MONGODB_URI }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### Vercel Integration

Playwright tests can run in Vercel preview deployments using the `@playwright/test` package with `baseURL` set to the preview URL.

## Debugging Tests

### Playwright Debug Tools

1. **UI Mode**: Interactive test runner
   ```bash
   npm run test:e2e:ui
   ```

2. **Trace Viewer**: View test execution traces
   ```bash
   npx playwright show-trace trace.zip
   ```

3. **Inspector**: Step through tests
   ```bash
   npm run test:e2e:debug
   ```

### Common Issues

**Issue**: Tests fail with "Timeout waiting for element"
- **Solution**: Use `await expect(element).toBeVisible()` instead of fixed timeouts

**Issue**: Service worker not registering
- **Solution**: Ensure app is running on localhost or HTTPS

**Issue**: Authentication redirects in tests
- **Solution**: Set up auth state storage or mock authentication

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Next.js Testing](https://nextjs.org/docs/testing)

## Contributing

When adding new features:

1. Write unit tests for new components and utilities
2. Add E2E tests for new user-facing features
3. Ensure all tests pass before submitting PR
4. Update this README with new test patterns or setup instructions

---

**Last Updated**: 2025-10-29
**Maintained By**: Team Gamma - Agent 8 (E2E-Tester)
