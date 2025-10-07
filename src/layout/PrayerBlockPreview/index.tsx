import "@mdxeditor/editor/style.css";
import Block from "../../components/Block";
import ReorderableList from "../ReorderableList";
import type { Prayer } from "@schema";
import { useParams } from "react-router-dom";
import { StyledPrayerBlockPreview } from "./StyledComponents";
import { Reorderable, reorderReorderable } from "@/utils";
import { useMemo } from "react";
import usePrayer from "@/hooks/usePrayer";
import heIconBlue from "@/assets/he-icon-blue.png";

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
    undefined,
    !!existingPrayer,
    true // skipNextPrevious - admin doesn't need navigation
  );
  const prayer = existingPrayer ?? queryPrayer;

  const handleOnReorder = async (items: Reorderable[]) => {
    await reorderReorderable(items, "prayerBlocks");
  };

  if (!prayer?.published && filterUnpublished) {
    return <p>This page is under construction.</p>;
  }

  if (prayerLoading) return <p>loading...</p>;

  return (
    <StyledPrayerBlockPreview
      data-id="StyledPrayerBlockPreview"
      key={prayerId}
      className="w-full"
    >
      <ReorderableList
        items={prayer?.prayerBlocks ?? []}
        onReorder={handleOnReorder}
        enabled={enableReorder}
        renderItem={(item) => <Block data-id="Block" prayerBlock={item} />}
      />
      <div className="flex justify-center pt-12 pb-12">
        <img src={heIconBlue} alt="Holy Echoes" className="w-[50px] h-[50px] object-contain" />
      </div>
    </StyledPrayerBlockPreview>
  );
}
