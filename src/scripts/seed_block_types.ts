import { id } from "@instantdb/react";
import { BlockTypes, db, TableNames, type BlockType } from "../database";

const { BLOCKTYPES } = TableNames;

export async function seed_block_types() {
  const result = await db.queryOnce({ [BLOCKTYPES]: {} });
  const blockTypes = result.data[BLOCKTYPES] as BlockType[];
  const blockTypesNames = blockTypes.map((i) => i.name);

  const seedFunctions = Object.values(BlockTypes).map(async (name, index) => {
    const order = index + 1;

    if (!blockTypesNames.includes(name)) {
      const result = await db.transact([
        db.tx[BLOCKTYPES][id()].update({ name, order }),
      ]);
      console.debug({ result });
    } else {
      const _id = blockTypes.find((i) => i.name === name)?.id;
      const result = await db.transact([
        db.tx[BLOCKTYPES][_id ?? id()].update({ order }),
      ]);
      console.debug({ result });
    }
  });

  console.groupCollapsed("Seed Block Types");
  await Promise.all(seedFunctions);
  console.groupEnd();
}
