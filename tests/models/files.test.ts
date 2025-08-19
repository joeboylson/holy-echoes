import { describe, it, expect } from "vitest";
import { testReadAccess } from "../utils/testHelpers";

describe("Files Model Access Tests", () => {
  describe("Admin user access", () => {
    it("should allow admin to read files table", async () => {
      const result = await testReadAccess("$files", "admin");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });
  });

  describe("Regular user access", () => {
    it("should test user access to files table", async () => {
      const result = await testReadAccess("$files", "user");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });
  });

  describe("Guest access", () => {
    it("should test guest access to files table", async () => {
      const result = await testReadAccess("$files", "guest");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });
  });
});
