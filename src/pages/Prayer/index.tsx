import PrayerBlockPreview from "@/layout/PrayerBlockPreview";
import { Link, useParams } from "react-router-dom";
import { Pages } from "@/layout/App";
import { ArrowLeft, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { db, TableNames, Prayer as PrayerType } from "@/database";
import { indexOf, nth } from "lodash";
import {
  BackLink,
  PrayerBlockPagination,
  PrayerHeader,
  StyledPrayer,
} from "./StyledComponents";

const { PRAYERBLOCKS, PRAYERS } = TableNames;

export default function Prayer() {
  const { prayerId } = useParams();

  const { data, isLoading } = db.useQuery(
    prayerId
      ? {
          [PRAYERS]: {
            [PRAYERBLOCKS]: { blockType: {}, litanyBlocks: {} },
          },
        }
      : null
  );

  const prayers = (data?.[PRAYERS] ?? []) as PrayerType[];

  const prayer = prayers.find((i) => i.id === prayerId);
  const prayerIndex = indexOf(prayers, prayer);
  const prevPrayer = nth(prayers, prayerIndex - 1);
  const nextPrayer = nth(prayers, prayerIndex + 1);

  if (isLoading) return <span />;

  return (
    <StyledPrayer data-id="StyledPrayer">
      <PrayerHeader data-id="PrayerHeader">
        <BackLink to={Pages.HOME}>
          <ArrowLeft /> Back
        </BackLink>

        <PrayerBlockPagination>
          <Link to={`/prayer/${prevPrayer?.id}`}>
            <CaretLeft size={24} weight="bold" />
          </Link>
          <Link to={`/prayer/${nextPrayer?.id}`}>
            <CaretRight size={24} weight="bold" />
          </Link>
        </PrayerBlockPagination>
      </PrayerHeader>

      {prayerId && <PrayerBlockPreview />}
    </StyledPrayer>
  );
}
