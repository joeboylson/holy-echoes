import { init_experimental, i, CardinalityKind } from "@instantdb/react";

const appId = process.env.REACT_APP_INSTANT_APP_ID ?? "";

const initGraph = i.graph as any;

export enum TableNames {
  $USERS = "$users",
  PRAYERS = "prayers",
  PRAYERBLOCKS = "prayerBlocks",
  BLOCKTYPES = "blockTypes",
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

export const prayersTable = {
  prayers: i.entity({
    name: i.any(),
  }),
};

export const prayerBlocksTable = {
  prayerBlocks: i.entity({
    name: i.any(),
  }),
};

export type BlockType = {
  id?: string;
  name?: string;
  order?: number;
};

export const blockTypesTable = {
  blockTypes: i.entity({
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

export const db = init_experimental({
  appId,
  schema,
});

export type DB = typeof db;
