import { id } from "@instantdb/admin";
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

    // Use the table name directly as passed in
    const query = { [table]: {} };
    const queryResult = await scopedDb.query(query);

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
  filter: Record<string, string | number | boolean> = {}
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

// Helper to test creation access for a specific table and user type
export const testCreateAccess = async (
  table: string,
  userType: UserType,
  testData: Record<string, string | number | boolean>
) => {
  try {
    const scopedDb = getDbForUserType(userType);

    const transactionResult = await scopedDb.transact(
      scopedDb.tx[table][id()].create(testData)
    );

    const hasError =
      transactionResult.error !== undefined && transactionResult.error !== null;

    return {
      userType,
      table,
      testData,
      success: !hasError,
      error: hasError ? transactionResult.error : null,
      transactionId: hasError ? null : transactionResult["tx-id"],
    };
  } catch (error) {
    return {
      userType,
      table,
      testData,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      transactionId: null,
    };
  }
};

// Helper to test update access for a specific table and user type
export const testUpdateAccess = async (
  table: string,
  userType: UserType,
  recordId: string,
  updateData: Record<string, string | number | boolean>
) => {
  try {
    const scopedDb = getDbForUserType(userType);

    const transactionResult = await scopedDb.transact(
      scopedDb.tx[table][recordId].update(updateData)
    );

    const hasError =
      transactionResult.error !== undefined && transactionResult.error !== null;

    return {
      userType,
      table,
      recordId,
      updateData,
      success: !hasError,
      error: hasError ? transactionResult.error : null,
      transactionId: hasError ? null : transactionResult["tx-id"],
    };
  } catch (error) {
    return {
      userType,
      table,
      recordId,
      updateData,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      transactionId: null,
    };
  }
};

// Helper to test delete access for a specific table and user type
export const testDeleteAccess = async (
  table: string,
  userType: UserType,
  recordId: string
) => {
  try {
    const scopedDb = getDbForUserType(userType);

    const transactionResult = await scopedDb.transact(
      scopedDb.tx[table][recordId].delete()
    );

    const hasError =
      transactionResult.error !== undefined && transactionResult.error !== null;

    return {
      userType,
      table,
      recordId,
      success: !hasError,
      error: hasError ? transactionResult.error : null,
      transactionId: hasError ? null : transactionResult["tx-id"],
    };
  } catch (error) {
    return {
      userType,
      table,
      recordId,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      transactionId: null,
    };
  }
};

// Helper to test file upload for a specific user type
export const testFileUpload = async (
  userType: UserType,
  fileName: string = "test-file.txt"
) => {
  try {
    const scopedDb = getDbForUserType(userType);

    // Add random string to filename to avoid conflicts
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const [name, extension] = fileName.split(".");
    const uniqueFileName = `${name}-${randomSuffix}.${extension}`;

    // Create a simple test file blob
    const testContent = `Test file content ${Date.now()}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const file: any = new File([testContent], uniqueFileName, {
      type: "text/plain",
    });

    // Upload file with proper options
    const opts = {
      contentType: file.type,
      contentDisposition: "attachment",
    };

    await scopedDb.storage.uploadFile(uniqueFileName, file, opts);

    // If we get here, upload was successful
    return {
      userType,
      fileName: uniqueFileName,
      success: true,
      error: null,
      fileId: uniqueFileName,
      uploadResult: "success",
    };
  } catch (error) {
    return {
      userType,
      fileName: fileName,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      fileId: null,
      uploadResult: null,
    };
  }
};

// Helper to generate test data for different table types
export const generateTestData = (table: string) => {
  const timestamp = Date.now();

  switch (table) {
    case "prayers":
      return {
        name: `Test Prayer ${timestamp}`,
        order: timestamp,
        published: false,
      };

    case "categories":
      return {
        name: `Test Category ${timestamp}`,
        order: timestamp,
      };

    case "blockTypes":
      return {
        name: `Test Block Type ${timestamp}`,
        order: timestamp,
      };

    case "prayerBlocks":
      return {
        text: `Test prayer block content ${timestamp}`,
        order: timestamp,
        reference: "Test Reference",
        spaceAbove: false,
      };

    case "litanyBlocks":
      return {
        order: timestamp,
        call: `Test call ${timestamp}`,
        response: `Test response ${timestamp}`,
        superscript: "",
        inline: false,
      };

    default:
      return {
        name: `Test ${table} ${timestamp}`,
        order: timestamp,
      };
  }
};
