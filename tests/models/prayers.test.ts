import { describe, it, expect } from "vitest";
import {
  testReadAccess,
  testCreateAccess,
  testUpdateAccess,
  testDeleteAccess,
  generateTestData,
} from "../utils/testHelpers";

describe("Prayers Model Access Tests", () => {
  let prayerId: string;

  describe("Read Access Tests", () => {
    it("should allow admin to read prayers table", async () => {
      const result = await testReadAccess("prayers", "admin");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
      
      // Get a prayer record ID for update/delete tests
      expect(result.data).toBeTruthy();
      prayerId = result.data![0]?.id;
      expect(prayerId).toBeTruthy();
    });

    it("should allow user to read prayers table", async () => {
      const result = await testReadAccess("prayers", "user");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });

    it("should allow guest to read prayers table", async () => {
      const result = await testReadAccess("prayers", "guest");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });
  });

  describe("Create Access Tests", () => {
    it("should allow admin to create prayers", async () => {
      const testData = generateTestData("prayers");
      const result = await testCreateAccess("prayers", "admin", testData);
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.transactionId).toBeTruthy();
    });

    it("should NOT allow user to create prayers", async () => {
      const testData = generateTestData("prayers");
      const result = await testCreateAccess("prayers", "user", testData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow guest to create prayers", async () => {
      const testData = generateTestData("prayers");
      const result = await testCreateAccess("prayers", "guest", testData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });
  });

  describe("Update Access Tests", () => {
    it("should allow admin to update prayers", async () => {
      const updateData = { name: "Updated Prayer", published: true };
      const result = await testUpdateAccess("prayers", "admin", prayerId, updateData);
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.transactionId).toBeTruthy();
    });

    it("should NOT allow user to update prayers", async () => {
      const updateData = { name: "Hacked Prayer" };
      const result = await testUpdateAccess("prayers", "user", prayerId, updateData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow guest to update prayers", async () => {
      const updateData = { name: "Hacked Prayer" };
      const result = await testUpdateAccess("prayers", "guest", prayerId, updateData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });
  });

  describe("Delete Access Tests", () => {
    it("should allow admin to delete prayers", async () => {
      const result = await testDeleteAccess("prayers", "admin", prayerId);
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.transactionId).toBeTruthy();
    });

    it("should NOT allow user to delete prayers", async () => {
      const result = await testDeleteAccess("prayers", "user", prayerId);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow guest to delete prayers", async () => {
      const result = await testDeleteAccess("prayers", "guest", prayerId);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });
  });
});
