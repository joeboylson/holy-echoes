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
