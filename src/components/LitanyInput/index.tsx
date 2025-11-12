import AddNewButton from "@/components/AddNewButton";
import ReorderableList from "@/layout/ReorderableList";
import { useCallback, useMemo, useState } from "react";
import { first } from "lodash";
import { db } from "@/database";
import { id } from "@instantdb/react";
import { Reorderable, reorderReorderable } from "@/utils";
import LitanyRow from "./LitanyRow";
import clsx from "clsx";

interface _props {
  prayerBlockId?: string;
}

export default function LitanyInput({ prayerBlockId }: _props) {
  const [addRowLoading, setAddRowLoading] = useState<boolean>(false);

  const enableReorder = useMemo(
    () => window.location.pathname.includes("/admin"),
    []
  );

  const { data, isLoading } = db.useQuery(
    prayerBlockId
      ? {
          prayerBlocks: {
            litanyBlocks: {
              $: {
                order: {
                  order: "asc",
                },
              },
            },
            $: { where: { id: prayerBlockId }, order: { order: "asc" } },
          },
        }
      : null
  );

  const prayerBlocks = data?.prayerBlocks;
  const litanyBlocks = first(prayerBlocks)?.litanyBlocks;

  const handleOnReorder = async (items: Reorderable[]) => {
    await reorderReorderable(items, "litanyBlocks");
  };

  const numberOfItems = litanyBlocks?.length ?? 0;
  const handleAddNewRow = useCallback(async () => {
    if (!prayerBlockId) return;

    const _id = id();
    const order = numberOfItems;

    setAddRowLoading(true);
    await db
      .transact([
        db.tx.litanyBlocks[_id]
          .update({ order })
          .link({ prayerBlock: prayerBlockId }),
      ])
      .finally(() => setAddRowLoading(false));
  }, [prayerBlockId, numberOfItems]);

  if (isLoading) return <span />;

  return (
    <div
      key={prayerBlockId}
      className={clsx("grid grid-cols-1 gap-2 pt-3", {
        "opacity-25 pointer-events-none": addRowLoading,
      })}
    >
      <div className="grid grid-cols-[3fr_3fr_1fr_1fr_36px] gap-1 items-center justify-items-center pr-8">
        <p className="text-center">Call</p>
        <p className="text-center">Response</p>
        <p className="text-center">Super</p>
        <p className="text-center">Inline?</p>
      </div>

      <ReorderableList
        items={litanyBlocks ?? []}
        onReorder={handleOnReorder}
        enabled={enableReorder}
        renderItem={(item) => <LitanyRow row={item} />}
      />

      <AddNewButton onClick={handleAddNewRow} itemName="Row" />
    </div>
  );
}
