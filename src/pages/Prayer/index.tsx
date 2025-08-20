import PrayerBlockPreview from "@/layout/PrayerBlockPreview";
import usePrayer from "@/hooks/usePrayer";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useStatusBar } from "@/contexts/StatusBarContext";
import LoggedInUserWrapper from "@/layout/LoggedInUserWrapper";
import NavigationHeader from "@/components/NavigationHeader";

export default function Prayer() {
  const { prayerId, categoryId } = useParams();
  const navigate = useNavigate();
  const { prayer, prevNextPrayers, prayerLoading } = usePrayer(
    prayerId,
    categoryId
  );

  const { setStatusBarColor } = useStatusBar();
  useEffect(() => {
    setStatusBarColor("#0082cb");
  }, [setStatusBarColor]);

  const prevPrayer = prevNextPrayers.find(
    (p) => (p?.order ?? 0) < (prayer?.order ?? 0)
  );

  const nextPrayer = prevNextPrayers.find(
    (p) => (p?.order ?? 0) > (prayer?.order ?? 0)
  );

  const handlePrevious = useMemo(() => {
    if (!prevPrayer?.id || !categoryId) return undefined;
    return () => navigate(`/category/${categoryId}/prayer/${prevPrayer.id}`);
  }, [prevPrayer, categoryId, navigate]);

  const handleNext = useMemo(() => {
    if (!nextPrayer?.id || !categoryId) return undefined;
    return () => navigate(`/category/${categoryId}/prayer/${nextPrayer.id}`);
  }, [nextPrayer, categoryId, navigate]);

  if (prayerLoading) return <p>Loading...</p>;

  return (
    <LoggedInUserWrapper>
      <div className="w-screen h-screen grid grid-cols-1 mx-auto content-start justify-items-start overflow-y-scroll">
        <NavigationHeader
          onPrevious={handlePrevious}
          onNext={handleNext}
          backTo={categoryId ? `/category/${categoryId}` : "/home"}
        />

        {prayerId && (
          <PrayerBlockPreview existingPrayer={prayer} key={prayerId} />
        )}
      </div>
    </LoggedInUserWrapper>
  );
}
