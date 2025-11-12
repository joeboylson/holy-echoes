import styled from "styled-components";
import useSeasons from "@/hooks/useSeasons";
import usePrayers from "@/hooks/usePrayers";
import { Button } from "@/components/ui/button";
import { SeasonTimeline } from "./SeasonTimeline";
import {
  monthDayToDayOfYear,
  dayOfYearToMonthDay,
} from "@/utils/seasonDateHelpers";

const StyledSeasonsList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  align-content: start;
  gap: 12px;
`;

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

  const { prayers } = usePrayers({ filterUnpublished: false });

  if (seasonsLoading) return <span />;

  const handleAddNewSeason = async () => {
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

      // Calculate one day after the latest season's start date
      const latestDayOfYear = monthDayToDayOfYear(
        latestSeason.startMonth,
        latestSeason.startDay
      );
      const nextDayOfYear = latestDayOfYear === 365 ? 1 : latestDayOfYear + 1;
      const nextDate = dayOfYearToMonthDay(nextDayOfYear);

      defaultMonth = nextDate.month;
      defaultDay = nextDate.day;
    }

    await addNewSeason("New Season", "#0082cb", defaultMonth, defaultDay);
  };

  return (
    <StyledSeasonsList>
      <Button onClick={handleAddNewSeason}>Add New Season</Button>

      {/* Season Timeline with multi-handle slider and all season details */}
      {seasons.length > 0 && (
        <SeasonTimeline
          seasons={seasons}
          prayers={prayers}
          onUpdateSeason={(season, updates) => editSeason(season, updates)}
          onDeleteSeason={deleteSeason}
          onLinkPrayer={linkPrayerToSeason}
          onUnlinkPrayer={unlinkPrayerFromSeason}
          onLinkFile={linkFileToSeason}
          onUnlinkFile={unlinkFileFromSeason}
        />
      )}
    </StyledSeasonsList>
  );
}
