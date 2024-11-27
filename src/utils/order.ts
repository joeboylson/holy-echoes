import { indexOf } from "lodash";
import { db, LitanyBlock, Prayer, PrayerBlock, TableNames } from "../database";

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

  console.log({ allBlocks });
  console.log({ prayerBlockPrev });

  const prevBlockId = prayerBlockPrev.id;
  if (!prevBlockId) return console.error("no previous block id");
  const prevOrder = prayerBlockPrev.order;
  if (prevOrder === undefined) return console.info("no previous order");

  console.log(">>> do reorder");
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

  console.log(">>> do reorder");
  db.transact([
    db.tx[table][blockId].update({ order: nextOrder }),
    db.tx[table][nextBlockId].update({ order: currentOrder }),
  ]);
}
