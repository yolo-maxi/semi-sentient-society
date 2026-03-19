# E2E Tests

This package uses Playwright for browser-based end-to-end coverage.

## Prerequisites

- Install dependencies in `packages/web`
- Start the Next.js app locally on `http://localhost:3000`
- Install Playwright browsers if needed:

```bash
pnpm exec playwright install
```

## Run Tests

From `packages/web`:

```bash
pnpm test:e2e
```

To open the Playwright UI runner:

```bash
pnpm test:e2e:ui
```

## Current Coverage

The `verification-flow.spec.ts` test verifies:

- landing page hero content
- landing page activity feed content
- landing page testimonials rendering
- `/verify` navigation
- `/lobsters` navigation
- `/lobsters/[address]/health` navigation
