import { indexOf } from "lodash";
import { db, LitanyBlock, Prayer, PrayerBlock, TableNames } from "../database";
import { SlotItemMapArray } from "swapy";

type Reorderable = Prayer | PrayerBlock | LitanyBlock;

export function moveBlockUp(
  block: Reorderable,
  allBlocks: Reorderable[],
  table: TableNames
) {
  const blockId = block.id;
  if (!blockId) return console.error("no block id");

  const currentIndex = indexOf(allBlocks, block);
  if (currentIndex === 0) return console.info("already at index 0");
  const currentOrder = block.order;
  if (currentOrder === undefined) return console.info("no order");

  const prayerBlockPrev = allBlocks[currentIndex - 1];

  const prevBlockId = prayerBlockPrev.id;
  if (!prevBlockId) return console.error("no previous block id");
  const prevOrder = prayerBlockPrev.order;
  if (prevOrder === undefined) return console.info("no previous order");

  db.transact([
    db.tx[table][blockId].update({ order: prevOrder }),
    db.tx[table][prevBlockId].update({ order: currentOrder }),
  ]);
}

export function moveBlockDown(
  block: Reorderable,
  allBlocks: Reorderable[],
  table: TableNames
) {
  const blockId = block.id;
  if (!blockId) return console.error("no block id");

  const currentIndex = indexOf(allBlocks, block);
  if (currentIndex === allBlocks.length - 1)
    return console.info("already at last index");
  const currentOrder = block.order;
  if (currentOrder === undefined) return console.info("no order");

  const prayerBlockNext = allBlocks[currentIndex + 1];
  const nextBlockId = prayerBlockNext.id;
  if (!nextBlockId) return console.error("no next block id");
  const nextOrder = prayerBlockNext.order;
  if (nextOrder === undefined) return console.info("no next order");

  db.transact([
    db.tx[table][blockId].update({ order: nextOrder }),
    db.tx[table][nextBlockId].update({ order: currentOrder }),
  ]);
}

export function removeBlock(
  block: Reorderable,
  allBlocks: Reorderable[],
  table: TableNames
) {
  const blockId = block.id;
  if (!blockId) return console.error("no block id");

  db.transact([db.tx[table][blockId].delete()]);

  const updatedAllBlocks = allBlocks.filter((i) => i.id !== blockId);
  normalizeOrder(updatedAllBlocks, table);
}

export function normalizeOrder(allBlocks: Reorderable[], table: TableNames) {
  const reorderTransactions = allBlocks.map((i, order) =>
    db.tx[table][i.id ?? ""].update({ order })
  );

  db.transact(reorderTransactions);
}

export async function reorderByMapArray(
  mapArray: SlotItemMapArray,
  table: TableNames,
  currentItems: Reorderable[]
) {
  const itemIdsInNewOrder = mapArray.map((i) => i.item);

  const promises = currentItems.map((i) => {
    const order = indexOf(itemIdsInNewOrder, i.id);
    return db.tx[table][i.id ?? ""].update({ order });
  });

  await db.transact(promises);
}
