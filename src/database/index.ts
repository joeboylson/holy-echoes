import { init } from "@instantdb/react";
import schema from "@schema";
import { type AppSchema } from "@schema";

const appId = import.meta.env.VITE_INSTANT_APP_ID ?? "";

// Initialize database with proper schema
export const db = init<AppSchema>({
  appId,
  schema,
  devtool: false,
});

// Export types for use throughout the app
export type DB = typeof db;

// Re-export schema types and enums
export * from "./types";
export * from "@schema";

// Legacy compatibility - table names as constants
export const TableNames = {
  $USERS: "$users" as const,
  $FILES: "$files" as const,
  ADMIN: "admin" as const,
  PRAYERS: "prayers" as const,
  PRAYERBLOCKS: "prayerBlocks" as const,
  BLOCKTYPES: "blockTypes" as const,
  LITANYBLOCKS: "litanyBlocks" as const,
  CATEGORY: "categories" as const,
} as const;
