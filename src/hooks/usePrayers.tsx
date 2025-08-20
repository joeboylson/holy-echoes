import { useMemo } from "react";
import { orderBy } from "lodash";
import { db, TableNames } from "../database";
import type { Prayer } from "../database/types";

const { PRAYERS } = TableNames;

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
  const filter = useMemo(() => {
    const _filter: { [key: string]: any } = {
      where: {
        published: filterUnpublished == false ? undefined : true,
      },
    };

    if (filterByCategoryId) {
      _filter.where["categories.id"] = filterByCategoryId;
    }

    return _filter;
  }, [filterUnpublished, filterByCategoryId]);

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
