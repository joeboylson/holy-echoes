import PrayerList from "../layout/PrayerList";
import PrayerBlockEditor from "../layout/PrayerBlockEditor";
import PrayerBlockPreview from "../layout/PrayerBlockPreview";
import AdminAccessWrapper from "../layout/AdminAccessWrapper";
import { useWindowSize } from "@uidotdev/usehooks";
import WindowTooSmall from "../components/WindowTooSmall";
import { CaretLeft as CaretLeftIcon, CaretRight as CaretRightIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { HEADER_HEIGHT } from "@/constants/layout";

export default function Admin() {
  const [hidePrayerList, setHidePrayerList] = useState<boolean>(false);
  const togglePrayerList = () => setHidePrayerList((_hide) => !_hide);

  const size = useWindowSize();
  if ((size.width ?? 0) < 1200) return <WindowTooSmall />;

  return (
    <AdminAccessWrapper data-id="AdminAccessWrapper">
      <div
        className={`p-6 w-screen grid gap-3 overflow-hidden ${
          hidePrayerList
            ? "grid-cols-[24px_1fr_1fr]"
            : "grid-cols-3 2xl:grid-cols-[500px_1fr_500px] xl:grid-cols-[350px_1fr_400px]"
        }`}
        style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}
        data-id="StyledAdmin"
      >
        <div
          className={`grid grid-cols-1 gap-3 content-start pb-12 overflow-y-auto ${
            hidePrayerList ? "" : "border-r border-gray-300 pr-3"
          }`}
          style={{ height: "calc(100vh - 48px - 24px)" }}
        >
          <button
            onClick={togglePrayerList}
            className="p-0 m-0 bg-transparent border-0 w-6 h-6"
          >
            {hidePrayerList ? (
              <CaretRightIcon size={24} color="var(--blue-10)" weight="bold" />
            ) : (
              <CaretLeftIcon size={24} color="var(--blue-10)" weight="bold" />
            )}
          </button>

          {!hidePrayerList && <PrayerList filterUnpublished={false} />}
        </div>
        <PrayerBlockEditor />
        <div className="h-[calc(100vh-72px-48px)] overflow-y-auto">
          <PrayerBlockPreview filterUnpublished={false} />
        </div>
      </div>
    </AdminAccessWrapper>
  );
}
