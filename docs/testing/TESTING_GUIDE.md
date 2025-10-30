# 🧪 Testing Guide

Comprehensive guide to testing the Serene Mind App.

---

## 📋 Testing Overview

The app uses a multi-layered testing strategy:

- **Unit Tests** - Jest + React Testing Library
- **E2E Tests** - Playwright
- **Manual Testing** - Cross-browser and device testing

---

## 🎯 Unit Testing (Jest)

### Setup

Unit tests are configured with:

- **Jest** - Test runner
- **React Testing Library** - Component testing
- **jest-dom** - DOM matchers

### Running Tests

```bash
# Run all tests
npm test

# Watch mode (auto-rerun on changes)
npm test -- --watch

# Coverage report
npm test -- --coverage

# Run specific test file
npm test -- button.test.tsx

# Update snapshots
npm test -- -u
```

### Test Location

```
tests/
└── unit/
    ├── components/
    │   ├── Button.test.tsx
    │   └── TaskCard.test.tsx
    └── lib/
        └── utils.test.ts
```

### Writing Unit Tests

#### Component Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders button text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByText('Delete');
    expect(button).toHaveClass('bg-destructive');
  });
});
```

#### Utility Function Test Example

```typescript
import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('merges class names', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toBe('text-red-500 bg-blue-500');
  });

  it('handles conditional classes', () => {
    const isActive = true;
    const result = cn('base-class', isActive && 'active');
    expect(result).toContain('active');
  });
});
```

### Test Coverage Goals

- **Components:** 80%+
- **Utilities:** 90%+
- **Hooks:** 70%+
- **Overall:** 70%+

---

## 🎭 E2E Testing (Playwright)

### Setup

E2E tests use Playwright for browser automation:

- **Chromium** - Desktop Chrome
- **Firefox** - Desktop Firefox
- **WebKit** - Desktop Safari
- **Mobile** - iOS Safari, Android Chrome

### Running E2E Tests

```bash
# Install browsers (first time only)
npx playwright install

# Run all E2E tests
npm run test:e2e

# Interactive UI mode
npm run test:e2e:ui

# Headed mode (see browser)
npm run test:e2e:headed

# Debug mode
npm run test:e2e:debug

# Run specific test
npx playwright test tests/e2e/auth.spec.ts

# Run on specific browser
npx playwright test --project=chromium
npx playwright test --project=webkit

# Generate test code (Codegen)
npx playwright codegen http://localhost:3001
```

### Test Location

```
tests/
└── e2e/
    ├── auth.spec.ts
    ├── pwa.spec.ts
    ├── tasks.spec.ts
    └── journal.spec.ts
```

### Writing E2E Tests

#### Authentication Flow Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('redirects to signin when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test('shows guest mode option', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Try Demo')).toBeVisible();
  });

  test('allows sign in with Google', async ({ page }) => {
    await page.goto('/auth/signin');
    const googleButton = page.getByRole('button', { name: /Google/i });
    await expect(googleButton).toBeVisible();
    await expect(googleButton).toBeEnabled();
  });
});
```

#### Task Management Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    // Authenticate before each test
    await page.goto('/auth/signin');
    // Add authentication steps
  });

  test('creates a new task', async ({ page }) => {
    await page.goto('/tasks');
    
    await page.getByRole('button', { name: 'Add Task' }).click();
    await page.fill('input[name="title"]', 'Test Task');
    await page.fill('textarea[name="description"]', 'Test description');
    await page.getByRole('button', { name: 'Save' }).click();
    
    await expect(page.getByText('Test Task')).toBeVisible();
  });

  test('marks task as complete', async ({ page }) => {
    await page.goto('/tasks');
    
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.check();
    
    await expect(checkbox).toBeChecked();
  });
});
```

#### PWA Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('PWA Features', () => {
  test('has valid manifest', async ({ page }) => {
    await page.goto('/');
    
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute('href', '/manifest.webmanifest');
  });

  test('registers service worker', async ({ page }) => {
    await page.goto('/');
    
    const swRegistered = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      return !!registration;
    });
    
    expect(swRegistered).toBe(true);
  });

  test('works offline', async ({ page, context }) => {
    await page.goto('/');
    
    // Go offline
    await context.setOffline(true);
    
    await page.goto('/offline');
    await expect(page.getByText('You are offline')).toBeVisible();
  });
});
```

### Playwright Configuration

See `playwright.config.ts`:

```typescript
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 🔍 Manual Testing Checklist

### Pre-Deployment

#### Functionality

- [ ] **Home page** loads correctly
- [ ] **Google OAuth** sign-in works
- [ ] **Email magic link** authentication works
- [ ] **Guest mode** accessible without login
- [ ] **Dashboard** displays user data
- [ ] **Tasks** - Create, edit, complete, delete
- [ ] **Journal** - Create, edit, view entries
- [ ] **Calendar** - View tasks by date
- [ ] **Affirmations** - Display daily affirmations
- [ ] **Rewards** - Track points and achievements
- [ ] **AI insights** generate for journal entries
- [ ] **Logout** clears session

#### PWA

- [ ] **Install prompt** appears on desktop
- [ ] **Add to home screen** works on iOS Safari
- [ ] **Add to home screen** works on Android Chrome
- [ ] **Service worker** registers successfully
- [ ] **Offline page** displays when offline
- [ ] **Cache** loads pages offline
- [ ] **Push notifications** permission prompt
- [ ] **Notifications** delivered when enabled

#### Cross-Browser

- [ ] **Chrome** (Desktop) - All features work
- [ ] **Firefox** (Desktop) - All features work
- [ ] **Safari** (Desktop) - All features work
- [ ] **Edge** (Desktop) - All features work
- [ ] **Chrome** (Mobile) - Responsive layout
- [ ] **Safari** (iOS) - PWA install works
- [ ] **Samsung Internet** - Basic functionality

#### Responsive Design

- [ ] **Desktop** (1920x1080) - Layout correct
- [ ] **Laptop** (1366x768) - No overflow
- [ ] **Tablet** (768px) - Touch-friendly
- [ ] **Mobile** (375px) - Single column layout
- [ ] **Small mobile** (320px) - No horizontal scroll

#### Performance

- [ ] **Lighthouse Score** - Performance 90+
- [ ] **Lighthouse Score** - Accessibility 95+
- [ ] **Lighthouse Score** - Best Practices 95+
- [ ] **Lighthouse Score** - PWA 100
- [ ] **First Load** - Under 3 seconds
- [ ] **Time to Interactive** - Under 5 seconds

### Post-Deployment

- [ ] **Production URL** accessible
- [ ] **HTTPS** enforced
- [ ] **OAuth callback** working
- [ ] **Database** connected
- [ ] **Environment variables** set correctly
- [ ] **Error pages** display properly
- [ ] **Monitoring** active (Vercel Analytics)
- [ ] **Logs** showing no errors

---

## 🐛 Debugging Tests

### Jest Debugging

```bash
# Run with Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Use VS Code debugger
# Add to .vscode/launch.json:
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal"
}
```

### Playwright Debugging

```bash
# Debug mode (step through tests)
npm run test:e2e:debug

# Headed mode (see browser)
npm run test:e2e:headed

# Slow motion
npx playwright test --headed --slow-mo=1000

# Pause on failure
npx playwright test --headed --pause-on-failure

# Trace viewer (after test run)
npx playwright show-trace trace.zip
```

### Common Issues

#### Jest: Module not found

```bash
# Clear Jest cache
npx jest --clearCache

# Check tsconfig.json paths
"paths": {
  "@/*": ["./src/*"]
}
```

#### Playwright: Timeout errors

```typescript
// Increase timeout for slow operations
test('slow operation', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // ...
});
```

#### Playwright: Element not found

```typescript
// Wait for element to be visible
await page.waitForSelector('button[type="submit"]', { state: 'visible' });

// Use better selectors
await page.getByRole('button', { name: 'Submit' }); // ✅ Preferred
await page.locator('button').first(); // ❌ Fragile
```

---

## 📊 Test Coverage Reports

### Generate Coverage

```bash
# Jest unit test coverage
npm test -- --coverage

# Coverage report location
open coverage/lcov-report/index.html
```

### Coverage Thresholds

Configured in `jest.config.js`:

```javascript
module.exports = {
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

---

## 🚀 CI/CD Testing

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm test -- --coverage

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 📚 Best Practices

### Unit Tests

1. **Test behavior, not implementation**
2. **Use data-testid sparingly** (prefer accessible queries)
3. **Mock external dependencies** (APIs, databases)
4. **Keep tests focused** (one assertion per test when possible)
5. **Use descriptive test names**

### E2E Tests

1. **Test critical user flows** (signup, task creation)
2. **Avoid testing implementation details**
3. **Use page objects** for reusable selectors
4. **Run in CI/CD** to catch regressions
5. **Keep tests independent** (no shared state)

### General

1. **Write tests as you code** (not after)
2. **Maintain test coverage** (>70%)
3. **Run tests before commits**
4. **Fix failing tests immediately**
5. **Update tests when features change**

---

## 🔗 Related Documentation

- **[../architecture/OVERVIEW.md](../architecture/OVERVIEW.md)** - System architecture
- **[../../AGENTS.md](../../AGENTS.md)** - Development commands
- **[../../GETTING_STARTED.md](../../GETTING_STARTED.md)** - Setup guide

---

**Need help?** See [docs/INDEX.md](../INDEX.md) for more resources.
