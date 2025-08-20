import { db } from "@/database";

interface UsePrayersOptions {
  filterUnpublished?: boolean;
  filterByCategoryId?: string;
  skip?: boolean;
}

export default function usePrayers({
  filterUnpublished = true,
  filterByCategoryId,
  skip = false,
}: UsePrayersOptions = {}) {
  const { data, isLoading } = db.useQuery(
    !skip
      ? {
          prayers: {
            $: {
              where: {
                published: filterUnpublished == false ? undefined : true,
                ["categories.id"]: filterByCategoryId,
              },
            },
          },
        }
      : null
  );

  const prayers = data?.prayers ?? [];

  return {
    prayers,
    isLoading,
  };
}
