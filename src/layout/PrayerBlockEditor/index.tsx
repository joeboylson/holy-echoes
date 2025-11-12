import { db } from "@/database";
import { id } from "@instantdb/react";
import { first } from "lodash";
import { useParams } from "react-router-dom";
import BlockForm from "../BlockForm";
import PrayerControls from "../PrayerControls";
import AddNewButton from "../../components/AddNewButton";
import type { PrayerBlock } from "@schema";

export default function PrayerBlockEditor() {
  const { prayerId } = useParams();

  const { data: prayersData, isLoading } = db.useQuery(
    prayerId
      ? {
          prayers: {
            categories: {
              $: {
                order: {
                  order: "asc",
                },
              },
            },
            prayerBlocks: {
              blockType: {
                $: {
                  order: {
                    order: "asc",
                  },
                },
              },
              litanyBlocks: {
                $: {
                  order: {
                    order: "asc",
                  },
                },
              },
              file: {},
            },
            $: {
              where: { id: prayerId },
              order: {
                order: "asc",
              },
            },
          },
        }
      : null
  );

  const { data: blockTypesData } = db.useQuery({
    blockTypes: {
      $: {
        order: {
          order: "asc",
        },
      },
    },
  });

  const prayers = prayersData?.prayers;
  const prayer = first(prayers);
  const prayerBlocks = prayer?.prayerBlocks ?? [];

  async function addNewPrayerBlock() {
    const order = prayerBlocks?.length ?? 0;
    const spaceAbove = order !== 0;
    const newPrayerBlock: Partial<PrayerBlock> = { order, spaceAbove };
    const link = { prayer: prayerId };

    await db.transact([
      db.tx.prayerBlocks[id()].update({ ...newPrayerBlock }).link({ ...link }),
    ]);
  }

  if (isLoading) return <span />;

  return (
    <div className="grid grid-cols-1 gap-9 items-start overflow-y-scroll pr-3 pb-[100px]">
      <PrayerControls prayer={prayer} key={prayer?.id ?? "new"} />

      {prayer && (
        <>
          <div className="grid grid-cols-1 gap-3 items-start pl-6" key={prayer?.id ?? "new"}>
            {prayerBlocks.map((prayerBlock) => {
              return (
                <BlockForm
                  key={prayerBlock.id}
                  prayerBlock={prayerBlock}
                  allPrayerBlocks={prayerBlocks}
                  blockTypes={blockTypesData?.blockTypes ?? []}
                />
              );
            })}
          </div>

          <AddNewButton onClick={addNewPrayerBlock} itemName="Block" />
        </>
      )}
    </div>
  );
}
