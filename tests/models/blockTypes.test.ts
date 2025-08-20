import { describe, it, expect } from "vitest";
import {
  testReadAccess,
  testCreateAccess,
  testUpdateAccess,
  testDeleteAccess,
  generateTestData,
} from "../utils/testHelpers";

describe("Block Types Model Access Tests", () => {
  let blockTypeId: string;

  describe("Read Access Tests", () => {
    it("should allow admin to read blockTypes table", async () => {
      const result = await testReadAccess("blockTypes", "admin");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
      
      // Get a blockType record ID for update/delete tests
      expect(result.data).toBeTruthy();
      blockTypeId = result.data![0]?.id;
      expect(blockTypeId).toBeTruthy();
    });

    it("should allow user to read blockTypes table", async () => {
      const result = await testReadAccess("blockTypes", "user");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });

    it("should allow guest to read blockTypes table", async () => {
      const result = await testReadAccess("blockTypes", "guest");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });
  });

  describe("Create Access Tests", () => {
    it("should NOT allow admin to create blockTypes", async () => {
      const testData = generateTestData("blockTypes");
      const result = await testCreateAccess("blockTypes", "admin", testData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow user to create blockTypes", async () => {
      const testData = generateTestData("blockTypes");
      const result = await testCreateAccess("blockTypes", "user", testData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow guest to create blockTypes", async () => {
      const testData = generateTestData("blockTypes");
      const result = await testCreateAccess("blockTypes", "guest", testData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });
  });

  describe("Update Access Tests", () => {
    it("should NOT allow admin to update blockTypes", async () => {
      const updateData = { name: "Updated Block Type" };
      const result = await testUpdateAccess("blockTypes", "admin", blockTypeId, updateData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow user to update blockTypes", async () => {
      const updateData = { name: "Hacked Block Type" };
      const result = await testUpdateAccess("blockTypes", "user", blockTypeId, updateData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow guest to update blockTypes", async () => {
      const updateData = { name: "Hacked Block Type" };
      const result = await testUpdateAccess("blockTypes", "guest", blockTypeId, updateData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });
  });

  describe("Delete Access Tests", () => {
    it("should NOT allow admin to delete blockTypes", async () => {
      const result = await testDeleteAccess("blockTypes", "admin", blockTypeId);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow user to delete blockTypes", async () => {
      const result = await testDeleteAccess("blockTypes", "user", blockTypeId);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow guest to delete blockTypes", async () => {
      const result = await testDeleteAccess("blockTypes", "guest", blockTypeId);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });
  });
});
