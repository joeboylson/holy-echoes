import { init_experimental, i, CardinalityKind } from "@instantdb/react";

const appId = process.env.REACT_APP_INSTANT_APP_ID ?? "";

const initGraph = i.graph as any;

export enum TableNames {
  $USERS = "$users",
  ADMIN = "admin",
  PRAYERS = "prayers",
  PRAYERBLOCKS = "prayerBlocks",
  BLOCKTYPES = "blockTypes",
  LITANYBLOCKS = "litanyBlocks",
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

export const userRelations = {
  hasOneUser: oneToOne(TableNames.$USERS, TableNames.ADMIN, "admin"),
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
  },
  {
    ...userRelations,
    ...prayerBlocksRelations,
    ...litanyBlocksRelations,
  }
);

export const db = init_experimental({ appId, schema, devtool: false });
export type DB = typeof db;
