import { useMemo } from "react";
import { orderBy } from "lodash";
import { db, Prayer, Category, TableNames } from "../database";

const { PRAYERS } = TableNames;

interface UsePrayersOptions {
  filterUnpublished?: boolean;
  filterByCategory?: Category;
  skip?: boolean;
}

export default function usePrayers({
  filterUnpublished = true,
  filterByCategory,
  skip = false,
}: UsePrayersOptions = {}) {
  const filter = useMemo(() => {
    const _filter: { [key: string]: any } = {
      where: {
        published: filterUnpublished == false ? undefined : true,
      },
    };

    if (filterByCategory?.id) {
      _filter.where["categories.id"] = filterByCategory.id;
    }

    return _filter;
  }, [filterUnpublished, filterByCategory]);

  const { data, isLoading } = db.useQuery(
    !skip
      ? {
          [PRAYERS]: {
            $: filter,
          },
        }
      : null
  );

  const prayers = (data?.[PRAYERS] ?? []) as Prayer[];
  const orderedPrayers = orderBy(prayers, "order");

  return {
    prayers: orderedPrayers,
    isLoading,
  };
}