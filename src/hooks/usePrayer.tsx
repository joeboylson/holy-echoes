import { db } from "@/database";
import { first } from "lodash";
import usePrayers from "./usePrayers";
import useUserFavorites from "./useUserFavorites";
import useSeasons from "./useSeasons";
import { useMemo } from "react";

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
            favorites: {},
          },
        }
      : null
  );

  const prayer = first(data?.prayers ?? []);

  const isFavoritesCategory = categoryId === "favorites";
  const isSeasonCategory = categoryId === "season";

  // For favorites, use the favorites list instead of all prayers
  const { favorites, isLoading: favoritesLoading } = useUserFavorites({
    skip: skip || skipNextPrevious || !isFavoritesCategory,
  });

  // For seasons, use the current season's featured prayers
  const { currentSeason, seasonsLoading } = useSeasons();

  const { prayers: allPrayers, isLoading: allPrayersLoading } = usePrayers({
    filterUnpublished: true,
    filterByCategoryId:
      categoryId === "all-prayers" || categoryId === "search" || isFavoritesCategory || isSeasonCategory
        ? undefined
        : categoryId,
    skip: skip || skipNextPrevious || isFavoritesCategory || isSeasonCategory,
  });

  const prevPrayer = useMemo(() => {
    if (isFavoritesCategory) {
      const favoritePrayers = favorites.map((f) => f.prayer).filter(Boolean);
      const currentIndex = favoritePrayers.findIndex((p) => p?.id === prayerId);
      return currentIndex > 0 ? favoritePrayers[currentIndex - 1] : undefined;
    } else if (isSeasonCategory) {
      const seasonPrayers = currentSeason?.prayers ?? [];
      const currentIndex = seasonPrayers.findIndex((p) => p.id === prayerId);
      return currentIndex > 0 ? seasonPrayers[currentIndex - 1] : undefined;
    } else {
      const currentIndex = allPrayers.findIndex((p) => p.id === prayerId);
      return currentIndex > 0 ? allPrayers[currentIndex - 1] : undefined;
    }
  }, [isFavoritesCategory, isSeasonCategory, favorites, currentSeason, allPrayers, prayerId]);

  const nextPrayer = useMemo(() => {
    if (isFavoritesCategory) {
      const favoritePrayers = favorites.map((f) => f.prayer).filter(Boolean);
      const currentIndex = favoritePrayers.findIndex((p) => p?.id === prayerId);
      return currentIndex < favoritePrayers.length - 1
        ? favoritePrayers[currentIndex + 1]
        : undefined;
    } else if (isSeasonCategory) {
      const seasonPrayers = currentSeason?.prayers ?? [];
      const currentIndex = seasonPrayers.findIndex((p) => p.id === prayerId);
      return currentIndex < seasonPrayers.length - 1
        ? seasonPrayers[currentIndex + 1]
        : undefined;
    } else {
      const currentIndex = allPrayers.findIndex((p) => p.id === prayerId);
      return currentIndex < allPrayers.length - 1
        ? allPrayers[currentIndex + 1]
        : undefined;
    }
  }, [isFavoritesCategory, isSeasonCategory, favorites, currentSeason, allPrayers, prayerId]);

  return {
    prayer,
    prayerLoading:
      (!skip && prayerLoading) ||
      (!skipNextPrevious &&
        (isFavoritesCategory
          ? favoritesLoading
          : isSeasonCategory
            ? seasonsLoading
            : allPrayersLoading)),
    prevPrayer,
    nextPrayer,
  };
}
