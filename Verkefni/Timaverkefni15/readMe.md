# Lesson 15: Testing with Vitest

This lesson demonstrates how to set up and run unit tests for database models using Vitest testing framework.

## What is Being Tested

### Category Model Tests (`src/models/tests/categoryModel.test.ts`)

The tests focus on the `createCategory` function and validate:

1. **Successful Category Creation**

   - Tests that a valid category can be created successfully
   - Verifies the function returns a defined result
   - Uses a sample category with name "Avatar"

2. **Validation Constraints**

   - Tests database constraint validation (empty string rejection)
   - Ensures the database check constraint `categories_name_check` is enforced
   - Expects the function to throw an error when trying to create a category with an empty name

3. **Unique Constraint Handling**
   - Tests duplicate category prevention
   - Verifies that attempting to create a category with the same name twice throws an error
   - Ensures the unique constraint `categories_pkey` is properly enforced

## Testing Framework Setup

### Dependencies

- **Vitest**: Modern testing framework (v4.0.7)
- **TypeScript**: Full TypeScript support for tests
- **pg-promise**: Database connection for test database operations

### Configuration

- Tests are configured in `tsconfig.json` to include `**/*.{test,spec}.?(c|m)[jt]s?(x)` files
- Test script defined in `package.json`: `"test": "vitest run"`

## How to Run Tests

### Prerequisites

1. Ensure PostgreSQL is running
2. Database connection is properly configured in `src/config/db.ts`
3. Required database tables exist (categories, movies)

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (for development)
npx vitest

# Run specific test file
npx vitest src/models/tests/categoryModel.test.ts
```

## Test Structure and Best Practices

### Test Lifecycle Hooks

```typescript
beforeEach(async () => {
  // Clean up movies table before each test
  await db.none('TRUNCATE categories RESTART IDENTITY CASCADE');
});

afterAll(async () => {
  // Clean up categories and close database connection
  await db.none('DELETE FROM categories');
  await db.$pool.end();
});
```

### Test Patterns Used

1. **Arrange-Act-Assert Pattern**

   ```typescript
   // Arrange: Set up test data
   const category: Category = { name: 'Avatar' };

   // Act: Execute the function
   const result = await createCategory(category);

   // Assert: Verify the outcome
   expect(result).toBeDefined();
   ```

2. **Error Testing with Async/Await**

   ```typescript
   await expect(createCategory(invalidCategory)).rejects.toThrow(
     'expected error message'
   );
   ```

3. **Database State Management**
   - Each test starts with a clean database state
   - Tests are isolated and don't affect each other
   - Proper cleanup after all tests complete

## Database Testing Considerations

### Test Database Setup

- Tests should use a separate test database
- Database schema should match production
- Consider using transactions for faster test cleanup

### What Makes a Good Database Test

1. **Isolation**: Each test should be independent
2. **Cleanup**: Proper database cleanup between tests
3. **Realistic Data**: Use data that represents real-world scenarios
4. **Error Cases**: Test both success and failure scenarios
5. **Constraints**: Verify database constraints are working

## Extending the Tests

To add more comprehensive testing, consider:

1. **Additional Model Functions**

   ```typescript
   // Test getAllCategories, updateCategory, deleteCategory
   test('getAllCategories returns all categories', async () => {
     // Implementation
   });
   ```

2. **Integration Tests**

   ```typescript
   // Test full API endpoints
   test('POST /api/categories creates new category', async () => {
     // Implementation using supertest
   });
   ```

3. **Mock Testing**
   ```typescript
   // Mock database connections for unit tests
   vi.mock('../config/db.js');
   ```

## Common Testing Patterns

### Testing Database Constraints

```typescript
test('constraint validation', async () => {
  const invalidData = {
    /* invalid data */
  };
  await expect(modelFunction(invalidData)).rejects.toThrow();
});
```

### Testing Successful Operations

```typescript
test('successful operation', async () => {
  const validData = {
    /* valid data */
  };
  const result = await modelFunction(validData);
  expect(result).toMatchObject(expectedShape);
});
```

### Testing Edge Cases

```typescript
test('edge case handling', async () => {
  const edgeCaseData = {
    /* edge case data */
  };
  const result = await modelFunction(edgeCaseData);
  expect(result).toBe(expectedResult);
});
```

## Benefits of Database Testing

1. **Confidence**: Ensures your database operations work correctly
2. **Regression Prevention**: Catches breaking changes early
3. **Documentation**: Tests serve as living documentation
4. **Refactoring Safety**: Allows safe code changes with confidence
5. **Constraint Validation**: Verifies database rules are enforced

## Next Steps

1. Add tests for all model functions
2. Implement integration tests for API endpoints
3. Add test coverage reporting
4. Consider adding performance tests for database operations
5. Set up continuous integration to run tests automatically
