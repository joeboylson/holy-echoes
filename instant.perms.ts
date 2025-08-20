import type { InstantRules } from "@instantdb/core";

const rules = {
  /**
   * --------------------------------------------------------------------------
   * DEFAULT
   * --------------------------------------------------------------------------
   */

  $default: {
    allow: {
      view: "false",
      create: "false",
      update: "false",
      delete: "false",
    },
  },

  /**
   * --------------------------------------------------------------------------
   * USERS
   * --------------------------------------------------------------------------
   */
  $users: {
    allow: {
      view: "isAdmin", // -- only admin users can see users
      create: "false", // DO NOT CHANGE: these actions are for instantdb auth system only
      update: "false", // DO NOT CHANGE: these actions are for instantdb auth system only
      delete: "false", // DO NOT CHANGE: these actions are for instantdb auth system only
    },
    bind: [
      "isAdmin",
      "auth.email in ['joeboylson@gmail.com', 'tom@proall.us']",
    ],
  },

  /**
   * --------------------------------------------------------------------------
   * FILES
   * --------------------------------------------------------------------------
   */
  $files: {
    allow: {
      view: "true",
      create: "isAdmin",
      update: "isAdmin",
      delete: "isAdmin",
    },
    bind: [
      "isAdmin",
      "auth.email in ['joeboylson@gmail.com', 'tom@proall.us']",
    ],
  },

  /**
   * --------------------------------------------------------------------------
   * ADMIN
   * --------------------------------------------------------------------------
   */
  admin: {
    allow: {
      view: "isAdmin",
      create: "false", // records to be handled in dashboard only
      update: "false", // records to be handled in dashboard only
      delete: "false", // records to be handled in dashboard only
    },
    bind: [
      "isAdmin",
      "auth.email in ['joeboylson@gmail.com', 'tom@proall.us']",
    ],
  },

  /**
   * --------------------------------------------------------------------------
   * PRAYERS
   * --------------------------------------------------------------------------
   */
  prayers: {
    allow: {
      view: "data.published || isAdmin", // users can only see published prayers
      create: "isAdmin",
      update: "isAdmin",
      delete: "isAdmin",
    },
    bind: [
      "isAdmin",
      "auth.email in ['joeboylson@gmail.com', 'tom@proall.us']",
    ],
  },

  /**
   * --------------------------------------------------------------------------
   * PRAYER BLOCKS
   * --------------------------------------------------------------------------
   */
  prayerBlocks: {
    allow: {
      view: "true",
      create: "isAdmin",
      update: "isAdmin",
      delete: "isAdmin",
    },
    bind: [
      "isAdmin",
      "auth.email in ['joeboylson@gmail.com', 'tom@proall.us']",
    ],
  },

  /**
   * --------------------------------------------------------------------------
   * PRAYER BLOCKS
   * --------------------------------------------------------------------------
   */
  blockTypes: {
    allow: {
      view: "true",
      create: "false", // records to be handled in the dashboard only
      update: "false", // records to be handled in the dashboard only
      delete: "false", // records to be handled in the dashboard only
    },
  },

  /**
   * --------------------------------------------------------------------------
   * LITANY BLOCKS
   * --------------------------------------------------------------------------
   */
  litanyBlocks: {
    allow: {
      view: "true",
      create: "isAdmin",
      update: "isAdmin",
      delete: "isAdmin",
    },
    bind: [
      "isAdmin",
      "auth.email in ['joeboylson@gmail.com', 'tom@proall.us']",
    ],
  },

  /**
   * --------------------------------------------------------------------------
   * CATEGORIES
   * --------------------------------------------------------------------------
   */
  categories: {
    allow: {
      view: "true",
      create: "isAdmin",
      update: "isAdmin",
      delete: "isAdmin",
    },
    bind: [
      "isAdmin",
      "auth.email in ['joeboylson@gmail.com', 'tom@proall.us']",
    ],
  },
} satisfies InstantRules;

export default rules;
