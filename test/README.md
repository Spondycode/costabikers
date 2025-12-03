# Tests

This directory contains unit tests for the Costa Brava Bikers application.

## Running Tests

```bash
# Run tests once
npm run test:run

# Run tests in watch mode (re-runs on file changes)
npm test

# Run tests with UI
npm run test:ui
```

## Test Structure

Tests are located alongside their source files with a `.test.ts` or `.test.tsx` extension.

### Current Test Coverage

- **services/storage.test.ts**: Unit tests for the `checkVersion` function
  - Tests version check behavior in development mode
  - Tests version mismatch handling in production mode
  - Tests version match handling in production mode

## Testing Framework

- **Vitest**: Fast unit test framework for Vite projects
- **@testing-library/react**: React component testing utilities
- **jsdom**: Browser environment simulation for tests
- **@testing-library/jest-dom**: Custom matchers for DOM assertions

## Writing Tests

When writing new tests:
1. Place test files alongside the source files they test
2. Name test files with `.test.ts` or `.test.tsx` extension
3. Use descriptive test names that explain the expected behavior
4. Follow the Arrange-Act-Assert pattern
5. Mock external dependencies and side effects
