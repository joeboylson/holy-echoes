import { describe, it, expect } from "vitest";
import {
  testReadAccess,
  testUpdateAccess,
  testDeleteAccess,
  testFileUpload,
} from "../utils/testHelpers";

describe("Files Model Access Tests", () => {
  let fileId: string;

  describe("File Upload Tests", () => {
    it("should allow admin to upload files", async () => {
      const result = await testFileUpload("admin", "admin-test-file.txt");
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.fileId).toBeTruthy();
    });

    it("should NOT allow user to upload files", async () => {
      const result = await testFileUpload("user", "user-test-file.txt");
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow guest to upload files", async () => {
      const result = await testFileUpload("guest", "guest-test-file.txt");
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });
  });

  describe("Read Access Tests", () => {
    it("should allow admin to read files table", async () => {
      const result = await testReadAccess("$files", "admin");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();

      // Get a file record ID for update/delete tests
      expect(result.data).toBeTruthy();
      fileId = result.data![0]?.id;
      expect(fileId).toBeTruthy();
    });

    it("should allow user to read files table", async () => {
      const result = await testReadAccess("$files", "user");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });

    it("should allow guest to read files table", async () => {
      const result = await testReadAccess("$files", "guest");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });
  });

  describe("Update Access Tests", () => {
    it("should allow admin to update files", async () => {
      const updateData = { path: "updated/path/file.txt" };
      const result = await testUpdateAccess(
        "$files",
        "admin",
        fileId,
        updateData
      );
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.transactionId).toBeTruthy();
    });

    it("should NOT allow user to update files", async () => {
      const updateData = { path: "hacked/path/file.txt" };
      const result = await testUpdateAccess(
        "$files",
        "user",
        fileId,
        updateData
      );
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow guest to update files", async () => {
      const updateData = { path: "hacked/path/file.txt" };
      const result = await testUpdateAccess(
        "$files",
        "guest",
        fileId,
        updateData
      );
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });
  });

  describe("Delete Access Tests", () => {
    it("should allow admin to delete files", async () => {
      const result = await testDeleteAccess("$files", "admin", fileId);
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.transactionId).toBeTruthy();
    });

    it("should NOT allow user to delete files", async () => {
      const result = await testDeleteAccess("$files", "user", fileId);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it("should NOT allow guest to delete files", async () => {
      const result = await testDeleteAccess("$files", "guest", fileId);
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });
  });
});
