import { db } from "@/database";
import type { PrayerBlock } from "@schema";

export function cascadeDeletePrayerBlock(prayerBlock: PrayerBlock) {
  const litanyBlocks = prayerBlock.litanyBlocks;
  if (litanyBlocks) {
    const deleteTransactions = litanyBlocks.map((i) =>
      db.tx.litanyBlocks[i.id ?? ""].delete()
    );

    db.transact(deleteTransactions);
  }
}
