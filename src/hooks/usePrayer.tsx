import { db } from "@/database";
import { first } from "lodash";
import usePrayers from "./usePrayers";

export default function usePrayer(
  prayerId?: string,
  categoryId?: string,
  skip?: boolean,
  skipNextPrevious?: boolean
) {
  const { data, isLoading: prayerLoading } = db.useQuery(
    prayerId && !skip
      ? {
          prayers: {
            prayerBlocks: { 
              blockType: {}, 
              litanyBlocks: {
                $: {
                  order: {
                    order: "asc",
                  },
                },
              }, 
              file: {},
              $: {
                order: {
                  order: "asc",
                },
              },
            },
            $: {
              where: {
                id: prayerId,
              },
            },
          },
        }
      : null
  );

  const prayer = first(data?.prayers ?? []);

  const { prayers: allPrayers, isLoading: allPrayersLoading } = usePrayers({
    filterUnpublished: true,
    filterByCategoryId:
      categoryId === "favorites" || categoryId === "all-prayers"
        ? undefined
        : categoryId,
    skip: skip || skipNextPrevious, // Skip if usePrayer is skipped or navigation not needed
  });

  const currentIndex = allPrayers.findIndex((p) => p.id === prayerId);
  const prevPrayer =
    currentIndex > 0 ? allPrayers[currentIndex - 1] : undefined;
  const nextPrayer =
    currentIndex < allPrayers.length - 1
      ? allPrayers[currentIndex + 1]
      : undefined;

  const prevNextPrayers = [prevPrayer, nextPrayer].filter(Boolean);

  return {
    prayer,
    prayerLoading:
      (!skip && prayerLoading) || (!skipNextPrevious && allPrayersLoading),
    prevNextPrayers,
  };
}
