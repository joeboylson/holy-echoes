import AddNewButton from "../AddNewButton";
import TwoColumnRow from "./TwoColumnRow";
import ReorderableList from "@/layout/ReorderableList";
import { useCallback, useMemo } from "react";
import { first } from "lodash";
import { db } from "@/database";
import { id } from "@instantdb/react";
import { Reorderable, reorderReorderable } from "../../utils";
import {
  TwoColumnRowWrapper,
  RowHeader,
  StyledTwoColumnRow,
} from "./StyledComponents";

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
            litanyBlocks: {},
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
    <TwoColumnRowWrapper>
      <StyledTwoColumnRow className="header">
        <RowHeader>Left</RowHeader>
        <RowHeader>Right</RowHeader>
      </StyledTwoColumnRow>

      <ReorderableList
        items={litanyBlocks}
        onReorder={handleOnReorder}
        enabled={enableReorder}
        renderItem={(item) => <TwoColumnRow row={item} />}
      />

      <AddNewButton onClick={handleAddNewRow} itemName="Row" />
    </TwoColumnRowWrapper>
  );
}
