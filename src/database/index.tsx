import { init, i, CardinalityKind } from "@instantdb/react";

const appId = import.meta.env.VITE_INSTANT_APP_ID ?? "";

// eslint-disable-next-line
const initGraph = i.graph as any;

export enum TableNames {
  $USERS = "$users",
  ADMIN = "admin",
  PRAYERS = "prayers",
  PRAYERBLOCKS = "prayerBlocks",
  BLOCKTYPES = "blockTypes",
  LITANYBLOCKS = "litanyBlocks",
  CATEGORY = "categories",
}

export enum BlockTypes {
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

const ONE: CardinalityKind = "one";
const MANY: CardinalityKind = "many";

export const oneToMany = (
  table: TableNames,
  toTable: TableNames,
  label: string
) => {
  return {
    forward: {
      on: table,
      has: ONE,
      label: label,
    },
    reverse: {
      on: toTable,
      has: MANY,
      label: table,
    },
  };
};

export const oneToOne = (
  table: TableNames,
  toTable: TableNames,
  label: string
) => {
  return {
    forward: {
      on: table,
      has: ONE,
      label: label,
    },
    reverse: {
      on: toTable,
      has: ONE,
      label: table,
    },
  };
};

type User = {
  id?: string;
  email?: string;
};

export type Admin = {
  id?: string;
  $user?: User;
};

export const adminTable = {
  [TableNames.ADMIN]: i.entity({}),
};

export type Prayer = {
  id?: string;
  name?: string;
  order?: number;
  published?: boolean;
  prayerBlocks?: PrayerBlock[];
  category?: Category;
};

export const prayersTable = {
  [TableNames.PRAYERS]: i.entity({
    name: i.string(),
    order: i.number(),
    published: i.boolean(),
  }),
};

export type PrayerBlock = {
  id?: string;
  text?: string;
  order?: number;
  blockType?: BlockType;
  imageUrl?: string;
  reference?: string;
  litanyBlocks?: LitanyBlock[];
  spaceAbove?: boolean;
};

export const prayerBlocksTable = {
  [TableNames.PRAYERBLOCKS]: i.entity({
    text: i.string(),
    order: i.number(),
    imageUrl: i.string(),
    reference: i.string(),
    spaceAbove: i.boolean(),
  }),
};

export type BlockType = {
  id?: string;
  name?: BlockTypes;
  order?: number;
};

export const blockTypesTable = {
  [TableNames.BLOCKTYPES]: i.entity({
    name: i.string(),
    order: i.number(),
  }),
};

export type LitanyBlock = {
  id?: string;
  order?: number;
  call?: string;
  response?: string;
  superscript?: string;
  inline?: boolean;
};

export const litanyBlocksTable = {
  [TableNames.LITANYBLOCKS]: i.entity({
    order: i.number(),
    call: i.string(),
    response: i.string(),
    superscript: i.string(),
    inline: i.boolean(),
  }),
};

export type Category = {
  id?: string;
  name?: string;
  order?: number;
  prayers?: Prayer[];
};

export const categoriesTable = {
  [TableNames.CATEGORY]: i.entity({
    name: i.string(),
    order: i.number(),
  }),
};

export const userRelations = {
  hasOneUser: oneToOne(TableNames.$USERS, TableNames.ADMIN, "admin"),
};

export const prayerRelations = {
  hasOneCategory: oneToMany(
    TableNames.PRAYERS,
    TableNames.CATEGORY,
    "category"
  ),
};

export const prayerBlocksRelations = {
  hasOneBlockType: oneToMany(
    TableNames.PRAYERBLOCKS,
    TableNames.BLOCKTYPES,
    "blockType"
  ),
  hasOnePrayer: oneToMany(
    TableNames.PRAYERBLOCKS,
    TableNames.PRAYERS,
    "prayer"
  ),
};

export const litanyBlocksRelations = {
  hasOnePrayerBlock: oneToMany(
    TableNames.LITANYBLOCKS,
    TableNames.PRAYERBLOCKS,
    "prayerBlock"
  ),
};

const schema = initGraph(
  {
    ...adminTable,
    ...prayersTable,
    ...prayerBlocksTable,
    ...blockTypesTable,
    ...litanyBlocksTable,
    ...categoriesTable,
  },
  {
    ...userRelations,
    ...prayerRelations,
    ...prayerBlocksRelations,
    ...litanyBlocksRelations,
  }
);

export const db = init({ appId, schema, devtool: false });
export type DB = typeof db;
