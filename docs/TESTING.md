# Testing Guide

> **LIKEFOOD** — How to run the test suite.

## Test Stack

- **Framework:** [Vitest](https://vitest.dev/) v4
- **Testing Library:** `@testing-library/react` for component tests
- **Environment:** `jsdom` (browser-like DOM simulation)
- **Coverage:** Built-in Vitest coverage (v8 provider)

## Running Tests

```bash
# Run all tests (watch mode — for development)
npm test

# Run all tests once (for CI / pre-commit)
npm run test:run
```

## Test Structure

```
tests/
├── setup.ts                        # Global test setup (mocks, matchers)
├── ai/
│   ├── chatbot.test.ts             # AI chatbot response tests
│   └── content-generator.test.ts  # AI content generator tests
└── lib/
    └── validation.test.ts          # Zod schema validation tests

src/__tests__/
├── setup.ts                        # Component test setup
└── lib/                            # Library unit tests
```

## Current Test Coverage

| Test File | Tests | Description |
|-----------|-------|-------------|
| `tests/ai/chatbot.test.ts` | ✅ | Gemini chatbot message processing |
| `tests/ai/content-generator.test.ts` | ✅ | AI content generation |
| `tests/lib/validation.test.ts` | ✅ | Zod input validation schemas |
| **Total** | **74 tests** | All passing |

## Running Specific Tests

```bash
# Run a specific test file
npx vitest run tests/ai/chatbot.test.ts

# Run tests matching a pattern
npx vitest run --reporter=verbose -t "chatbot"

# Run with coverage report
npx vitest run --coverage
```

## Writing New Tests

New tests go in `tests/` (for integration/business logic) or `src/__tests__/` (for component tests).

```typescript
// Example: tests/lib/example.test.ts
/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */
import { describe, it, expect } from 'vitest';

describe('MyFeature', () => {
  it('should do something correctly', () => {
    expect(1 + 1).toBe(2);
  });
});
```

## Vitest Configuration

See `vitest.config.ts` for the full configuration.

Key settings:
- `environment: 'jsdom'` — browser-like DOM
- `setupFiles: ['./tests/setup.ts']` — global mocks
- `exclude: ['node_modules', '.next']` — skip build artifacts

## CI Integration

Tests run automatically in GitHub Actions on every push and pull request.  
See [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

The CI pipeline runs:
1. `npm run lint` — ESLint
2. `npm run type-check` — TypeScript
3. `npm run test:run` — Vitest (fail-fast mode)
4. `npm run build` — Next.js production build
