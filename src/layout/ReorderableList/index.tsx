import clsx from "clsx";
import { JSX, useEffect, useState } from "react";
import { DotsSix } from "@phosphor-icons/react";

interface _props<T extends { id?: string; order: number }> {
  items: T[];
  onReorder: (items: T[]) => Promise<void>;
  renderItem: (item: T) => JSX.Element;
  enabled?: boolean;
  itemClass?: string;
}

export default function ReorderableList<T extends { id?: string; order: number }>({
  items: initialItems,
  onReorder,
  renderItem,
  enabled = false,
  itemClass = "",
}: _props<T>) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [items, setItems] = useState(initialItems);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  useEffect(() => setItems(initialItems), [initialItems]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    if (index !== hoverIndex) {
      setHoverIndex(index);
    }
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null) return;

    const updated = [...items];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, movedItem);

    setItems(updated);
    setDraggedIndex(null);
    setHoverIndex(null);
    setIsLoading(true);
    onReorder(updated).finally(() => setIsLoading(false));
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setHoverIndex(null);
  };

  return (
    <div
      key="list"
      className={clsx("overflow-y-auto", {
        "opacity-50 pointer-events-none": isLoading,
      })}
      data-id="ReorderableList"
    >
      {items.map((item, index) => {
        return (
          <div
            key={item.id}
            draggable={enabled}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(index, e)}
            onDrop={() => handleDrop(index)}
            onDragEnd={handleDragEnd}
            className={clsx(
              "relative grid grid-cols-[1fr_24px] items-center overflow-visible",
              "after:content-[''] after:block after:absolute after:top-[calc(50%-12px)] after:left-3 after:w-6 after:h-6 after:bg-red-500/75 after:rounded-xl after:hidden",
              itemClass,
              {
                "grid-cols-[1fr_24px]": isLoading || !enabled,
                "after:block": index === hoverIndex,
                "opacity-10 cursor-ns-resize after:opacity-0": index === draggedIndex,
              }
            )}
          >
            <>{renderItem(item)}</>
            {enabled && (
              <span>
                <DotsSix size={20} weight="bold" />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
