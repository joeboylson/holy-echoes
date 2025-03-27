import { db, Prayer, PrayerBlock, TableNames } from "../../database";
import { id } from "@instantdb/react";
import { first, orderBy } from "lodash";
import { useParams } from "react-router-dom";
import PrayerControls from "../PrayerControls";
import BlockForm from "../BlockForm";
import { BlocksWrapper, StyledPrayerBlockEditor } from "./StyledComponents";
import AddNewButton from "../../components/AddNewButton";

const { PRAYERBLOCKS, PRAYERS } = TableNames;

export default function PrayerBlockEditor() {
  const { prayerId } = useParams();

  const { data, isLoading } = db.useQuery(
    prayerId
      ? {
          [PRAYERS]: {
            [PRAYERBLOCKS]: { blockType: {}, litanyBlocks: {} },
            $: { where: { id: prayerId } },
          },
        }
      : {}
  );

  const prayers = (data?.[PRAYERS] ?? []) as Prayer[];
  const prayer = first(prayers);
  const prayerBlocks = prayer?.prayerBlocks as PrayerBlock[];

  async function addNewPrayerBlock() {
    const order = prayerBlocks?.length ?? 0;
    const spaceAbove = order !== 0;
    const newPrayerBlock: PrayerBlock = { order, spaceAbove };
    const link = { prayer: prayerId };

    await db.transact([
      db.tx[PRAYERBLOCKS][id()].update({ ...newPrayerBlock }).link({ ...link }),
    ]);
  }

  const orderedPrayerBlocks = orderBy(prayerBlocks, "order");

  if (isLoading) return <span />;

  return (
    <StyledPrayerBlockEditor>
      <PrayerControls prayer={prayer} key={prayer?.id ?? "new"} />

      {prayer && (
        <>
          <BlocksWrapper>
            {orderedPrayerBlocks.map((prayerBlock) => {
              return (
                <BlockForm
                  key={prayerBlock.id}
                  prayerBlock={prayerBlock}
                  allPrayerBlocks={orderedPrayerBlocks}
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
