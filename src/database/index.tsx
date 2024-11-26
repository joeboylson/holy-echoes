import { init_experimental, i, CardinalityKind } from "@instantdb/react";

const appId = process.env.REACT_APP_INSTANT_APP_ID ?? "";

const initGraph = i.graph as any;

export enum TableNames {
  $USERS = "$users",
  PRAYERS = "prayers",
  PRAYERBLOCKS = "prayerBlocks",
  BLOCKTYPES = "blockTypes",
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

export type Prayer = {
  id?: string;
  name?: string;
  order?: number;
  prayerBlocks?: PrayerBlock[];
};

export const prayersTable = {
  [TableNames.PRAYERS]: i.entity({
    name: i.string(),
    order: i.number(),
  }),
};

export type PrayerBlock = {
  id?: string;
  text?: string;
  order?: number;
  blockType?: BlockType;

  // TODO
  extra?: any;
};

export const prayerBlocksTable = {
  [TableNames.PRAYERBLOCKS]: i.entity({
    text: i.string(),
    order: i.number(),
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

const schema = initGraph(
  {
    ...prayersTable,
    ...prayerBlocksTable,
    ...blockTypesTable,
  },
  {
    ...prayerBlocksRelations,
  }
);

export const db = init_experimental({ appId, schema });
export type DB = typeof db;
