import { db, Prayer, PrayerBlock, TableNames } from "../../database";
import { id } from "@instantdb/react";
import { first, orderBy } from "lodash";
import { Navigate, useParams } from "react-router-dom";
import { Pages } from "../App";
import PrayerControls from "../PrayerControls";
import { BlocksWrapper, StyledPrayerBlockEditor } from "./StyledComponents";
import AddNewButton from "../../components/AddNewButton";
import BlockForm from "./BlockForm";

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
      : null
  );

  const prayers = (data?.[PRAYERS] ?? []) as Prayer[];
  const prayer = first(prayers);
  const prayerBlocks = prayer?.prayerBlocks as PrayerBlock[];

  async function addNewPrayerBlock() {
    const newPrayerBlock: PrayerBlock = { order: prayerBlocks?.length ?? 0 };
    const link = { prayer: prayerId };

    await db.transact([
      db.tx[PRAYERBLOCKS][id()].update({ ...newPrayerBlock }).link({ ...link }),
    ]);
  }

  const orderedPrayerBlocks = orderBy(prayerBlocks, "order");

  if (!isLoading && !prayer) {
    return <Navigate to={Pages.ADMIN} />;
  }

  if (isLoading) return <span />;

  return (
    <StyledPrayerBlockEditor>
      {prayer && (
        <PrayerControls prayer={prayer} allPrayers={prayers} key={prayer.id} />
      )}

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
    </StyledPrayerBlockEditor>
  );
}
