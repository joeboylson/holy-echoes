import "./index.css";
import "@mdxeditor/editor/style.css";
import BlockForm from "./blockForm";
import { RowsPlusBottom } from "@phosphor-icons/react";
import { db, PrayerBlock, TableNames } from "../../database";
import { id } from "@instantdb/react";
import { orderBy } from "lodash";

const { PRAYERBLOCKS } = TableNames;

export default function PrayerBlockEditor() {
  const result = db.useQuery({
    [PRAYERBLOCKS]: { blockType: {} },
  });

  const prayerBlocks = (result?.data?.[PRAYERBLOCKS] ?? []) as PrayerBlock[];

  async function addNewPrayerBlock() {
    const newPrayerBlock: PrayerBlock = {
      order: prayerBlocks.length,
    };

    await db.transact([
      db.tx[PRAYERBLOCKS][id()].update({ ...newPrayerBlock }),
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
