import { db } from "@/database";
import type { Prayer } from "@schema";
import { cascadeDeletePrayerBlock } from "./prayerBlock";

export function cascadeDeletePrayer(prayer: Prayer) {
  const prayerBlocks = prayer.prayerBlocks;

  if (prayerBlocks) {
    const deleteTransactions = prayerBlocks.map((i) =>
      db.tx.prayerBlocks[i.id ?? ""].delete()
    );

    prayerBlocks.forEach(cascadeDeletePrayerBlock);

    db.transact(deleteTransactions);
  }
}
