import PrayerListItem from "./PrayerListItem";
import ReorderableList from "@/layout/ReorderableList";
import { Reorderable, reorderReorderable } from "@/utils/";
import { useMemo } from "react";
import usePrayers from "@/hooks/usePrayers";
import { Category } from "@schema";

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
    <div className="grid grid-cols-1 content-start gap-3 pb-[20vh]">
      <div className="w-full grid grid-cols-1 content-start gap-1 [&_.item]:border-b [&_.item]:border-gray-300">
        <ReorderableList
          items={orderedPrayers}
          onReorder={handleOnReorder}
          enabled={enableReorder}
          renderItem={(item) => <PrayerListItem prayer={item} />}
        />
      </div>
    </div>
  );
}
