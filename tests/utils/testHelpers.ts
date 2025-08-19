import { getDbAsAdmin, getDbAsUser, getDbAsGuest, UserType } from "./testDb";

// Helper function to get the appropriate database instance for user type
export const getDbForUserType = (userType: UserType) => {
  switch (userType) {
    case "admin":
      return getDbAsAdmin();
    case "user":
      return getDbAsUser();
    case "guest":
      return getDbAsGuest();
    default:
      throw new Error(`Unknown user type: ${userType}`);
  }
};

// Helper function to test read access for a specific table and user type
export const testReadAccess = async (table: string, userType: UserType) => {
  try {
    const scopedDb = getDbForUserType(userType);
    let queryResult;

    // Use the table name directly as passed in
    const query = { [table]: {} };
    queryResult = await scopedDb.query(query);

    // Check if query was successful and extract data
    const hasError =
      queryResult.error !== undefined && queryResult.error !== null;
    // InstantDB admin SDK returns data directly, not wrapped in .data
    const tableData = queryResult[table] || [];

    return {
      userType,
      table,
      success: !hasError,
      error: hasError ? queryResult.error : null,
      dataCount: Array.isArray(tableData) ? tableData.length : 0,
      hasData: Array.isArray(tableData) && tableData.length > 0,
      data: tableData,
    };
  } catch (error) {
    return {
      userType,
      table,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      dataCount: 0,
      hasData: false,
      data: null,
    };
  }
};

// Helper to test specific queries with filters
export const testReadAccessWithFilter = async (
  table: string,
  userType: UserType,
  filter: Record<string, any> = {}
) => {
  try {
    const scopedDb = getDbForUserType(userType);
    const query = { [table]: { $: { where: filter } } };
    const queryResult = await scopedDb.query(query);

    const hasError =
      queryResult.error !== undefined && queryResult.error !== null;
    // InstantDB admin SDK returns data directly, not wrapped in .data
    const tableData = queryResult[table] || [];

    return {
      userType,
      table,
      filter,
      success: !hasError,
      error: hasError ? queryResult.error : null,
      dataCount: Array.isArray(tableData) ? tableData.length : 0,
      hasData: Array.isArray(tableData) && tableData.length > 0,
      data: tableData,
    };
  } catch (error) {
    return {
      userType,
      table,
      filter,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      dataCount: 0,
      hasData: false,
      data: null,
    };
  }
};
