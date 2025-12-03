import useSeasons from "@/hooks/useSeasons";
import usePrayers from "@/hooks/usePrayers";
import { Button } from "@/components/ui/button";
import { SeasonTimeline } from "./SeasonTimeline";
import {
  monthDayToDayOfYear,
  dayOfYearToMonthDay,
} from "@/utils/seasonDateHelpers";
import { ArrowDownIcon } from "@phosphor-icons/react";

export default function SeasonsList() {
  const {
    seasons,
    seasonsLoading,
    deleteSeason,
    editSeason,
    addNewSeason,
    linkPrayerToSeason,
    unlinkPrayerFromSeason,
    linkFileToSeason,
    unlinkFileFromSeason,
  } = useSeasons();

  const { prayers } = usePrayers({ filterUnpublished: true });

  if (seasonsLoading) return <span />;

  const handleAddSeasonBefore = async (targetSeason: any) => {
    // Sort seasons by start date
    const sortedSeasons = [...seasons].sort((a, b) => {
      const aDayOfYear = monthDayToDayOfYear(a.startMonth, a.startDay);
      const bDayOfYear = monthDayToDayOfYear(b.startMonth, b.startDay);
      return aDayOfYear - bDayOfYear;
    });

    // Find the target season's position
    const targetIndex = sortedSeasons.findIndex(
      (s) => s.id === targetSeason.id
    );

    // Calculate where the new season should end (1 day before target starts)
    const targetStartDay = monthDayToDayOfYear(
      targetSeason.startMonth,
      targetSeason.startDay
    );
    const newSeasonEndDay = targetStartDay - 1;

    let newSeasonStartDay: number;
    let newSeasonStartDate: { month: number; day: number };
    let newSeasonEndDate: { month: number; day: number };

    if (targetIndex === 0) {
      // This is the first season - create 7-day season starting Jan 1
      newSeasonStartDay = 1;
      newSeasonStartDate = { month: 1, day: 1 };
      newSeasonEndDate = { month: 1, day: 7 }; // 7 days long

      // Move the old first season to start on Jan 8
      await editSeason(targetSeason, {
        startMonth: 1,
        startDay: 8,
      });
    } else {
      // There's a previous season - create 7-day season and adjust previous
      newSeasonStartDay = newSeasonEndDay - 6; // 7 days total
      if (newSeasonStartDay < 1) {
        newSeasonStartDay = 365 + newSeasonStartDay;
      }

      newSeasonStartDate = dayOfYearToMonthDay(newSeasonStartDay);
      newSeasonEndDate = dayOfYearToMonthDay(
        newSeasonEndDay > 0 ? newSeasonEndDay : 365 + newSeasonEndDay
      );

      // Adjust the previous season to end before our new season
      const previousSeason = sortedSeasons[targetIndex - 1];
      const adjustedPreviousEndDay = newSeasonStartDay - 1;
      const adjustedPreviousEndDate = dayOfYearToMonthDay(
        adjustedPreviousEndDay > 0
          ? adjustedPreviousEndDay
          : 365 + adjustedPreviousEndDay
      );

      await editSeason(previousSeason, {
        endMonth: adjustedPreviousEndDate.month,
        endDay: adjustedPreviousEndDate.day,
      });
    }

    // Add the new season
    await addNewSeason(
      "New Season",
      "#0082cb",
      newSeasonStartDate.month,
      newSeasonStartDate.day,
      newSeasonEndDate.month,
      newSeasonEndDate.day
    );
  };

  const handleAddSeasonAfter = async () => {
    let defaultMonth: number;
    let defaultDay: number;

    if (seasons.length === 0) {
      // First season always starts on January 1st
      defaultMonth = 1;
      defaultDay = 1;
    } else {
      // Sort seasons by start date to find the latest season
      const sortedSeasons = [...seasons].sort((a, b) => {
        const aDayOfYear = monthDayToDayOfYear(a.startMonth, a.startDay);
        const bDayOfYear = monthDayToDayOfYear(b.startMonth, b.startDay);
        return aDayOfYear - bDayOfYear;
      });

      const latestSeason = sortedSeasons[sortedSeasons.length - 1];

      // Calculate one day after the latest season's end date
      const latestEndDay =
        latestSeason.endMonth && latestSeason.endDay
          ? monthDayToDayOfYear(latestSeason.endMonth, latestSeason.endDay)
          : 365;

      const nextDayOfYear = latestEndDay === 365 ? 1 : latestEndDay + 1;
      const nextDate = dayOfYearToMonthDay(nextDayOfYear);

      defaultMonth = nextDate.month;
      defaultDay = nextDate.day;
    }

    await addNewSeason("New Season", "#0082cb", defaultMonth, defaultDay);
  };

  return (
    <div className="grid grid-cols-1 content-start gap-3">
      {/* Season Timeline with multi-handle slider and all season details */}
      {seasons.length > 0 ? (
        <>
          <SeasonTimeline
            seasons={seasons}
            prayers={prayers}
            onUpdateSeason={(season, updates) => editSeason(season, updates)}
            onDeleteSeason={deleteSeason}
            onLinkPrayer={linkPrayerToSeason}
            onUnlinkPrayer={unlinkPrayerFromSeason}
            onLinkFile={linkFileToSeason}
            onUnlinkFile={unlinkFileFromSeason}
            onAddSeasonBefore={handleAddSeasonBefore}
          />
          <Button
            onClick={handleAddSeasonAfter}
            variant="primary"
            className="w-[200px]"
          >
            Add Season After <ArrowDownIcon />
          </Button>
        </>
      ) : (
        <Button onClick={handleAddSeasonAfter}>Add First Season</Button>
      )}
    </div>
  );
}
