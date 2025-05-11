import clsx from "clsx";
import { JSX, useState } from "react";
import { GripVertical } from "lucide-react";
import { Reorderable } from "@/utils";
import { DotsSix } from "@phosphor-icons/react";

import {
  ReorderableItem,
  StyledReorderableContainer,
} from "./StyledComponents";

interface _props {
  items: Reorderable[];
  onReorder: (items: Reorderable[]) => Promise<void>;
  renderItem: (item: Reorderable) => JSX.Element;
  enabled?: boolean;
  itemClass?: string;
}

export default function ReorderableList({
  items: initialItems,
  onReorder,
  renderItem,
  enabled = false,
  itemClass = "",
}: _props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [items, setItems] = useState(initialItems);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

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
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setHoverIndex(null);
  };

  return (
    <StyledReorderableContainer
      key="list"
      className={clsx({
        "is-disabled": isLoading,
      })}
      data-id="ReorderableList"
    >
      {items.map((item, index) => {
        return (
          <ReorderableItem
            key={item.id}
            draggable={enabled}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(index, e)}
            onDrop={() => handleDrop(index)}
            onDragEnd={handleDragEnd}
            className={clsx(itemClass, {
              "is-disabled": isLoading || !enabled,
              "is-hovered-over": index === hoverIndex,
              "is-dragged": index === draggedIndex,
            })}
          >
            <p>{renderItem(item)}</p>
            <span>
              <DotsSix size={20} weight="bold" />
            </span>
          </ReorderableItem>
        );
      })}
    </StyledReorderableContainer>
  );
}
