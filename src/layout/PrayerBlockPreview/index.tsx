import "@mdxeditor/editor/style.css";
import Block from "../../components/Block";
import ReorderableList from "../ReorderableList";
import { indexOf, nth, orderBy } from "lodash";
import { db, Prayer, PrayerBlock, TableNames } from "../../database";
import { Link, useParams } from "react-router-dom";
import {
  PrayerBlockPagination,
  StyledPrayerBlockPreview,
} from "./StyledComponents";
import { SlotItemMapArray } from "swapy";
import { reorderByMapArray } from "@/utils";
import { useMemo } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

const { PRAYERBLOCKS, PRAYERS } = TableNames;

interface _props {
  filterUnpublished?: boolean;
  withPagination?: boolean;
}

export default function PrayerBlockPreview({
  filterUnpublished = true,
  withPagination = true,
}: _props) {
  const { prayerId } = useParams();

  const enableReorder = useMemo(
    () => window.location.pathname.includes("/admin"),
    []
  );

  const { data, isLoading } = db.useQuery(
    prayerId
      ? {
          [PRAYERS]: {
            [PRAYERBLOCKS]: { blockType: {}, litanyBlocks: {} },
          },
        }
      : null
  );

  const prayers = (data?.[PRAYERS] ?? []) as Prayer[];

  const prayer = prayers.find((i) => i.id === prayerId);
  const prayerIndex = indexOf(prayers, prayer);
  const prevPrayer = nth(prayers, prayerIndex - 1);
  const nextPrayer = nth(prayers, prayerIndex + 1);

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
    <StyledPrayerBlockPreview
      className={withPagination ? "with-pagination" : ""}
    >
      <ReorderableList
        items={blocks}
        onReorder={handleOnReorder}
        enabled={enableReorder}
      />

      {withPagination && (
        <PrayerBlockPagination>
          <Link to={`/prayer/${prevPrayer?.id}`}>
            <CaretLeft size={24} color="var(--blue-10)" weight="bold" />
          </Link>
          <Link to={`/prayer/${nextPrayer?.id}`}>
            <CaretRight size={24} color="var(--blue-10)" weight="bold" />
          </Link>
        </PrayerBlockPagination>
      )}
    </StyledPrayerBlockPreview>
  );
}
