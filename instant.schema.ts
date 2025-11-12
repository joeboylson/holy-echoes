import { i, InstaQLEntity } from "@instantdb/react";

// Enums for better type safety
export enum BlockTypeNames {
  CENTERED_TITLE = "Centered Title",
  BODY = "Body",
  BODY_CENTERED = "Body Centered",
  INFO_TEXT = "Info Text",
  REFERENCE = "Reference",
  QUOTE = "Quote",
  IMAGE = "Image",
  SMALL_IMAGE = "Small Image",
  LITANY = "Litany",
  TWO_COLUMN = "Two Column",
  SPACER = "Spacer",
  ICON = "Icon",
}

// Proper InstantDB schema definition using i.schema()
const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),

    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
      // NOTE: InstantDB automatically handles other file metadata
    }),

    // Custom tables
    admin: i.entity({
      // Empty entity - relationship defined in links
      // This creates admin "roles" linked to users
    }),

    prayers: i.entity({
      name: i.string(),
      order: i.number().indexed(),
      published: i.boolean().indexed(),
      // NOTE: createdAt and updatedAt could be added for audit trail
      // createdAt: i.date().optional(),
      // updatedAt: i.date().optional(),
    }),

    prayerBlocks: i.entity({
      text: i.string().optional(), // Some blocks might not have text (e.g., images)
      order: i.number().indexed(),
      reference: i.string().optional(), // Not all blocks have references
      spaceAbove: i.boolean().optional(),
      // NOTE: blockType and file relationships defined in links
    }),

    blockTypes: i.entity({
      name: i.string().unique(), // Block type names should be unique
      order: i.number().indexed(),
    }),

    litanyBlocks: i.entity({
      order: i.number().indexed(),
      call: i.string().optional(),
      response: i.string().optional(),
      superscript: i.string().optional(), // Not all litany blocks have superscript
      inline: i.boolean().optional(),
    }),

    categories: i.entity({
      name: i.string().unique(), // Category names should be unique
      order: i.number().indexed(),
    }),

    favorites: i.entity({
      order: i.number().indexed(),
    }),

    seasons: i.entity({
      name: i.string(),
      color: i.string(),
      startMonth: i.number().indexed(), // 1-12 (January = 1, December = 12)
      startDay: i.number().indexed(), // 1-31
      endMonth: i.number().indexed(), // 1-12 (January = 1, December = 12)
      endDay: i.number().indexed(), // 1-31
      published: i.boolean().indexed(),
    }),
  },

  links: {
    // Admin -> User relationship (one-to-one)
    adminUser: {
      forward: { on: "admin", has: "one", label: "$user" },
      reverse: { on: "$users", has: "one", label: "admin" },
    },

    // Prayer -> Categories relationship (many-to-many)
    prayerCategories: {
      forward: { on: "prayers", has: "many", label: "categories" },
      reverse: { on: "categories", has: "many", label: "prayers" },
    },

    // PrayerBlocks -> Prayer relationship (many-to-one)
    prayerBlocks: {
      forward: { on: "prayerBlocks", has: "one", label: "prayer" },
      reverse: { on: "prayers", has: "many", label: "prayerBlocks" },
    },

    // PrayerBlock -> BlockType relationship (many-to-one)
    prayerBlockType: {
      forward: { on: "prayerBlocks", has: "one", label: "blockType" },
      reverse: { on: "blockTypes", has: "many", label: "prayerBlocks" },
    },

    // PrayerBlock -> File relationship (many-to-one) for images
    prayerBlockFile: {
      forward: { on: "prayerBlocks", has: "one", label: "file" },
      reverse: { on: "$files", has: "many", label: "prayerBlocks" },
    },

    // LitanyBlocks -> PrayerBlock relationship (many-to-one)
    prayerBlockLitany: {
      forward: { on: "litanyBlocks", has: "one", label: "prayerBlock" },
      reverse: { on: "prayerBlocks", has: "many", label: "litanyBlocks" },
    },

    // Favorites -> User relationship (many-to-one)
    favoriteUser: {
      forward: {
        on: "favorites",
        has: "one",
        label: "owner",
      },
      reverse: { on: "$users", has: "many", label: "favorites" },
    },

    // Favorites -> Prayer relationship (many-to-one)
    favoritePrayer: {
      forward: { on: "favorites", has: "one", label: "prayer" },
      reverse: { on: "prayers", has: "many", label: "favorites" },
    },

    // Season -> File relationship (one-to-one) for featured image
    seasonFile: {
      forward: { on: "seasons", has: "one", label: "file" },
      reverse: { on: "$files", has: "many", label: "seasons" },
    },

    // Season -> Prayers relationship (one-to-many) for featured prayers
    seasonPrayers: {
      forward: { on: "prayers", has: "one", label: "season" },
      reverse: { on: "seasons", has: "many", label: "prayers" },
    },
  },
});

// This helps Typescript display better intellisense
type _AppSchema = typeof _schema;

// eslint-disable-next-line
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;

/**
 * ENTITY TYPES
 */

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type User = InstaQLEntity<AppSchema, "$users", { admin?: {} }>;
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type File = InstaQLEntity<AppSchema, "$files", { prayerBlocks?: {} }>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type Admin = InstaQLEntity<AppSchema, "admin", { $user?: {} }>;

export type Prayer = InstaQLEntity<
  AppSchema,
  "prayers",
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  { categories?: {}; prayerBlocks?: {} }
>;

export type PrayerBlock = InstaQLEntity<
  AppSchema,
  "prayerBlocks",
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  { prayer?: {}; blockType?: {}; file?: {}; litanyBlocks?: {} }
>;

export type BlockType = InstaQLEntity<
  AppSchema,
  "blockTypes",
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  { prayerBlocks?: {} }
>;

export type LitanyBlock = InstaQLEntity<
  AppSchema,
  "litanyBlocks",
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  { prayerBlock?: {} }
>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type Category = InstaQLEntity<AppSchema, "categories", { prayers?: {} }>;

export type Favorite = InstaQLEntity<
  AppSchema,
  "favorites",
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  { owner?: {}; prayer?: {} }
>;

export type Season = InstaQLEntity<
  AppSchema,
  "seasons",
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  { file?: {}; prayers?: {} }
>;

/**
 * TABLE NAMES
 */

export type TableNames = keyof AppSchema["entities"];
