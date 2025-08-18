import styled from "styled-components";
import PrayerListItem from "./PrayerListItem";
import ReorderableList from "@/layout/ReorderableList";
import { Category, db, Prayer, TableNames } from "@/database";
import { Reorderable, reorderReorderable } from "@/utils/";
import { orderBy } from "lodash";
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

  const { data, isLoading } = db.useQuery({
    [PRAYERS]: {
      $: filter,
    },
  });

  const prayers = (data?.[PRAYERS] ?? []) as Prayer[];

  const orderedPrayers = orderBy(prayers, "order");

  const handleOnReorder = async (items: Reorderable[]) => {
    await reorderReorderable(items, PRAYERS);
  };

  if (isLoading) return <span />;

  return (
    <StyledPrayerList className="pb-[20vh]">
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
