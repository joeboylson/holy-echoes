import { describe, it, expect } from "vitest";
import { testReadAccess, testCreateAccess, generateTestData } from "../utils/testHelpers";

describe("Block Types Model Access Tests", () => {
  describe("Admin user access", () => {
    it("should allow admin to read blockTypes table", async () => {
      const result = await testReadAccess("blockTypes", "admin");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });

    it("should allow admin to create blockTypes", async () => {
      const testData = generateTestData("blockTypes");
      const result = await testCreateAccess("blockTypes", "admin", testData);
      
      console.log('Admin creation result:', {
        success: result.success,
        error: result.error,
        transactionId: result.transactionId,
        testData: result.testData
      });
      
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.transactionId).toBeTruthy();
    });
  });

  describe("Regular user access", () => {
    it("should test user access to blockTypes table", async () => {
      const result = await testReadAccess("blockTypes", "user");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });
  });

  describe("Guest access", () => {
    it("should test guest access to blockTypes table", async () => {
      const result = await testReadAccess("blockTypes", "guest");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });
  });
});
