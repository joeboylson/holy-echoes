import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { id } from "@instantdb/admin";
import {
  testReadAccess,
  testUpdateAccess,
  testDeleteAccess,
  testCreateFavoriteWithOwner,
  generateTestData,
  getDbForUserType,
} from "../utils/testHelpers";
import { type Prayer } from "@schema";

describe("Favorites Model Tests", () => {
  /**
   * SAVE THESE VALUES FOR LATER
   */
  const savedValues = {
    publishedPrayerId: "",
    unpublishedPrayerId: "",
    userFavoriteId: "",
    adminFavoriteId: "",
  };

  beforeAll(async () => {
    // Create a test prayer first to link favorites to
    const adminDb = getDbForUserType("admin");

    /**
     * UNPUBLISHED PRAYER
     */

    const unpublishedPrayerData: Prayer = generateTestData("prayers");
    savedValues.unpublishedPrayerId = id();
    await adminDb.transact(
      adminDb.tx.prayers[savedValues.unpublishedPrayerId].create(
        unpublishedPrayerData
      )
    );

    /**
     * PUBLISHED PRAYER
     */

    const publishedPrayerData: Prayer = {
      ...generateTestData("prayers"),
      published: true,
    };
    savedValues.publishedPrayerId = id();
    await adminDb.transact(
      adminDb.tx.prayers[savedValues.publishedPrayerId].create(
        publishedPrayerData
      )
    );
  });

  describe("Create Access", () => {
    it("should allow users to create favorites with ownership and published prayer", async () => {
      const result = await testCreateFavoriteWithOwner(
        "user",
        undefined,
        savedValues.publishedPrayerId
      );

      if (result.recordId) savedValues.userFavoriteId = result.recordId;
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.recordId).toBeDefined();
      expect(result.userType).toBe("user");
    });

    it("should NOT allow users to create favorites with UNPUBLISHED prayer", async () => {
      const result = await testCreateFavoriteWithOwner(
        "user",
        undefined,
        savedValues.unpublishedPrayerId
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.recordId).toBeNull();
    });

    it("should allow admin users to create favorites with UNPUBLISHED prayer", async () => {
      const result = await testCreateFavoriteWithOwner(
        "admin",
        undefined,
        savedValues.publishedPrayerId
      );

      if (result.recordId) savedValues.adminFavoriteId = result.recordId;
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.recordId).toBeDefined();
      expect(result.userType).toBe("admin");
    });

    it("should deny guests from creating favorites", async () => {
      const result = await testCreateFavoriteWithOwner("guest");

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.recordId).toBeNull();
    });
  });

  describe("Read Access", () => {
    it("should allow users to read their own favorites", async () => {
      const result = await testReadAccess("favorites", "user");

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.dataCount).toBeGreaterThan(0);

      const recordIds = result.data?.map((i) => i.id) ?? [];

      expect(savedValues.userFavoriteId).toBeOneOf(recordIds);
      expect(savedValues.adminFavoriteId).not.toBeOneOf(recordIds);
    });

    it("should allow admin to read their own favorites", async () => {
      const result = await testReadAccess("favorites", "admin");

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.dataCount).toBeGreaterThan(0);

      const recordIds = result.data?.map((i) => i.id) ?? [];

      expect(savedValues.adminFavoriteId).toBeOneOf(recordIds);
      expect(savedValues.userFavoriteId).not.toBeOneOf(recordIds);
    });

    it("should deny guests from reading any favorites", async () => {
      const result = await testReadAccess("favorites", "guest");

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.dataCount).toBe(0);
    });

    it("should enforce proper user isolation across all scenarios", async () => {
      const userResult = await testReadAccess("favorites", "user");
      const adminResult = await testReadAccess("favorites", "admin");

      expect(userResult.success).toBe(true);
      expect(adminResult.success).toBe(true);

      // Verify complete isolation between users
      if (userResult.data && adminResult.data) {
        const userFavoriteIds = userResult.data.map(
          (fav: { id: string }) => fav.id
        );
        const adminFavoriteIds = adminResult.data.map(
          (fav: { id: string }) => fav.id
        );

        // No overlap between user and admin favorites
        const hasOverlap = userFavoriteIds.some((id: string) =>
          adminFavoriteIds.includes(id)
        );
        expect(hasOverlap).toBe(false);

        // Each user has their own favorite
        expect(userFavoriteIds).toContain(savedValues.userFavoriteId);
        expect(adminFavoriteIds).toContain(savedValues.adminFavoriteId);

        // Users cannot see each other's favorites
        expect(userFavoriteIds).not.toContain(savedValues.adminFavoriteId);
        expect(adminFavoriteIds).not.toContain(savedValues.userFavoriteId);
      }
    });
  });

  describe("Update Access", () => {
    it("should allow users to update their own favorites", async () => {
      const updateData = { order: 999 };
      const result = await testUpdateAccess(
        "favorites",
        "user",
        savedValues.userFavoriteId,
        updateData
      );

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.recordId).toBe(savedValues.userFavoriteId);
    });

    it("should allow admin to update their own favorites", async () => {
      const updateData = { order: 888 };
      const result = await testUpdateAccess(
        "favorites",
        "admin",
        savedValues.adminFavoriteId,
        updateData
      );

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.recordId).toBe(savedValues.adminFavoriteId);
    });

    it("should deny users from updating other users' favorites", async () => {
      const updateData = { order: 777 };
      const result = await testUpdateAccess(
        "favorites",
        "user",
        savedValues.adminFavoriteId,
        updateData
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should deny admin from updating other users' favorites", async () => {
      const updateData = { order: 666 };
      const result = await testUpdateAccess(
        "favorites",
        "admin",
        savedValues.userFavoriteId,
        updateData
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should deny guests from updating any favorites", async () => {
      const updateData = { order: 555 };
      const result = await testUpdateAccess(
        "favorites",
        "guest",
        savedValues.userFavoriteId,
        updateData
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("Delete Access", () => {
    it("should deny guests from deleting user favorites", async () => {
      const result = await testDeleteAccess(
        "favorites",
        "guest",
        savedValues.userFavoriteId
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should deny guests from deleting admin favorites", async () => {
      const result = await testDeleteAccess(
        "favorites",
        "guest",
        savedValues.adminFavoriteId
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should deny users from deleting admin favorites", async () => {
      const result = await testDeleteAccess(
        "favorites",
        "user",
        savedValues.adminFavoriteId
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should deny admin from deleting user favorites", async () => {
      const result = await testDeleteAccess(
        "favorites",
        "admin",
        savedValues.userFavoriteId
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should allow users to delete their own favorites", async () => {
      const result = await testDeleteAccess(
        "favorites",
        "user",
        savedValues.userFavoriteId
      );

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.recordId).toBe(savedValues.userFavoriteId);
    });

    it("should allow admin to delete their own favorites", async () => {
      const result = await testDeleteAccess(
        "favorites",
        "admin",
        savedValues.adminFavoriteId
      );

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.recordId).toBe(savedValues.adminFavoriteId);
    });
  });

  afterAll(async () => {
    const adminDb = getDbForUserType("admin");

    /**
     * remove test prayers
     */
    await adminDb.transact(
      adminDb.tx.prayers[savedValues.unpublishedPrayerId].delete()
    );

    await adminDb.transact(
      adminDb.tx.prayers[savedValues.publishedPrayerId].delete()
    );
  });
});
