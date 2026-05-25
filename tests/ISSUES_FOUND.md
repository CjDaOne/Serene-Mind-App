# Code Review Issues - Action Items

## ISSUE #1: Sensitive Data in Error Logs [HIGH PRIORITY]

**Files Affected:**
- `src/ai/flows/journal-insights.ts` (line 54)

**Current Code:**
```typescript
catch (error) {
  console.error('Error generating journal insights:', error);
  return {
    insights: "I'm having trouble analyzing your journal right now. Please try again later.",
  };
}
```

**Problem:**
- Full error object logged to console/logs
- May contain API keys, user data, stack traces
- Exposed in browser console, server logs, monitoring systems
- Security risk in production

**Recommended Fix:**
```typescript
catch (error) {
  const errorCode = error instanceof Error ? error.message : 'UNKNOWN_ERROR';
  logger.error('journal_insights_failed', {
    code: errorCode,
    // Do NOT log full error object
  });
  return {
    insights: "I'm having trouble analyzing your journal right now. Please try again later.",
  };
}
```

**Or use structured logging:**
```typescript
import { logger } from '@/lib/logger'; // Create if doesn't exist

catch (error) {
  logger.error('journal_insights_failed', {
    type: error instanceof Error ? 'Error' : 'Unknown',
    // Sanitized message only
  });
  // ... return fallback
}
```

**Acceptance Criteria:**
- ✅ No full error objects logged
- ✅ No API keys in logs
- ✅ No sensitive user data in logs
- ✅ Fallback message still appears to user

---

## ISSUE #2: Missing Error Handling in suggest-subtasks [HIGH PRIORITY]

**Files Affected:**
- `src/ai/flows/suggest-subtasks.ts` (lines 48-51)

**Current Code:**
```typescript
const suggestSubtasksFlow = ai.defineFlow(
  {
    name: 'suggestSubtasksFlow',
    inputSchema: SuggestSubtasksInputSchema,
    outputSchema: SuggestSubtasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;  // ❌ No error handling
  }
);
```

**Problem:**
- No try-catch block
- If Genkit/Gemini API fails, unhandled rejection
- UI component calling this will receive error
- Could crash the application

**Recommended Fix:**
```typescript
const suggestSubtasksFlow = ai.defineFlow(
  {
    name: 'suggestSubtasksFlow',
    inputSchema: SuggestSubtasksInputSchema,
    outputSchema: SuggestSubtasksOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error) {
      logger.error('suggest_subtasks_failed', {
        task: input.task.substring(0, 100), // Log task preview, not full content
      });
      return {
        subtasks: [
          'Review and understand the task',
          'Plan your approach',
          'Execute the task',
          'Review results',
        ],
      };
    }
  }
);
```

**Acceptance Criteria:**
- ✅ Try-catch wraps entire flow
- ✅ Graceful fallback provided
- ✅ Error logged (without sensitive data)
- ✅ UI doesn't crash on failure

---

## ISSUE #3: Unvalidated AI Response Output [MEDIUM PRIORITY]

**Files Affected:**
- `src/ai/flows/journal-insights.ts` (line 51)
- `src/ai/flows/suggest-subtasks.ts` (line 50)

**Current Code:**
```typescript
// Both files have this pattern:
const {output} = await prompt(input);
return output!;  // ❌ No validation
```

**Problem:**
- Response could be malformed, null, or wrong schema
- Using `!` (non-null assertion) without checking
- If API returns truncated/invalid data, could return bad data to UI
- TypeScript ignores potential null/undefined

**Recommended Fix:**
```typescript
// In journal-insights.ts
try {
  const {output} = await prompt(input);
  const validated = JournalInsightsOutputSchema.parse(output);
  return validated;
} catch (error) {
  // Handle validation error
}

// In suggest-subtasks.ts
try {
  const {output} = await prompt(input);
  const validated = SuggestSubtasksOutputSchema.parse(output);
  return validated;
} catch (error) {
  // Handle validation error
}
```

**Acceptance Criteria:**
- ✅ Output validated against Zod schema before returning
- ✅ Parse errors caught and handled
- ✅ Fallback returned on validation failure
- ✅ TypeScript no longer complains about null

---

## ISSUE #4: Missing CORS Configuration [MEDIUM PRIORITY]

**Files Affected:**
- `next.config.ts`
- No explicit CORS headers configured

**Current Status:**
- No `Access-Control-Allow-Origin` headers set
- Browser will use default CORS policies
- Could be restrictive for legitimate cross-origin requests
- No protection against unauthorized origins

**Recommended Fix in next.config.ts:**
```typescript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Access-Control-Allow-Origin',
          value: process.env.NEXTAUTH_URL || 'https://your-domain.com',
        },
        {
          key: 'Access-Control-Allow-Methods',
          value: 'GET, POST, PUT, DELETE, OPTIONS',
        },
        {
          key: 'Access-Control-Allow-Headers',
          value: 'Content-Type, Authorization',
        },
        {
          key: 'Access-Control-Allow-Credentials',
          value: 'true',
        },
      ],
    },
    // ... rest of config
  ];
}
```

**Or using NextAuth CORS provider:**
```typescript
// Add to API routes
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXTAUTH_URL!,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
```

**Acceptance Criteria:**
- ✅ CORS headers configured for API routes
- ✅ Only allow authenticated/intended origins
- ✅ OPTIONS requests handled
- ✅ No overly permissive wildcards

---

## ISSUE #5: ESLint Configuration Deprecated [MEDIUM PRIORITY]

**Files Affected:**
- `package.json` (lint script)
- `eslint.config.mjs`

**Current Status:**
```json
"lint": "next lint"
```

**Error Output:**
```
`next lint` is deprecated and will be removed in Next.js 16.
For new projects, use create-next-app to choose your preferred linter.
For existing projects, migrate to ESLint CLI:
npx @next/codemod@canary next-lint-to-eslint-cli .
```

**Recommended Fix:**

1. Run Next.js codemod to migrate:
```bash
npx @next/codemod@canary next-lint-to-eslint-cli .
```

2. Update package.json:
```json
"lint": "eslint . --fix",
"lint:check": "eslint ."
```

3. Install ESLint if not present:
```bash
npm install --save-dev eslint @eslint/js
```

4. Test the migration:
```bash
npm run lint
```

**Acceptance Criteria:**
- ✅ ESLint CLI working without errors
- ✅ No deprecation warnings
- ✅ Lint script passes
- ✅ package.json updated

---

## Summary of Changes Needed

| Issue | File | Line | Type | Fix |
|-------|------|------|------|-----|
| #1 | journal-insights.ts | 54 | Security | Add structured logging |
| #2 | suggest-subtasks.ts | 48-51 | Reliability | Add error handling |
| #3 | Both flows | Multiple | Quality | Add response validation |
| #4 | next.config.ts | N/A | Config | Add CORS headers |
| #5 | package.json | lint | Deprecation | Migrate to ESLint CLI |

**Estimated Total Fix Time:** ~2 hours

---

## Testing After Fixes

```bash
# Verify all fixes
npm run typecheck    # Should pass
npm run lint         # Should pass
npm test             # Should pass
npm run test:e2e     # Should pass with fixes
```

---

## Deployment Checklist

- [ ] All 5 issues fixed
- [ ] Tests passing locally
- [ ] Code pushed to PR branch
- [ ] PR reviewed and approved
- [ ] Merged to main
- [ ] Deployed to Vercel staging
- [ ] Smoke tested in staging
- [ ] Deployed to production
