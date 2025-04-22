import "@mdxeditor/editor/style.css";
import Block from "../../components/Block";
import ReorderableList from "../ReorderableList";
import { first, orderBy } from "lodash";
import { db, Prayer, PrayerBlock, TableNames } from "../../database";
import { useParams } from "react-router-dom";
import { StyledPrayerBlockPreview } from "./StyledComponents";
import { SlotItemMapArray } from "swapy";
import { reorderByMapArray } from "@/utils";

const { PRAYERBLOCKS, PRAYERS } = TableNames;

interface _props {
  filterUnpublished?: boolean;
  enableReordering?: boolean;
}

export default function PrayerBlockPreview({
  filterUnpublished = true,
  enableReordering = false,
}: _props) {
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
    <StyledPrayerBlockPreview key={new Date().valueOf()}>
      <ReorderableList
        items={blocks}
        onReorder={handleOnReorder}
        enabled={enableReordering}
      />
    </StyledPrayerBlockPreview>
  );
}
