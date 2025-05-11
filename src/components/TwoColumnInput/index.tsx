import AddNewButton from "../AddNewButton";
import TwoColumnRow from "./TwoColumnRow";
import ReorderableList from "@/layout/ReorderableList";
import { useCallback, useMemo } from "react";
import { first, orderBy } from "lodash";
import { db, LitanyBlock, PrayerBlock, TableNames } from "../../database";
import { id } from "@instantdb/react";
import { Reorderable } from "../../utils";
import {
  TwoColumnRowWrapper,
  RowHeader,
  StyledTwoColumnRow,
} from "./StyledComponents";

const { PRAYERBLOCKS, LITANYBLOCKS } = TableNames;

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

  const blocks = orderedLitanyBlocks.map((i) => {
    return {
      id: i.id,
      component: <TwoColumnRow row={i} />,
    };
  });

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
    <TwoColumnRowWrapper>
      <StyledTwoColumnRow className="header">
        <RowHeader>Left</RowHeader>
        <RowHeader>Right</RowHeader>
      </StyledTwoColumnRow>

      <ReorderableList
        items={orderedLitanyBlocks}
        onReorder={handleOnReorder}
        enabled={enableReorder}
        renderItem={(item) => <TwoColumnRow row={item} />}
      />

      <AddNewButton onClick={handleAddNewRow} itemName="Row" />
    </TwoColumnRowWrapper>
  );
}
