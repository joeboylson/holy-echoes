import AddNewButton from "../AddNewButton";
import TwoColumnRow from "./TwoColumnRow";
import ReorderableList from "@/layout/ReorderableList";
import { useCallback, useMemo } from "react";
import { first } from "lodash";
import { db } from "@/database";
import { id } from "@instantdb/react";
import { Reorderable, reorderReorderable } from "../../utils";

interface _props {
  prayerBlockId?: string;
}

export default function TwoColumnInput({ prayerBlockId }: _props) {
  const enableReorder = useMemo(
    () => window.location.pathname.includes("/admin"),
    []
  );

  const { data } = db.useQuery(
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
            $: { where: { id: prayerBlockId } },
          },
        }
      : null
  );

  const prayerBlocks = data?.prayerBlocks ?? [];
  const litanyBlocks = first(prayerBlocks)?.litanyBlocks ?? [];

  const handleOnReorder = async (items: Reorderable[]) => {
    await reorderReorderable(items, "prayerBlocks");
  };

  const numberOfItems = litanyBlocks?.length;
  const handleAddNewRow = useCallback(() => {
    if (!prayerBlockId) return;

    const _id = id();
    const order = numberOfItems;

    db.transact([
      db.tx.litanyBlocks[_id]
        .update({ order })
        .link({ prayerBlock: prayerBlockId }),
    ]);
  }, [prayerBlockId, numberOfItems]);

  return (
    <div className="grid grid-cols-1 gap-2 pt-3">
      <div className="grid grid-cols-[1fr_1fr_36px] gap-1 items-center justify-items-center pr-8">
        <p className="text-center">Left</p>
        <p className="text-center">Right</p>
      </div>

      <ReorderableList
        items={litanyBlocks}
        onReorder={handleOnReorder}
        enabled={enableReorder}
        renderItem={(item) => <TwoColumnRow row={item} />}
      />

      <AddNewButton onClick={handleAddNewRow} itemName="Row" />
    </div>
  );
}
