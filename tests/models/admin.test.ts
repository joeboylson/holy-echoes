import { describe, it, expect } from "vitest";
import {
  testReadAccess,
  testUpdateAccess,
  testDeleteAccess,
} from "../utils/testHelpers";

describe("Admin Model Access Tests", () => {
  let adminRecordId: string;

  describe("Read Access Tests", () => {
    it("should allow admin to read admin table", async () => {
      const result = await testReadAccess("admin", "admin");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
      
      // Get an admin record ID for update/delete tests
      expect(result.data).toBeTruthy();
      adminRecordId = result.data![0]?.id;
      expect(adminRecordId).toBeTruthy();
    });

    it("should test user access to admin table", async () => {
      const result = await testReadAccess("admin", "user");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBe(0);
      expect(result.error).toBeNull();
    });

    it("should test guest access to admin table", async () => {
      const result = await testReadAccess("admin", "guest");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBe(0);
      expect(result.error).toBeNull();
    });
  });

  describe("Update Access Tests", () => {
    it("should NOT allow admin to update admin records", async () => {
      const updateData = { email: "updated@example.com" };
      const result = await testUpdateAccess("admin", "admin", adminRecordId, updateData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow user to update admin records", async () => {
      const updateData = { email: "hacker@example.com" };
      const result = await testUpdateAccess("admin", "user", adminRecordId, updateData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow guest to update admin records", async () => {
      const updateData = { email: "hacker@example.com" };
      const result = await testUpdateAccess("admin", "guest", adminRecordId, updateData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });
  });

  describe("Delete Access Tests", () => {
    it("should NOT allow admin to delete admin records", async () => {
      const result = await testDeleteAccess("admin", "admin", adminRecordId);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow user to delete admin records", async () => {
      const result = await testDeleteAccess("admin", "user", adminRecordId);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow guest to delete admin records", async () => {
      const result = await testDeleteAccess("admin", "guest", adminRecordId);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });
  });
});
