import { describe, it, expect } from "vitest";
import {
  testReadAccess,
  testCreateAccess,
  testUpdateAccess,
  testDeleteAccess,
  generateTestData,
} from "../utils/testHelpers";

describe("Categories Model Access Tests", () => {
  let categoryId: string;

  describe("Read Access Tests", () => {
    it("should allow admin to read categories table", async () => {
      const result = await testReadAccess("categories", "admin");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
      
      // Get a category record ID for update/delete tests
      expect(result.data).toBeTruthy();
      categoryId = result.data![0]?.id;
      expect(categoryId).toBeTruthy();
    });

    it("should allow user to read categories table", async () => {
      const result = await testReadAccess("categories", "user");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });

    it("should allow guest to read categories table", async () => {
      const result = await testReadAccess("categories", "guest");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });
  });

  describe("Create Access Tests", () => {
    it("should allow admin to create categories", async () => {
      const testData = generateTestData("categories");
      const result = await testCreateAccess("categories", "admin", testData);
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.transactionId).toBeTruthy();
    });

    it("should NOT allow user to create categories", async () => {
      const testData = generateTestData("categories");
      const result = await testCreateAccess("categories", "user", testData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow guest to create categories", async () => {
      const testData = generateTestData("categories");
      const result = await testCreateAccess("categories", "guest", testData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });
  });

  describe("Update Access Tests", () => {
    it("should allow admin to update categories", async () => {
      const updateData = { name: "Updated Category" };
      const result = await testUpdateAccess("categories", "admin", categoryId, updateData);
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.transactionId).toBeTruthy();
    });

    it("should NOT allow user to update categories", async () => {
      const updateData = { name: "Hacked Category" };
      const result = await testUpdateAccess("categories", "user", categoryId, updateData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow guest to update categories", async () => {
      const updateData = { name: "Hacked Category" };
      const result = await testUpdateAccess("categories", "guest", categoryId, updateData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });
  });

  describe("Delete Access Tests", () => {
    it("should allow admin to delete categories", async () => {
      const result = await testDeleteAccess("categories", "admin", categoryId);
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.transactionId).toBeTruthy();
    });

    it("should NOT allow user to delete categories", async () => {
      const result = await testDeleteAccess("categories", "user", categoryId);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow guest to delete categories", async () => {
      const result = await testDeleteAccess("categories", "guest", categoryId);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });
  });
});
