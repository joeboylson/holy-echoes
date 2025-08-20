import { describe, it, expect } from "vitest";
import {
  testReadAccess,
  testCreateAccess,
  generateTestData,
} from "../utils/testHelpers";

describe("Categories Model Access Tests", () => {
  describe("Admin user access", () => {
    it("should allow admin to create categories", async () => {
      const testData = generateTestData("categories");
      const result = await testCreateAccess("categories", "admin", testData);

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.transactionId).toBeTruthy();
    });

    it("should allow admin to read categories table", async () => {
      const result = await testReadAccess("categories", "admin");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });
  });

  describe("Regular user access", () => {
    it("should test user access to categories table", async () => {
      const result = await testReadAccess("categories", "user");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });
  });

  describe("Guest access", () => {
    it("should test guest access to categories table", async () => {
      const result = await testReadAccess("categories", "guest");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });
  });
});
