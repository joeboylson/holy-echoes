# InstantDB Permissions Test Suite

This test suite validates read access permissions for all models in your InstantDB application across different user types.

## Setup Required

### 1. Environment Variables
Create a `.env.local` or add to your environment:

```bash
# Your InstantDB app configuration
VITE_INSTANT_APP_ID=your_app_id_here
VITE_INSTANT_ADMIN_TOKEN=your_admin_token_here

# Optional: separate test app (recommended for production)
VITE_TEST_INSTANT_APP_ID=your_test_app_id_here
```

### 2. User Email Configuration
Update the test user emails in `/tests/utils/testDb.ts`:

```typescript
export const TEST_USERS = {
  ADMIN: {
    email: 'admin@yourdomain.com', // UPDATE: Your admin user email
  },
  USER: {
    email: 'user@yourdomain.com',  // UPDATE: Your regular user email
  },
} as const;
```

## Models Tested

The test suite covers all your InstantDB models:

- **Users** (`$users`) - System user table
- **Files** (`$files`) - File storage table  
- **Admin** (`admin`) - Admin role assignments
- **Prayers** (`prayers`) - Prayer content with published/draft states
- **Prayer Blocks** (`prayerBlocks`) - Individual prayer components
- **Block Types** (`blockTypes`) - Prayer block type definitions
- **Litany Blocks** (`litanyBlocks`) - Call-and-response prayer blocks
- **Categories** (`categories`) - Prayer categorization

## User Types Tested

- **Admin** - Full access user (impersonated via email)
- **User** - Regular authenticated user (impersonated via email)  
- **Guest** - Unauthenticated visitor

## Test Types

### Basic Access Tests
Each model has individual test files in `/tests/models/` that test:
- Whether each user type can query the table
- Error messages for denied access
- Data counts when access is granted

### Published Content Tests
Special tests for content with `published` field:
- Access to all records vs. published-only
- Draft/unpublished content access by role

### Complete Permissions Matrix
The `permissionsSuite.test.ts` runs all combinations and generates a comprehensive report.

## Running Tests

```bash
# Interactive mode (watch for changes)
npm run test

# Single run with results
npm run test:run

# Run specific test file
npm run test tests/models/prayers.test.ts

# Run complete permissions suite
npm run test tests/permissionsSuite.test.ts
```

## Expected Behavior

Based on typical InstantDB permission patterns:

- **Admin users**: Should have read access to all tables and records
- **Regular users**: May have limited access, possibly only to published content
- **Guests**: Likely restricted to public/published content only

## Understanding Results

Each test returns:
```typescript
{
  userType: 'admin' | 'user' | 'guest',
  table: string,
  success: boolean,      // Whether query succeeded
  error: string | null,  // Error message if failed
  dataCount: number,     // Number of records returned
  hasData: boolean,      // Whether any data was returned
  data: any[]           // Actual data (for debugging)
}
```

## Security Notes

- Tests use InstantDB's `db.asUser()` impersonation feature
- No actual user authentication tokens are created
- Tests are read-only and don't modify data
- Uses admin SDK to safely test different permission contexts

## Next Steps

1. Configure the user emails and environment variables
2. Run the tests to see current permission behavior
3. Use results to understand your current permission rules
4. Add permission rules in InstantDB dashboard if needed
5. Re-run tests to validate permission changes