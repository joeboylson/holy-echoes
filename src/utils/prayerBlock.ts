import { db, TableNames } from "../database";
import type { PrayerBlock } from "../database/types";

const { LITANYBLOCKS } = TableNames;

export function cascadeDeletePrayerBlock(prayerBlock: PrayerBlock) {
  const litanyBlocks = prayerBlock.litanyBlocks;
  if (litanyBlocks) {
    const deleteTransactions = litanyBlocks.map((i) =>
      db.tx[LITANYBLOCKS][i.id ?? ""].delete()
    );

    db.transact(deleteTransactions);
  }
}
