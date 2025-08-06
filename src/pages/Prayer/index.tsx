import PrayerBlockPreview from "@/layout/PrayerBlockPreview";
import usePrayer from "@/hooks/usePrayer";
import { Link, useParams } from "react-router-dom";
import { Pages } from "@/layout/App/router";
import { ArrowLeft, CaretLeft, CaretRight } from "@phosphor-icons/react";
import {
  BackLink,
  PrayerBlockPagination,
  PrayerHeader,
  StyledPrayer,
} from "./StyledComponents";
import { useEffect } from "react";
import { useStatusBar } from "@/contexts/StatusBarContext";

export default function Prayer() {
  const { prayerId } = useParams();
  const { prayer, prevNextPrayers, prayerLoading } = usePrayer(prayerId);

  const { setStatusBarColor } = useStatusBar();
  useEffect(() => {
    setStatusBarColor("#0082cb");
  }, []);

  const prevPrayer = prevNextPrayers.find(
    (p) => (p?.order ?? 0) < (prayer?.order ?? 0)
  );

  const nextPrayer = prevNextPrayers.find(
    (p) => (p?.order ?? 0) > (prayer?.order ?? 0)
  );

  if (prayerLoading) return <p>Loading...</p>;

  return (
    <StyledPrayer data-id="StyledPrayer">
      <PrayerHeader data-id="PrayerHeader">
        <BackLink to={Pages.HOME}>
          <ArrowLeft /> Back
        </BackLink>

        <PrayerBlockPagination>
          {prevPrayer ? (
            <Link to={`/prayer/${prevPrayer?.id}`}>
              <CaretLeft size={24} weight="bold" color="#FFFFFF" />
            </Link>
          ) : (
            <span />
          )}

          {nextPrayer ? (
            <Link to={`/prayer/${nextPrayer?.id}`}>
              <CaretRight size={24} weight="bold" color="#FFFFFF" />
            </Link>
          ) : (
            <span />
          )}
        </PrayerBlockPagination>
      </PrayerHeader>

      {prayerId && (
        <PrayerBlockPreview existingPrayer={prayer} key={prayerId} />
      )}
    </StyledPrayer>
  );
}
