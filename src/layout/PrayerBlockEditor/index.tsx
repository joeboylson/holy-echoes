import { db } from "@/database";
import { id } from "@instantdb/react";
import { first } from "lodash";
import { useParams } from "react-router-dom";
import { BlocksWrapper, StyledPrayerBlockEditor } from "./StyledComponents";
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
    <StyledPrayerBlockEditor>
      <PrayerControls prayer={prayer} key={prayer?.id ?? "new"} />

      {prayer && (
        <>
          <BlocksWrapper key={prayer?.id ?? "new"}>
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
          </BlocksWrapper>

          <AddNewButton onClick={addNewPrayerBlock} itemName="Block" />
        </>
      )}
    </StyledPrayerBlockEditor>
  );
}
