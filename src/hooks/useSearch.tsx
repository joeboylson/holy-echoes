import { db } from "@/database";
import { useMemo } from "react";
import type { Prayer, PrayerBlock } from "@schema";

export default function useSearch(searchTerm: string) {
  const trimmedSearch = searchTerm.trim();
  const isValidSearch = trimmedSearch.length >= 3;

  // Fetch all prayers with prayer blocks and litany blocks
  const { data, isLoading } = db.useQuery(
    isValidSearch
      ? {
          prayers: {
            prayerBlocks: {
              blockType: {},
              litanyBlocks: {},
            },
            $: {
              where: {
                published: true,
              },
            },
          },
        }
      : null
  );

  // Filter prayers by name
  const prayerResults = useMemo(() => {
    if (!isValidSearch || !data?.prayers) return [];

    const lowerSearch = trimmedSearch.toLowerCase();
    return data.prayers.filter((prayer) =>
      prayer.name.toLowerCase().includes(lowerSearch)
    );
  }, [data, trimmedSearch, isValidSearch]);

  // Filter prayer blocks by text or litany content
  const prayerBlockResults = useMemo(() => {
    if (!isValidSearch || !data?.prayers) return [];

    const lowerSearch = trimmedSearch.toLowerCase();
    const blocks: (PrayerBlock & { prayer: Prayer })[] = [];
    const seenPrayerIds = new Set<string>();

    data.prayers.forEach((prayer) => {
      prayer.prayerBlocks?.forEach((block) => {
        // Skip if we've already added a block from this prayer
        if (seenPrayerIds.has(prayer.id)) return;

        // Skip image/icon blocks
        const blockTypeName = block.blockType?.name;
        if (
          blockTypeName === "Image" ||
          blockTypeName === "Small Image" ||
          blockTypeName === "Icon"
        ) {
          return;
        }

        // Check block text
        if (block.text && block.text.toLowerCase().includes(lowerSearch)) {
          blocks.push({ ...block, prayer });
          seenPrayerIds.add(prayer.id);
          return;
        }

        // Check litany blocks (call and response)
        if (block.litanyBlocks && block.litanyBlocks.length > 0) {
          const hasMatch = block.litanyBlocks.some((litany) => {
            const callMatch =
              litany.call && litany.call.toLowerCase().includes(lowerSearch);
            const responseMatch =
              litany.response &&
              litany.response.toLowerCase().includes(lowerSearch);
            return callMatch || responseMatch;
          });

          if (hasMatch) {
            blocks.push({ ...block, prayer });
            seenPrayerIds.add(prayer.id);
          }
        }
      });
    });

    return blocks;
  }, [data, trimmedSearch, isValidSearch]);

  return {
    prayerResults,
    prayerBlockResults,
    isLoading: isValidSearch ? isLoading : false,
  };
}
