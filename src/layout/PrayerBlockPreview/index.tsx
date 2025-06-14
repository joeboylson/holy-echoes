import "@mdxeditor/editor/style.css";
import Block from "../../components/Block";
import ReorderableList from "../ReorderableList";
import { orderBy } from "lodash";
import { Prayer, PrayerBlock, TableNames } from "../../database";
import { useParams } from "react-router-dom";
import { StyledPrayerBlockPreview } from "./StyledComponents";
import { Reorderable, reorderReorderable } from "@/utils";
import { useMemo } from "react";
import usePrayer from "@/hooks/usePrayer";

const { PRAYERBLOCKS } = TableNames;

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

  const { prayer: queryPrayer, prayerLoading } = usePrayer(
    prayerId,
    !!existingPrayer
  );
  const prayer = existingPrayer ?? queryPrayer;

  const prayerBlocks = prayer?.prayerBlocks as PrayerBlock[];
  const orderedPrayerBlocks = orderBy(prayerBlocks, "order");

  const handleOnReorder = async (items: Reorderable[]) => {
    await reorderReorderable(items, PRAYERBLOCKS);
  };

  if (!prayer?.published && filterUnpublished) {
    return <p>This page is under construction.</p>;
  }

  if (prayerLoading) return <p>loading...</p>;

  return (
    <StyledPrayerBlockPreview data-id="StyledPrayerBlockPreview" key={prayerId}>
      <ReorderableList
        items={orderedPrayerBlocks}
        onReorder={handleOnReorder}
        enabled={enableReorder}
        renderItem={(item) => <Block data-id="Block" prayerBlock={item} />}
      />
    </StyledPrayerBlockPreview>
  );
}
