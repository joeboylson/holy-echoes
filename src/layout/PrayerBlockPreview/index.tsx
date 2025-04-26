import "@mdxeditor/editor/style.css";
import Block from "../../components/Block";
import ReorderableList from "../ReorderableList";
import { orderBy } from "lodash";
import { db, Prayer, PrayerBlock, TableNames } from "../../database";
import { useParams } from "react-router-dom";
import { StyledPrayerBlockPreview } from "./StyledComponents";
import { SlotItemMapArray } from "swapy";
import { reorderByMapArray } from "@/utils";
import { useMemo } from "react";

const { PRAYERBLOCKS, PRAYERS } = TableNames;

interface _props {
  filterUnpublished?: boolean;
  existingPrayer?: Prayer;
}

export default function PrayerBlockPreview({
  filterUnpublished = true,
  existingPrayer,
}: _props) {
  const { prayerId } = useParams();

  const enableReorder = useMemo(
    () => window.location.pathname.includes("/admin"),
    []
  );

  const { data, isLoading } = db.useQuery(
    prayerId && !existingPrayer
      ? {
          [PRAYERS]: {
            [PRAYERBLOCKS]: { blockType: {}, litanyBlocks: {} },
          },
        }
      : null
  );

  const prayers = (data?.[PRAYERS] ?? []) as Prayer[];
  const prayer = existingPrayer ?? prayers.find((i) => i.id === prayerId);

  const prayerBlocks = prayer?.prayerBlocks as PrayerBlock[];
  const orderedPrayerBlocks = orderBy(prayerBlocks, "order");

  if (!prayer?.published && filterUnpublished) {
    return <p>This page is under construction.</p>;
  }

  if (isLoading) return <span />;

  const blocks = orderedPrayerBlocks.map((i) => {
    return {
      id: i.id,
      component: <Block prayerBlock={i} />,
    };
  });

  const handleOnReorder = async (mapArray: SlotItemMapArray) => {
    await reorderByMapArray(mapArray, PRAYERBLOCKS, orderedPrayerBlocks);
  };

  return (
    <StyledPrayerBlockPreview data-id="StyledPrayerBlockPreview">
      <ReorderableList
        items={blocks}
        onReorder={handleOnReorder}
        enabled={enableReorder}
      />
    </StyledPrayerBlockPreview>
  );
}
