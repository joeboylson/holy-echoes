import PrayerBlockPreview from "@/layout/PrayerBlockPreview";
import usePrayer from "@/hooks/usePrayer";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useStatusBar } from "@/contexts/StatusBarContext";
import { useHeaderColor } from "@/contexts/HeaderColorContext";
import LoggedInUserWrapper from "@/layout/LoggedInUserWrapper";
import NavigationHeader from "@/components/NavigationHeader";
import ScrollablePageLayout from "@/components/ScrollablePageLayout";

export default function Prayer() {
  const { prayerId, categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");
  const navigate = useNavigate();
  const { prayer, prevPrayer, nextPrayer, prayerLoading } = usePrayer(
    prayerId,
    categoryId
  );

  const { setStatusBarColor } = useStatusBar();
  const { headerColor } = useHeaderColor();
  useEffect(() => {
    setStatusBarColor(headerColor);
  }, [setStatusBarColor, headerColor]);

  const handlePrevious = useMemo(() => {
    if (!prevPrayer?.id || !categoryId) return undefined;
    const url = `/category/${categoryId}/prayer/${prevPrayer.id}`;
    const urlWithQuery = searchQuery ? `${url}?q=${encodeURIComponent(searchQuery)}` : url;
    return () => navigate(urlWithQuery);
  }, [prevPrayer, categoryId, searchQuery, navigate]);

  const handleNext = useMemo(() => {
    if (!nextPrayer?.id || !categoryId) return undefined;
    const url = `/category/${categoryId}/prayer/${nextPrayer.id}`;
    const urlWithQuery = searchQuery ? `${url}?q=${encodeURIComponent(searchQuery)}` : url;
    return () => navigate(urlWithQuery);
  }, [nextPrayer, categoryId, searchQuery, navigate]);

  if (prayerLoading) return <p>Loading...</p>;

  return (
    <LoggedInUserWrapper>
      <ScrollablePageLayout
        variant="50"
        header={
          <NavigationHeader
            onPrevious={handlePrevious}
            onNext={handleNext}
            backTo={
              categoryId === "search" && searchQuery
                ? `/search?q=${encodeURIComponent(searchQuery)}`
                : categoryId
                ? `/category/${categoryId}`
                : "/home"
            }
            prayerId={prayerId ?? ""}
          />
        }
      >
        {prayerId && (
          <div className="w-full relative">
            <div className="absolute top-4 right-6 z-20"></div>
            <div className="pt-[32px]">
              <PrayerBlockPreview existingPrayer={prayer} key={prayerId} />
            </div>
          </div>
        )}
      </ScrollablePageLayout>
    </LoggedInUserWrapper>
  );
}
