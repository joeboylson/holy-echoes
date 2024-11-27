import "./index.css";
import "@mdxeditor/editor/style.css";
import BlockForm from "./blockForm";
import { RowsPlusBottom } from "@phosphor-icons/react";
import { db, Prayer, PrayerBlock, TableNames } from "../../database";
import { id } from "@instantdb/react";
import { first, orderBy } from "lodash";
import { useParams } from "react-router-dom";

const { PRAYERBLOCKS, PRAYERS } = TableNames;

export default function PrayerBlockEditor() {
  const { prayerId } = useParams();

  const result = db.useQuery(
    prayerId
      ? {
          [PRAYERS]: {
            [PRAYERBLOCKS]: { blockType: {}, litanyBlocks: {} },
            $: { where: { id: prayerId } },
          },
        }
      : null
  );

  const prayers = (result.data?.[PRAYERS] ?? []) as Prayer[];
  const prayerBlocks = first(prayers)?.prayerBlocks as PrayerBlock[];

  async function addNewPrayerBlock() {
    const newPrayerBlock: PrayerBlock = { order: prayerBlocks.length };
    const link = { prayer: prayerId };

    await db.transact([
      db.tx[PRAYERBLOCKS][id()].update({ ...newPrayerBlock }).link({ ...link }),
    ]);
  }

  const orderedPrayerBlocks = orderBy(prayerBlocks, "order");

  return (
    <>
      <div id="layout-prayerblockeditor">
        <div id="layout-prayerblockeditor-controls">
          <button onClick={addNewPrayerBlock}>
            <RowsPlusBottom size={20} color="#000000" weight="duotone" />
          </button>
        </div>

        {orderedPrayerBlocks.map((prayerBlock) => {
          return (
            <BlockForm
              key={prayerBlock.id}
              prayerBlock={prayerBlock}
              allPrayerBlocks={orderedPrayerBlocks}
            />
          );
        })}
      </div>
    </>
  );
}
