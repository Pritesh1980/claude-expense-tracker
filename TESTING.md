# Testing Documentation

This document describes the testing setup and coverage for the Expense Tracker application.

## Test Setup

The project uses **Jest** as the testing framework with **@testing-library/react** for component testing.

### Configuration Files

- `jest.config.js` - Main Jest configuration with Next.js integration
- `jest.setup.js` - Setup file that imports testing utilities
- `__tests__/` - Directory containing all test files

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Test Coverage

### Utility Functions (100% Coverage)

All core utility functions have comprehensive test coverage:

#### 1. Currency Utilities (`utils/currency.ts`)
**Tests:** `__tests__/utils/currency.test.ts`

- **`formatCurrency(amount: number)`**
  - Formats numbers as GBP currency (£)
  - Handles positive, negative, and zero values
  - Correctly formats large numbers with commas
  - Rounds to 2 decimal places

- **`parseCurrency(value: string)`**
  - Parses currency strings to numbers
  - Removes non-numeric characters (except decimal point)
  - Returns 0 for invalid input
  - Handles various currency formats (£, $, etc.)

**Test Count:** 13 tests

#### 2. Calculation Utilities (`utils/calculations.ts`)
**Tests:** `__tests__/utils/calculations.test.ts`

- **`calculateSpendingSummary(expenses: Expense[])`**
  - Calculates total spending across all expenses
  - Calculates monthly spending (current month only)
  - Creates category breakdown by expense type
  - Identifies top spending category
  - Handles edge cases:
    - Empty expenses array
    - Single expense
    - Multiple categories with same amount
    - Decimal amounts
    - Expenses from different time periods

**Test Count:** 11 tests

#### 3. Validation Utilities (`utils/validation.ts`)
**Tests:** `__tests__/utils/validation.test.ts`

- **`validateExpenseForm(formData: ExpenseFormData)`**
  - Date validation:
    - Requires date field
    - Rejects future dates
    - Accepts today and past dates
  - Amount validation:
    - Requires amount field
    - Rejects zero and negative values
    - Rejects non-numeric input
    - Rejects unreasonably large amounts (> £1,000,000)
    - Accepts valid decimal amounts
  - Category validation:
    - Requires category selection
    - Accepts all valid categories
  - Description validation:
    - Requires non-empty description
    - Rejects whitespace-only input
    - Enforces 200 character limit
    - Accepts valid descriptions

- **`hasErrors(errors: ValidationErrors)`**
  - Returns true when validation errors exist
  - Returns false when no errors

**Test Count:** 19 tests

## Test Statistics

```
Total Test Suites: 3
Total Tests: 43
All Tests: PASSING ✓

Utility Function Coverage:
- calculations.ts: 100%
- currency.ts: 100%
- validation.ts: 100%
```

## What's Tested

### ✅ Fully Tested
- Currency formatting and parsing
- Spending calculations and summaries
- Form validation logic
- Edge cases and error handling
- Input sanitization

### ⚠️ Not Yet Tested
- React components (Dashboard, ExpenseForm, ExpenseList, ExportHub)
- UI components (Button, Card, Input, Modal, Select)
- Export functionality (CSV generation)
- Integration tests
- End-to-end tests

## Testing Best Practices

The tests follow these best practices:

1. **Descriptive Test Names** - Each test clearly describes what it's testing
2. **Arrange-Act-Assert Pattern** - Tests are structured logically
3. **Edge Case Coverage** - Tests cover edge cases and error conditions
4. **Isolated Tests** - Each test is independent and can run in any order
5. **Mock Data** - Uses realistic mock data for testing
6. **Type Safety** - Full TypeScript support in tests

## Future Testing Roadmap

### Component Tests
- Dashboard rendering and interactions
- ExpenseForm validation UI
- ExpenseList filtering and sorting
- ExportHub modal functionality

### Integration Tests
- Complete expense creation flow
- Export functionality end-to-end
- Dashboard data updates

### E2E Tests
- User journey testing
- Cross-browser compatibility
- Mobile responsiveness

## Running Specific Tests

```bash
# Run tests for a specific file
npm test currency.test.ts

# Run tests matching a pattern
npm test -- --testPathPattern=validation

# Run tests in verbose mode
npm test -- --verbose
```

## CI/CD Integration

Tests can be easily integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm test

- name: Generate coverage
  run: npm run test:coverage
```

## Troubleshooting

### Common Issues

1. **Tests fail due to date/time** - Some tests use current date/time and may need adjustment
2. **Module not found** - Ensure all dependencies are installed with `npm install`
3. **TypeScript errors** - Check that `@types/*` packages are installed

### Debug Mode

Run tests with Node debugger:
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Contributing

When adding new features:
1. Write tests first (TDD approach recommended)
2. Ensure all tests pass before committing
3. Aim for >80% code coverage on new code
4. Add integration tests for critical flows

---

**Last Updated:** 2025-11-07
**Test Framework:** Jest 30.2.0
**Coverage:** 100% on utility functions
