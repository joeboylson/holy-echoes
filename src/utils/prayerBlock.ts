import { db, PrayerBlock, TableNames } from "../database";

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
