import "./index.css";
import "@mdxeditor/editor/style.css";
import BlockForm from "./blockForm";
import { RowsPlusBottom, TrashSimple } from "@phosphor-icons/react";
import { db, Prayer, PrayerBlock, TableNames } from "../../database";
import { id } from "@instantdb/react";
import { first, orderBy } from "lodash";
import { Navigate, useParams } from "react-router-dom";
import { cascadeDeletePrayer } from "../../utils";
import { Pages } from "../App";

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

  function addNewPrayerBlock() {
    const newPrayerBlock: PrayerBlock = { order: prayerBlocks?.length ?? 0 };
    const link = { prayer: prayerId };

    db.transact([
      db.tx[PRAYERBLOCKS][id()].update({ ...newPrayerBlock }).link({ ...link }),
    ]);
  }

  function deletePrayer() {
    if (prayer) {
      db.transact([db.tx[PRAYERS][prayer?.id ?? ""].delete()]);
      cascadeDeletePrayer(prayer);
    }
  }

  const orderedPrayerBlocks = orderBy(prayerBlocks, "order");

  if (!isLoading && !prayer) {
    return <Navigate to={Pages.ADMIN} />;
  }

  return (
    <>
      <div id="layout-prayerblockeditor">
        <div id="layout-prayerblockeditor-controls">
          <button onClick={addNewPrayerBlock}>
            <RowsPlusBottom size={20} color="#000000" weight="duotone" />
          </button>
          <button onClick={deletePrayer}>
            <TrashSimple size={20} color="#e20303" weight="duotone" />
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
