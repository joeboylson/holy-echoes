import { describe, it, expect } from "vitest";
import { testReadAccessWithFilter } from "../utils/testHelpers";

describe("Published Prayers Access Tests", () => {
  describe("Admin user access to published prayers", () => {
    it("should allow admin to read published prayers only", async () => {
      const result = await testReadAccessWithFilter("prayers", "admin", {
        published: true,
      });

      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });

    it("should allow admin to read unpublished prayers", async () => {
      const result = await testReadAccessWithFilter("prayers", "admin", {
        published: false,
      });
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });
  });

  describe("Regular user access to published prayers", () => {
    it("should test user access to published prayers only", async () => {
      const result = await testReadAccessWithFilter("prayers", "user", {
        published: true,
      });
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });

    it("should test user access to unpublished prayers", async () => {
      const result = await testReadAccessWithFilter("prayers", "user", {
        published: false,
      });
      expect(result.success).toBe(true);
      expect(result.dataCount).toBe(0);
      expect(result.error).toBeNull();
    });
  });

  describe("Guest access to published prayers", () => {
    it("should test user access to published prayers only", async () => {
      const result = await testReadAccessWithFilter("prayers", "user", {
        published: true,
      });
      expect(result.success).toBe(true);
      expect(result.dataCount).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });

    it("should test user access to unpublished prayers", async () => {
      const result = await testReadAccessWithFilter("prayers", "user", {
        published: false,
      });
      expect(result.success).toBe(true);
      expect(result.dataCount).toBe(0);
      expect(result.error).toBeNull();
    });
  });
});
