import { JSX, useEffect, useMemo, useRef, useState } from "react";
import { createSwapy, SlotItemMapArray, Swapy, utils } from "swapy";
import { StyledReorderableContainer } from "./StyledComponents";
import { DotsSix } from "@phosphor-icons/react";

interface ListItem {
  id?: string;
  component: JSX.Element;
}

interface _props {
  items: ListItem[];
  onReorder: (mapArray: SlotItemMapArray) => Promise<void>;
  enabled?: boolean;
  itemClass?: string;
}

export default function ReorderableList({
  items,
  onReorder,
  enabled = false,
  itemClass = "",
}: _props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [slotItemMap, setSlotItemMap] = useState<SlotItemMapArray>(
    utils.initSlotItemMap(items, "id")
  );

  const slottedItems = useMemo(
    () => utils.toSlottedItems(items, "id", slotItemMap),
    [items, slotItemMap]
  );

  const swapyRef = useRef<Swapy | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(
    () =>
      utils.dynamicSwapy(
        swapyRef.current,
        items,
        "id",
        slotItemMap,
        setSlotItemMap
      ),
    [items]
  );

  useEffect(() => {
    if (isLoading) return;
    swapyRef.current = createSwapy(containerRef.current!, {
      manualSwap: true,
      animation: "none",
      autoScrollOnDrag: true,
      swapMode: "drop",
      enabled,
      dragAxis: "y",
      // dragOnHold: true,
    });

    swapyRef.current.onSwap((event) => {
      setSlotItemMap(event.newSlotItemMap.asArray);
      setIsLoading(true);

      onReorder(event.newSlotItemMap.asArray).finally(() => {
        setIsLoading(false);
      });
    });

    return () => {
      swapyRef.current?.destroy();
    };
  }, [isLoading]);

  const containerClassName = ["container", isLoading ? "disabled" : ""].join(
    " "
  );

  const itemClassName = [
    "item",
    itemClass,
    isLoading || !enabled ? "disabled" : "",
  ].join(" ");

  return (
    <StyledReorderableContainer
      key="list"
      className={containerClassName}
      ref={containerRef}
      data-id="ReorderableList"
    >
      <div className="items">
        {slottedItems.map(({ slotId, itemId, item }) => (
          <div className="slot" key={slotId} data-swapy-slot={slotId}>
            <div
              className={itemClassName}
              data-swapy-item={itemId}
              key={itemId}
            >
              {item?.component}
              {enabled && (
                <div data-swapy-handle>
                  <DotsSix size={20} weight="bold" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </StyledReorderableContainer>
  );
}
