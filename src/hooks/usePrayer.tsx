import { db, Prayer, TableNames } from "../database";
import { first } from "lodash";

const { PRAYERBLOCKS, PRAYERS } = TableNames;

export default function usePrayer(prayerId?: string, skip?: boolean) {
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
  const prayerOrder = prayer?.order ?? -10;

  const { data: prevNextPrayersData, isLoading: prevNextIsLoading } =
    db.useQuery(
      prayer
        ? {
            [PRAYERS]: {
              [PRAYERBLOCKS]: { blockType: {}, litanyBlocks: {} },
              $: {
                where: {
                  order: {
                    $in: [prayerOrder + 1, prayerOrder - 1],
                  },
                },
              },
            },
          }
        : null
    );

  const prevNextPrayers = (prevNextPrayersData?.[PRAYERS] ?? []) as Prayer[];

  console.log(prayerLoading, prevNextIsLoading);

  return {
    prayer,
    prayerLoading: !skip && (prayerLoading || prevNextIsLoading),
    prevNextPrayers,
  };
}
