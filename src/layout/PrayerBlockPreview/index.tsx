import "@mdxeditor/editor/style.css";
import { first, orderBy } from "lodash";
import { db, Prayer, PrayerBlock, TableNames } from "../../database";
import { useParams } from "react-router-dom";
import {
  PrayerBlocksWrapper,
  StyledPrayerBlockPreview,
} from "./StyledComponents";
import Block from "../../components/Block";

const { PRAYERBLOCKS, PRAYERS } = TableNames;

interface _props {
  filterUnpublished?: boolean;
}

export default function PrayerBlockPreview({
  filterUnpublished = true,
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

  return (
    <StyledPrayerBlockPreview>
      <PrayerBlocksWrapper>
        {orderedPrayerBlocks &&
          orderedPrayerBlocks.map((prayerBlock) => {
            return <Block prayerBlock={prayerBlock} />;
          })}
      </PrayerBlocksWrapper>
    </StyledPrayerBlockPreview>
  );
}
