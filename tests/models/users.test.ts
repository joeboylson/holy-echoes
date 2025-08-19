import { describe, it, expect } from "vitest";
import { testReadAccess } from "../utils/testHelpers";

describe("Users Model Access Tests", () => {
  describe("Admin user access", () => {
    it("should allow admin to read users table", async () => {
      const result = await testReadAccess("$users", "admin");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });
  });

  describe("Regular user access", () => {
    it("should test user access to users table", async () => {
      const result = await testReadAccess("$users", "user");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });
  });

  describe("Guest access", () => {
    it("should test guest access to users table", async () => {
      const result = await testReadAccess("$users", "guest");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBe(0);
      expect(result.error).toBeNull();
    });
  });
});
