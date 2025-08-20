import { describe, it, expect } from "vitest";
import { testReadAccess, testCreateAccess, generateTestData } from "../utils/testHelpers";

describe("Prayer Blocks Model Access Tests", () => {
  describe("Admin user access", () => {
    it("should allow admin to read prayerBlocks table", async () => {
      const result = await testReadAccess("prayerBlocks", "admin");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });

    it("should allow admin to create prayerBlocks", async () => {
      const testData = generateTestData("prayerBlocks");
      const result = await testCreateAccess("prayerBlocks", "admin", testData);
      
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
    it("should test user access to prayerBlocks table", async () => {
      const result = await testReadAccess("prayerBlocks", "user");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });
  });

  describe("Guest access", () => {
    it("should test guest access to prayerBlocks table", async () => {
      const result = await testReadAccess("prayerBlocks", "guest");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });
  });
});
