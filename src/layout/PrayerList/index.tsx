import styled from "styled-components";
import PrayerListItem from "./PrayerListItem";
import ReorderableList from "@/layout/ReorderableList";
import { db, Prayer, TableNames } from "@/database";
import { reorderByMapArray } from "@/utils/";
import { orderBy } from "lodash";
import { useMemo } from "react";
import { SlotItemMapArray } from "swapy";

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
}

export default function PrayerList({ filterUnpublished = true }: _props) {
  const enableReorder = useMemo(
    () => window.location.pathname.includes("/admin"),
    []
  );

  const filter = useMemo(() => {
    if (!filterUnpublished) return {};

    return {
      where: {
        published: true,
      },
    };
  }, [filterUnpublished]);

  const { data, isLoading } = db.useQuery({
    [PRAYERS]: {
      $: filter,
    },
  });

  const prayers = (data?.[PRAYERS] ?? []) as Prayer[];

  const orderedPrayers = orderBy(prayers, "order");
  if (isLoading) return <span />;

  const blocks = orderedPrayers.map((i) => {
    return {
      id: i.id,
      component: <PrayerListItem prayer={i} />,
    };
  });

  const handleOnReorder = async (mapArray: SlotItemMapArray) => {
    await reorderByMapArray(mapArray, PRAYERS, orderedPrayers);
  };

  return (
    <StyledPrayerList>
      <PrayerListItemsWrapper>
        <ReorderableList
          items={blocks}
          onReorder={handleOnReorder}
          enabled={enableReorder}
        />
      </PrayerListItemsWrapper>
    </StyledPrayerList>
  );
}
