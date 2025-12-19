import { useEffect } from "react";
import { useStatusBar } from "@/contexts/StatusBarContext";
import { useHeaderColor } from "@/contexts/HeaderColorContext";
import LoggedInUserWrapper from "@/layout/LoggedInUserWrapper";
import NavigationHeader from "@/components/NavigationHeader";
import { Pages } from "@/layout/App/router";
import PrayerList from "@/layout/PrayerList";
import ScrollablePageLayout from "@/components/ScrollablePageLayout";

export default function AllPrayersCategory() {
  const { setStatusBarColor } = useStatusBar();
  const { headerColor } = useHeaderColor();

  useEffect(() => {
    setStatusBarColor(headerColor);
  }, [setStatusBarColor, headerColor]);

  return (
    <LoggedInUserWrapper>
      <ScrollablePageLayout
        variant="50"
        header={<NavigationHeader backTo={Pages.HOME} />}
      >
        <div className="px-6 w-full max-w-[640px] mx-auto">
          <div className="py-6 border-b">
            <h1 className="text-2xl font-bold text-center">All Prayers</h1>
          </div>

          <PrayerList />
        </div>
      </ScrollablePageLayout>
    </LoggedInUserWrapper>
  );
}
