import { init } from "@instantdb/admin";
import { schema, type AppSchema } from "@schema";

// Test database configuration - you'll need to set up a test app ID and admin token
const testAppId = process.env.VITE_INSTANT_APP_ID;
const adminToken = process.env.VITE_INSTANT_ADMIN_TOKEN;

const db = init<AppSchema>({
  appId: testAppId ?? "",
  adminToken: adminToken ?? "",
  schema,
});

// Test user configurations - UPDATE THESE WITH REAL EMAILS
export const TEST_USERS = {
  ADMIN: {
    email: "joeboylson@gmail.com", // UPDATE: Provide admin email here
  },
  USER: {
    email: "joe@spotdx.com", // UPDATE: Provide regular user email here
  },
} as const;

// Create impersonated database instances for testing
export const getDbAsAdmin = () => {
  if (!TEST_USERS.ADMIN.email) {
    throw new Error("Admin email not configured in TEST_USERS.ADMIN.email");
  }
  return db.asUser({ email: TEST_USERS.ADMIN.email });
};

export const getDbAsUser = () => {
  if (!TEST_USERS.USER.email) {
    throw new Error("User email not configured in TEST_USERS.USER.email");
  }
  return db.asUser({ email: TEST_USERS.USER.email });
};

export const getDbAsGuest = () => {
  return db.asUser({ guest: true });
};

export type UserType = "admin" | "user" | "guest";
