import { describe, it, expect } from "vitest";
import { testReadAccess } from "../utils/testHelpers";

describe("Litany Blocks Model Access Tests", () => {
  describe("Admin user access", () => {
    it("should allow admin to read litanyBlocks table", async () => {
      const result = await testReadAccess("litanyBlocks", "admin");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });
  });

  describe("Regular user access", () => {
    it("should test user access to litanyBlocks table", async () => {
      const result = await testReadAccess("litanyBlocks", "user");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });
  });

  describe("Guest access", () => {
    it("should test guest access to litanyBlocks table", async () => {
      const result = await testReadAccess("litanyBlocks", "guest");
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });
  });
});
