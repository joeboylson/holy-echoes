import { CardinalityKind } from "@instantdb/react";

const ONE: CardinalityKind = "one";
const MANY: CardinalityKind = "many";

export const oneToMany = (
  table: string,
  toTable: string,
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
  table: string,
  toTable: string,
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

export const manyToMany = (
  table: string,
  toTable: string,
  label: string
) => {
  return {
    forward: {
      on: table,
      has: MANY,
      label: label,
    },
    reverse: {
      on: toTable,
      has: MANY,
      label: table,
    },
  };
};
