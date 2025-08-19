import { describe, it, expect } from "vitest";
import { testReadAccess } from "../utils/testHelpers";

describe("Categories Model Access Tests", () => {
  describe("Admin user access", () => {
    it("should allow admin to read categories table", async () => {
      const result = await testReadAccess("categories", "admin");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });
  });

  describe("Regular user access", () => {
    it("should test user access to categories table", async () => {
      const result = await testReadAccess("categories", "user");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });
  });

  describe("Guest access", () => {
    it("should test guest access to categories table", async () => {
      const result = await testReadAccess("categories", "guest");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });
  });
});
