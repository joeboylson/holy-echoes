import { db, Prayer, TableNames } from "../database";
import { cascadeDeletePrayerBlock } from "./prayerBlock";

const { PRAYERBLOCKS } = TableNames;

export function cascadeDeletePrayer(prayer: Prayer) {
  const prayerBlocks = prayer.prayerBlocks;

  if (prayerBlocks) {
    const deleteTransactions = prayerBlocks.map((i) =>
      db.tx[PRAYERBLOCKS][i.id ?? ""].delete()
    );

    prayerBlocks.forEach(cascadeDeletePrayerBlock);

    db.transact(deleteTransactions);
  }
}
