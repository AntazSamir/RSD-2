# Testing Guide

## Overview

This document provides guidance on testing the Restaurant Dashboard application. The application uses Jest and React Testing Library for unit and integration testing.

## Test Setup

### Dependencies

The following testing dependencies have been installed:

- `@testing-library/react`: React testing utilities
- `@testing-library/jest-dom`: Custom Jest matchers for DOM assertions
- `jest-environment-jsdom`: Jest environment for DOM testing
- `@types/jest`: TypeScript definitions for Jest

### Configuration

To set up testing, create a `jest.config.js` file in the root directory:

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
};
```

Create a `jest.setup.ts` file in the root directory:

```typescript
import '@testing-library/jest-dom';
```

## Running Tests

### Commands

Add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Running Tests

1. Run all tests: `npm run test`
2. Run tests in watch mode: `npm run test:watch`
3. Run tests with coverage: `npm run test:coverage`

## Writing Tests

### Test Structure

Tests should follow the Arrange-Act-Assert pattern:

```typescript
describe('ComponentName', () => {
  it('should do something', () => {
    // Arrange
    const props = { /* ... */ };
    
    // Act
    const { getByText } = render(<ComponentName {...props} />);
    
    // Assert
    expect(getByText('Expected text')).toBeInTheDocument();
  });
});
```

### Testing Components

1. **Snapshot Tests**: For UI components that don't have complex logic
2. **Interaction Tests**: For components with user interactions
3. **State Tests**: For components with complex state management
4. **Error Handling Tests**: For components with error boundaries

### Testing Hooks

Custom hooks can be tested using the `renderHook` function from React Testing Library:

```typescript
import { renderHook } from '@testing-library/react';
import { useMyHook } from '../hooks/useMyHook';

describe('useMyHook', () => {
  it('should return initial value', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.value).toBe(initialValue);
  });
});
```

## Best Practices

### Test Organization

1. **Colocate Tests**: Place test files next to the components they test
2. **Descriptive Names**: Use clear, descriptive test names
3. **Focused Tests**: Each test should focus on a single behavior
4. **Avoid Implementation Details**: Test behavior, not implementation

### Test Coverage

1. **Critical Paths**: Ensure critical user flows are tested
2. **Edge Cases**: Test boundary conditions and error cases
3. **Accessibility**: Test accessibility features
4. **Performance**: Test performance-critical components

### Mocking

1. **External Dependencies**: Mock external APIs and services
2. **Complex Components**: Mock child components when testing parent components
3. **Data**: Use mock data for consistent test results

## Continuous Integration

Set up CI to run tests on every pull request:

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test
```

## Debugging Tests

1. **Console Logging**: Use `console.log` for debugging test failures
2. **Debug Mode**: Use `screen.debug()` to see the current DOM state
3. **Test Isolation**: Run individual tests to isolate issues
4. **Async Testing**: Use `waitFor` for async operations

## Common Patterns

### Testing Async Operations

```typescript
import { render, screen, waitFor } from '@testing-library/react';

it('should display data after fetch', async () => {
  render(<MyComponent />);
  
  // Wait for the data to be displayed
  await waitFor(() => {
    expect(screen.getByText('Expected data')).toBeInTheDocument();
  });
});
```

### Testing User Interactions

```typescript
import { render, screen, fireEvent } from '@testing-library/react';

it('should update value when button is clicked', () => {
  render(<MyComponent />);
  
  const button = screen.getByRole('button', { name: 'Click me' });
  fireEvent.click(button);
  
  expect(screen.getByText('Updated value')).toBeInTheDocument();
});
```

### Testing Error States

```typescript
import { render, screen } from '@testing-library/react';

it('should display error message', () => {
  // Mock console.error to avoid noise in test output
  jest.spyOn(console, 'error').mockImplementation(() => {});
  
  render(<ComponentWithError />);
  
  expect(screen.getByText('Error message')).toBeInTheDocument();
  
  // Restore console.error
  jest.restoreAllMocks();
});
```

## Resources

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Next.js Testing Documentation](https://nextjs.org/docs/testing)