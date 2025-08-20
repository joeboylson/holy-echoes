import { describe, it, expect } from "vitest";
import {
  testReadAccessWithFilter,
  testCreateAccess,
  generateTestData,
} from "../utils/testHelpers";

describe("Published Prayers Access Tests", () => {
  let publishedPrayerId: string;
  let unpublishedPrayerId: string;

  describe("Admin user access", () => {
    it("should allow admin to create published prayer", async () => {
      const testData = { ...generateTestData("prayers"), published: true };
      const result = await testCreateAccess("prayers", "admin", testData);
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.transactionId).toBeTruthy();

      // Extract the prayer ID from the created prayer
      const adminReadResult = await testReadAccessWithFilter(
        "prayers",
        "admin",
        {
          published: true,
          name: testData.name,
        }
      );
      expect(adminReadResult.data).toBeTruthy();
      publishedPrayerId = adminReadResult.data![0]?.id;
      expect(publishedPrayerId).toBeTruthy();
    });

    it("should allow admin to create unpublished prayer", async () => {
      const testData = { ...generateTestData("prayers"), published: false };
      const result = await testCreateAccess("prayers", "admin", testData);
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.transactionId).toBeTruthy();

      // Extract the prayer ID from the created prayer
      const adminReadResult = await testReadAccessWithFilter(
        "prayers",
        "admin",
        {
          published: false,
          name: testData.name,
        }
      );
      expect(adminReadResult.data).toBeTruthy();
      unpublishedPrayerId = adminReadResult.data![0]?.id;
      expect(unpublishedPrayerId).toBeTruthy();
    });

    it("should allow admin to read both prayers by ID", async () => {
      const publishedResult = await testReadAccessWithFilter(
        "prayers",
        "admin",
        {
          id: publishedPrayerId,
        }
      );
      expect(publishedResult.success).toBe(true);
      expect(publishedResult.dataCount).toBe(1);
      expect(publishedResult.data).toBeTruthy();
      expect(publishedResult.data![0].published).toBe(true);

      const unpublishedResult = await testReadAccessWithFilter(
        "prayers",
        "admin",
        {
          id: unpublishedPrayerId,
        }
      );
      expect(unpublishedResult.success).toBe(true);
      expect(unpublishedResult.dataCount).toBe(1);
      expect(unpublishedResult.data).toBeTruthy();
      expect(unpublishedResult.data![0].published).toBe(false);
    });
  });

  describe("Regular user access", () => {
    it("should allow user to read published prayer by ID", async () => {
      const result = await testReadAccessWithFilter("prayers", "user", {
        id: publishedPrayerId,
      });
      expect(result.success).toBe(true);
      expect(result.dataCount).toBe(1);
      expect(result.data).toBeTruthy();
      expect(result.data![0].published).toBe(true);
    });

    it("should NOT allow user to read unpublished prayer by ID", async () => {
      const result = await testReadAccessWithFilter("prayers", "user", {
        id: unpublishedPrayerId,
      });
      expect(result.success).toBe(true);
      expect(result.dataCount).toBe(0);
      expect(result.error).toBeNull();
    });
  });

  describe("Guest access", () => {
    it("should allow guest to read published prayer by ID", async () => {
      const result = await testReadAccessWithFilter("prayers", "guest", {
        id: publishedPrayerId,
      });
      expect(result.success).toBe(true);
      expect(result.dataCount).toBe(1);
      expect(result.data).toBeTruthy();
      expect(result.data![0].published).toBe(true);
    });

    it("should NOT allow guest to read unpublished prayer by ID", async () => {
      const result = await testReadAccessWithFilter("prayers", "guest", {
        id: unpublishedPrayerId,
      });
      expect(result.success).toBe(true);
      expect(result.dataCount).toBe(0);
      expect(result.error).toBeNull();
    });
  });
});
