import { describe, it, expect } from "vitest";
import {
  testReadAccess,
  testCreateAccess,
  testUpdateAccess,
  testDeleteAccess,
  generateTestData,
} from "../utils/testHelpers";

describe("Prayer Blocks Model Access Tests", () => {
  let prayerBlockId: string;

  describe("Read Access Tests", () => {
    it("should allow admin to read prayerBlocks table", async () => {
      const result = await testReadAccess("prayerBlocks", "admin");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
      
      // Get a prayerBlock record ID for update/delete tests
      expect(result.data).toBeTruthy();
      prayerBlockId = result.data![0]?.id;
      expect(prayerBlockId).toBeTruthy();
    });

    it("should allow user to read prayerBlocks table", async () => {
      const result = await testReadAccess("prayerBlocks", "user");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });

    it("should allow guest to read prayerBlocks table", async () => {
      const result = await testReadAccess("prayerBlocks", "guest");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });
  });

  describe("Create Access Tests", () => {
    it("should allow admin to create prayerBlocks", async () => {
      const testData = generateTestData("prayerBlocks");
      const result = await testCreateAccess("prayerBlocks", "admin", testData);
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.transactionId).toBeTruthy();
    });

    it("should NOT allow user to create prayerBlocks", async () => {
      const testData = generateTestData("prayerBlocks");
      const result = await testCreateAccess("prayerBlocks", "user", testData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow guest to create prayerBlocks", async () => {
      const testData = generateTestData("prayerBlocks");
      const result = await testCreateAccess("prayerBlocks", "guest", testData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });
  });

  describe("Update Access Tests", () => {
    it("should allow admin to update prayerBlocks", async () => {
      const updateData = { text: "Updated prayer text", reference: "Updated Reference" };
      const result = await testUpdateAccess("prayerBlocks", "admin", prayerBlockId, updateData);
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.transactionId).toBeTruthy();
    });

    it("should NOT allow user to update prayerBlocks", async () => {
      const updateData = { text: "Hacked prayer text" };
      const result = await testUpdateAccess("prayerBlocks", "user", prayerBlockId, updateData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow guest to update prayerBlocks", async () => {
      const updateData = { text: "Hacked prayer text" };
      const result = await testUpdateAccess("prayerBlocks", "guest", prayerBlockId, updateData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });
  });

  describe("Delete Access Tests", () => {
    it("should allow admin to delete prayerBlocks", async () => {
      const result = await testDeleteAccess("prayerBlocks", "admin", prayerBlockId);
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.transactionId).toBeTruthy();
    });

    it("should NOT allow user to delete prayerBlocks", async () => {
      const result = await testDeleteAccess("prayerBlocks", "user", prayerBlockId);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow guest to delete prayerBlocks", async () => {
      const result = await testDeleteAccess("prayerBlocks", "guest", prayerBlockId);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });
  });
});
