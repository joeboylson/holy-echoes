import styled from "styled-components";
import PrayerListItem from "./PrayerListItem";
import ReorderableList from "@/layout/ReorderableList";
import { Reorderable, reorderReorderable } from "@/utils/";
import { useMemo } from "react";
import usePrayers from "@/hooks/usePrayers";
import { Category } from "@schema";

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
    border-bottom: 1px solid var(--color-border);
  }
`;

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

  const { prayers: orderedPrayers, isLoading } = usePrayers({
    filterUnpublished,
    filterByCategoryId: filterByCategory?.id,
  });

  const handleOnReorder = async (items: Reorderable[]) => {
    await reorderReorderable(items, "prayers");
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
