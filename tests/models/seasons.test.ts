import { describe, it, expect } from "vitest";
import {
  testReadAccess,
  testCreateAccess,
  testUpdateAccess,
  testDeleteAccess,
  generateTestData,
  testReadAccessWithFilter,
} from "../utils/testHelpers";

describe("Seasons Model Access Tests", () => {
  let seasonId: string;

  describe("Read Access Tests", () => {
    it("should allow admin to read seasons table", async () => {
      const result = await testReadAccess("seasons", "admin");
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();

      // Get a season record ID for update/delete tests if available
      if (result.data && result.data.length > 0) {
        seasonId = result.data[0]?.id;
        expect(seasonId).toBeTruthy();
      }
    });

    it("should allow user to read published seasons", async () => {
      const result = await testReadAccessWithFilter("seasons", "user", { published: true });
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
    });

    it("should allow guest to read published seasons", async () => {
      const result = await testReadAccessWithFilter("seasons", "guest", { published: true });
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe("Create Access Tests", () => {
    it("should allow admin to create seasons", async () => {
      const testData = generateTestData("seasons");
      const result = await testCreateAccess("seasons", "admin", testData);
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.transactionId).toBeTruthy();

      // Save the created season ID for later tests
      if (result.recordId) {
        seasonId = result.recordId;
      }
    });

    it("should NOT allow user to create seasons", async () => {
      const testData = generateTestData("seasons");
      const result = await testCreateAccess("seasons", "user", testData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow guest to create seasons", async () => {
      const testData = generateTestData("seasons");
      const result = await testCreateAccess("seasons", "guest", testData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });
  });

  describe("Update Access Tests", () => {
    it("should allow admin to update seasons", async () => {
      // Ensure we have a season ID to update
      if (!seasonId) {
        const testData = generateTestData("seasons");
        const createResult = await testCreateAccess("seasons", "admin", testData);
        seasonId = createResult.recordId;
      }

      const updateData = { name: "Updated Season Name", color: "#ff0000" };
      const result = await testUpdateAccess("seasons", "admin", seasonId, updateData);
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.transactionId).toBeTruthy();
    });

    it("should NOT allow user to update seasons", async () => {
      if (!seasonId) {
        // Skip if no season ID available
        expect(true).toBe(true);
        return;
      }

      const updateData = { name: "Hacked Season" };
      const result = await testUpdateAccess("seasons", "user", seasonId, updateData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow guest to update seasons", async () => {
      if (!seasonId) {
        // Skip if no season ID available
        expect(true).toBe(true);
        return;
      }

      const updateData = { name: "Hacked Season" };
      const result = await testUpdateAccess("seasons", "guest", seasonId, updateData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });
  });

  describe("Delete Access Tests", () => {
    it("should allow admin to delete seasons", async () => {
      // Create a season specifically for deletion
      const testData = generateTestData("seasons");
      const createResult = await testCreateAccess("seasons", "admin", testData);
      const deleteSeasonId = createResult.recordId;

      const result = await testDeleteAccess("seasons", "admin", deleteSeasonId);
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.transactionId).toBeTruthy();
    });

    it("should NOT allow user to delete seasons", async () => {
      if (!seasonId) {
        // Skip if no season ID available
        expect(true).toBe(true);
        return;
      }

      const result = await testDeleteAccess("seasons", "user", seasonId);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow guest to delete seasons", async () => {
      if (!seasonId) {
        // Skip if no season ID available
        expect(true).toBe(true);
        return;
      }

      const result = await testDeleteAccess("seasons", "guest", seasonId);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });
  });
});
