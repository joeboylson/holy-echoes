import { db } from "@/database";
import type { PrayerBlock } from "@schema";
import { id } from "@instantdb/react";
import { first, orderBy } from "lodash";
import { useParams } from "react-router-dom";
import PrayerControls from "../PrayerControls";
import BlockForm from "../BlockForm";
import { BlocksWrapper, StyledPrayerBlockEditor } from "./StyledComponents";
import AddNewButton from "../../components/AddNewButton";
import { useMemo } from "react";

export default function PrayerBlockEditor() {
  const { prayerId } = useParams();

  const { data: prayersData, isLoading } = db.useQuery(
    prayerId
      ? {
          prayers: {
            categories: {},
            prayerBlocks: { blockType: {}, litanyBlocks: {}, file: {} },
            $: { where: { id: prayerId } },
          },
        }
      : null
  );

  const { data: blockTypesData } = db.useQuery({ blockTypes: {} });

  const blockTypes = useMemo(
    () => blockTypesData?.blockTypes ?? [],
    [blockTypesData]
  );

  const prayers = prayersData?.prayers ?? [];
  const prayer = first(prayers);
  const prayerBlocks = prayer?.prayerBlocks as PrayerBlock[];

  async function addNewPrayerBlock() {
    const order = prayerBlocks?.length ?? 0;
    const spaceAbove = order !== 0;
    const newPrayerBlock: Partial<PrayerBlock> = { order, spaceAbove };
    const link = { prayer: prayerId };

    await db.transact([
      db.tx.prayerBlocks[id()].update({ ...newPrayerBlock }).link({ ...link }),
    ]);
  }

  const orderedPrayerBlocks = orderBy(prayerBlocks, "order");
  const orderedBlockTypes = orderBy(blockTypes, "order");

  if (isLoading) return <span />;

  return (
    <StyledPrayerBlockEditor>
      <PrayerControls prayer={prayer} key={prayer?.id ?? "new"} />

      {prayer && (
        <>
          <BlocksWrapper key={prayer?.id ?? "new"}>
            {orderedPrayerBlocks.map((prayerBlock) => {
              return (
                <BlockForm
                  key={prayerBlock.id}
                  prayerBlock={prayerBlock}
                  allPrayerBlocks={orderedPrayerBlocks}
                  blockTypes={orderedBlockTypes}
                />
              );
            })}
          </BlocksWrapper>

          <AddNewButton onClick={addNewPrayerBlock} itemName="Block" />
        </>
      )}
    </StyledPrayerBlockEditor>
  );
}
