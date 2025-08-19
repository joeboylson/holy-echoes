import { describe, it, expect } from "vitest";
import { testReadAccess } from "../utils/testHelpers";

describe("Admin Model Access Tests", () => {
  describe("Admin user access", () => {
    it("should allow admin to read admin table", async () => {
      const result = await testReadAccess("admin", "admin");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });
  });

  describe("Regular user access", () => {
    it("should test user access to admin table", async () => {
      const result = await testReadAccess("admin", "user");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBe(0);
      expect(result.error).toBeNull();
    });
  });

  describe("Guest access", () => {
    it("should test guest access to admin table", async () => {
      const result = await testReadAccess("admin", "guest");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBe(0);
      expect(result.error).toBeNull();
    });
  });
});
