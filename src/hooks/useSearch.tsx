import { db } from "@/database";

export default function useSearch(searchTerm: string) {
  const trimmedSearch = searchTerm.trim();
  const isValidSearch = trimmedSearch.length >= 3;
  const searchPattern = `%${trimmedSearch}%`;

  // Only fetch if search term is at least 3 characters
  const { data: prayerData, isLoading: prayersLoading } = db.useQuery(
    isValidSearch
      ? {
          prayers: {
            $: {
              where: {
                published: true,
                name: { $ilike: searchPattern },
              },
            },
          },
        }
      : null
  );

  const { data: blockData, isLoading: blocksLoading } = db.useQuery(
    isValidSearch
      ? {
          prayerBlocks: {
            prayer: {},
            $: {
              where: {
                text: { $ilike: searchPattern },
              },
            },
          },
        }
      : null
  );

  return {
    prayerResults: prayerData?.prayers ?? [],
    prayerBlockResults: blockData?.prayerBlocks ?? [],
    isLoading: prayersLoading || blocksLoading,
  };
}
