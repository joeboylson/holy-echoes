import AddNewButton from "../AddNewButton";
// import LitanyRow from "./LitanyRow";
import ReorderableList from "@/layout/ReorderableList";
import { useCallback, useMemo } from "react";
import { first, orderBy } from "lodash";
import { db, LitanyBlock, PrayerBlock, TableNames } from "../../database";
import { id } from "@instantdb/react";
import { Reorderable } from "../../utils";
import {
  LitanyRowWrapper,
  RowHeader,
  StyledLitanyRow,
} from "./StyledComponents";
import LitanyRow from "./LitanyRow";

const { PRAYERBLOCKS, LITANYBLOCKS } = TableNames;

interface _props {
  prayerBlockId?: string;
}

export default function LitanyInput({ prayerBlockId }: _props) {
  const enableReorder = useMemo(
    () => window.location.pathname.includes("/admin"),
    []
  );

  const { data } = db.useQuery(
    prayerBlockId
      ? {
          [PRAYERBLOCKS]: {
            [LITANYBLOCKS]: {},
            $: { where: { id: prayerBlockId } },
          },
        }
      : null
  );

  const prayerBlocks = (data?.[PRAYERBLOCKS] ?? []) as PrayerBlock[];
  const litanyBlocks = first(prayerBlocks)?.litanyBlocks as LitanyBlock[];
  const orderedLitanyBlocks = orderBy(litanyBlocks, "order");

  const handleOnReorder = async (items: Reorderable[]) => {
    console.log(items);
  };

  const numberOfItems = orderedLitanyBlocks?.length ?? 0;
  const handleAddNewRow = useCallback(() => {
    if (!prayerBlockId) return;

    const _id = id();
    const order = numberOfItems;

    db.transact([
      db.tx[LITANYBLOCKS][_id]
        .update({ order })
        .link({ prayerBlock: prayerBlockId }),
    ]);
  }, [prayerBlockId, numberOfItems]);

  return (
    <LitanyRowWrapper>
      <StyledLitanyRow className="header">
        <RowHeader>Call</RowHeader>
        <RowHeader>Response</RowHeader>
        <RowHeader>Sup.</RowHeader>
        <RowHeader>Inline?</RowHeader>
      </StyledLitanyRow>

      <ReorderableList
        items={orderedLitanyBlocks}
        onReorder={handleOnReorder}
        enabled={enableReorder}
        renderItem={(item) => <LitanyRow row={item} />}
      />

      <AddNewButton onClick={handleAddNewRow} itemName="Row" />
    </LitanyRowWrapper>
  );
}
