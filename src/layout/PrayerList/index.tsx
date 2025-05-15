import styled from "styled-components";
import PrayerListItem from "./PrayerListItem";
import ReorderableList from "@/layout/ReorderableList";
import { Category, db, Prayer, TableNames } from "@/database";
import { Reorderable, reorderReorderable } from "@/utils/";
import { orderBy, set, setWith } from "lodash";
import { useMemo } from "react";

const StyledPrayerList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  align-content: start;
  gap: 12px;
`;

const PrayerListItemsWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  align-content: start;
  gap: 4px;

  .item {
    border-bottom: 1px solid #ccc;
  }
`;

const { PRAYERS } = TableNames;

interface _props {
  filterUnpublished?: boolean;
  filterByCategory?: Category;
}

export default function PrayerList({
  filterUnpublished = true,
  filterByCategory,
}: _props) {
  const enableReorder = useMemo(
    () => window.location.pathname.includes("/admin"),
    []
  );

  const filter = useMemo(() => {
    if (!filterUnpublished) return {};

    const _filter: { [key: string]: any } = {
      where: {
        published: true,
      },
    };

    if (filterByCategory) {
      _filter.where["category.id"] = filterByCategory.id;
    }

    return _filter;
  }, [filterUnpublished, filterByCategory]);

  const { data, isLoading } = db.useQuery({
    [PRAYERS]: {
      $: filter,
    },
  });

  const prayers = (data?.[PRAYERS] ?? []) as Prayer[];

  const orderedPrayers = orderBy(prayers, "order");
  if (isLoading) return <span />;

  const handleOnReorder = async (items: Reorderable[]) => {
    await reorderReorderable(items, PRAYERS);
  };

  return (
    <StyledPrayerList>
      <PrayerListItemsWrapper>
        <ReorderableList
          items={orderedPrayers}
          onReorder={handleOnReorder}
          enabled={enableReorder}
          renderItem={(item) => <PrayerListItem prayer={item} />}
        />
      </PrayerListItemsWrapper>
    </StyledPrayerList>
  );
}
