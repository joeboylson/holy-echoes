import { describe, it, expect } from "vitest";
import { testReadAccess, testCreateAccess, generateTestData } from "../utils/testHelpers";

describe("Prayers Model Access Tests", () => {
  describe("Admin user access", () => {
    it("should allow admin to read prayers table", async () => {
      const result = await testReadAccess("prayers", "admin");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });

    it("should allow admin to create prayers", async () => {
      const testData = generateTestData("prayers");
      const result = await testCreateAccess("prayers", "admin", testData);
      
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
    it("should test user access to prayers table", async () => {
      const result = await testReadAccess("prayers", "user");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });
  });

  describe("Guest access", () => {
    it("should test guest access to prayers table", async () => {
      const result = await testReadAccess("prayers", "guest");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });
  });
});
