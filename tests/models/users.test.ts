import { describe, it, expect } from "vitest";
import {
  testReadAccess,
  testCreateAccess,
  testUpdateAccess,
  testDeleteAccess,
} from "../utils/testHelpers";

describe("Users Model Access Tests", () => {
  let userId: string;

  describe("Read Access Tests", () => {
    it("should allow admin to read users table", async () => {
      const result = await testReadAccess("$users", "admin");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();

      // Get a user record ID for update/delete tests
      expect(result.data).toBeTruthy();
      userId = result.data![0]?.id;
      expect(userId).toBeTruthy();
    });

    it("should NOT allow user to read users table", async () => {
      const result = await testReadAccess("$users", "user");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBe(0);
      expect(result.error).toBeNull();
    });

    it("should NOT allow guest to read users table", async () => {
      const result = await testReadAccess("$users", "guest");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBe(0);
      expect(result.error).toBeNull();
    });
  });

  describe("Create Access Tests", () => {
    it("should NOT allow admin to create users", async () => {
      const testData = { email: "test@example.com" };
      const result = await testCreateAccess("$users", "admin", testData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow user to create users", async () => {
      const testData = { email: "test@example.com" };
      const result = await testCreateAccess("$users", "user", testData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow guest to create users", async () => {
      const testData = { email: "test@example.com" };
      const result = await testCreateAccess("$users", "guest", testData);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });
  });

  describe("Update Access Tests", () => {
    it("should NOT allow admin to update users", async () => {
      const updateData = { email: "updated@example.com" };
      const result = await testUpdateAccess(
        "$users",
        "admin",
        userId,
        updateData
      );
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow user to update users", async () => {
      const updateData = { email: "hacked@example.com" };
      const result = await testUpdateAccess(
        "$users",
        "user",
        userId,
        updateData
      );
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow guest to update users", async () => {
      const updateData = { email: "hacked@example.com" };
      const result = await testUpdateAccess(
        "$users",
        "guest",
        userId,
        updateData
      );
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });
  });

  describe("Delete Access Tests", () => {
    it("should NOT allow admin to delete users", async () => {
      const result = await testDeleteAccess("$users", "admin", userId);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow user to delete users", async () => {
      const result = await testDeleteAccess("$users", "user", userId);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow guest to delete users", async () => {
      const result = await testDeleteAccess("$users", "guest", userId);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });
  });
});
