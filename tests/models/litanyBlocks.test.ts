import { describe, it, expect } from "vitest";
import {
  testReadAccess,
  testCreateAccess,
  testUpdateAccess,
  testDeleteAccess,
  generateTestData,
} from "../utils/testHelpers";

describe("Litany Blocks Model Access Tests", () => {
  let litanyBlockId: string;

  describe("Read Access Tests", () => {
    it("should allow admin to read litanyBlocks table", async () => {
      const result = await testReadAccess("litanyBlocks", "admin");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
      
      // Get a litanyBlock record ID for update/delete tests
      expect(result.data).toBeTruthy();
      litanyBlockId = result.data![0]?.id;
      expect(litanyBlockId).toBeTruthy();
    });

    it("should allow user to read litanyBlocks table", async () => {
      const result = await testReadAccess("litanyBlocks", "user");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });

    it("should allow guest to read litanyBlocks table", async () => {
      const result = await testReadAccess("litanyBlocks", "guest");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });
  });

  describe("Create Access Tests", () => {
    it("should allow admin to create litanyBlocks", async () => {
      const testData = generateTestData("litanyBlocks");
      const result = await testCreateAccess("litanyBlocks", "admin", testData);
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.transactionId).toBeTruthy();
    });

    it("should NOT allow user to create litanyBlocks", async () => {
      const testData = generateTestData("litanyBlocks");
      const result = await testCreateAccess("litanyBlocks", "user", testData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow guest to create litanyBlocks", async () => {
      const testData = generateTestData("litanyBlocks");
      const result = await testCreateAccess("litanyBlocks", "guest", testData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });
  });

  describe("Update Access Tests", () => {
    it("should allow admin to update litanyBlocks", async () => {
      const updateData = { call: "Updated Call", response: "Updated Response" };
      const result = await testUpdateAccess("litanyBlocks", "admin", litanyBlockId, updateData);
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.transactionId).toBeTruthy();
    });

    it("should NOT allow user to update litanyBlocks", async () => {
      const updateData = { call: "Hacked Call" };
      const result = await testUpdateAccess("litanyBlocks", "user", litanyBlockId, updateData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow guest to update litanyBlocks", async () => {
      const updateData = { call: "Hacked Call" };
      const result = await testUpdateAccess("litanyBlocks", "guest", litanyBlockId, updateData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });
  });

  describe("Delete Access Tests", () => {
    it("should allow admin to delete litanyBlocks", async () => {
      const result = await testDeleteAccess("litanyBlocks", "admin", litanyBlockId);
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.transactionId).toBeTruthy();
    });

    it("should NOT allow user to delete litanyBlocks", async () => {
      const result = await testDeleteAccess("litanyBlocks", "user", litanyBlockId);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow guest to delete litanyBlocks", async () => {
      const result = await testDeleteAccess("litanyBlocks", "guest", litanyBlockId);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });
  });
});
