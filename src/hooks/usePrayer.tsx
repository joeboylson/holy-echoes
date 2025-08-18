import { db, Prayer, TableNames } from "../database";
import { first } from "lodash";
import usePrayers from "./usePrayers";

const { PRAYERBLOCKS, PRAYERS } = TableNames;

export default function usePrayer(
  prayerId?: string,
  categoryId?: string,
  skip?: boolean,
  skipNextPrevious?: boolean
) {
  const { data, isLoading: prayerLoading } = db.useQuery(
    prayerId && !skip
      ? {
          [PRAYERS]: {
            [PRAYERBLOCKS]: { blockType: {}, litanyBlocks: {}, file: {} },
            $: {
              where: {
                id: prayerId,
              },
            },
          },
        }
      : null
  );

  const prayer = first((data?.[PRAYERS] ?? []) as Prayer[]);

  const { prayers: allPrayers, isLoading: allPrayersLoading } = usePrayers({
    filterUnpublished: true,
    filterByCategory: categoryId ? { id: categoryId } : undefined,
    skip: skip || skipNextPrevious, // Skip if usePrayer is skipped or navigation not needed
  });

  const currentIndex = allPrayers.findIndex((p) => p.id === prayerId);
  const prevPrayer =
    currentIndex > 0 ? allPrayers[currentIndex - 1] : undefined;
  const nextPrayer =
    currentIndex < allPrayers.length - 1
      ? allPrayers[currentIndex + 1]
      : undefined;

  const prevNextPrayers = [prevPrayer, nextPrayer].filter(Boolean) as Prayer[];

  return {
    prayer,
    prayerLoading:
      (!skip && prayerLoading) || (!skipNextPrevious && allPrayersLoading),
    prevNextPrayers,
  };
}
