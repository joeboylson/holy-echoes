import { Option } from "@/types";
import { db } from "@/database";
import { id } from "@instantdb/react";
import { Season } from "@schema";
import { useMemo } from "react";

export default function useSeasons() {
  const { data, isLoading } = db.useQuery({
    seasons: {
      file: {},
      prayers: {
        $: {
          where: {
            published: true,
          },
        },
      },
      $: {
        order: {
          startMonth: "asc",
        },
      },
    },
  });

  const seasons = data?.seasons ?? [];

  const seasonsAsOptions: Option[] = seasons.map((season) => {
    return {
      label: season.name,
      value: season.id,
    };
  });

  // Get current season - the season whose date range includes today
  const currentSeason = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
    const currentDay = now.getDate();

    const publishedSeasons = seasons.filter((season) => season.published);

    // Find the season where today falls between start and end dates
    for (const season of publishedSeasons) {
      // Check if we have end date info
      if (season.endMonth && season.endDay) {
        // Check if today is within this season's range
        const afterStart =
          season.startMonth < currentMonth ||
          (season.startMonth === currentMonth && season.startDay <= currentDay);

        const beforeEnd =
          season.endMonth > currentMonth ||
          (season.endMonth === currentMonth && season.endDay >= currentDay);

        // Handle year wrap-around (e.g., Dec 15 - Jan 15)
        if (season.endMonth < season.startMonth) {
          // Season wraps around the year
          if (afterStart || beforeEnd) {
            return season;
          }
        } else {
          // Normal season within the same year
          if (afterStart && beforeEnd) {
            return season;
          }
        }
      }
    }

    // No matching season found - return undefined
    return undefined;
  }, [seasons]);

  async function addNewSeason(
    name: string,
    color: string,
    startMonth: number,
    startDay: number,
    endMonth?: number,
    endDay?: number
  ) {
    const newSeasonData: Partial<Season> = {
      name,
      color,
      startMonth,
      startDay,
      endMonth: endMonth || 12,
      endDay: endDay || 31,
      published: false, // Default to unpublished
    };
    const newId = id();
    await db.transact([db.tx.seasons[newId].update({ ...newSeasonData })]);

    return { id: newId, ...newSeasonData };
  }

  async function deleteSeason(season: Season) {
    if (!season.id) return;
    await db.transact([db.tx.seasons[season.id].delete()]);
  }

  async function editSeason(
    season: Season,
    newSeasonValues: Partial<Season>
  ) {
    if (!season.id) return;
    await db.transact([
      db.tx.seasons[season.id].update({
        ...newSeasonValues,
      }),
    ]);
  }

  async function linkPrayerToSeason(prayerId: string, seasonId: string) {
    await db.transact([
      db.tx.prayers[prayerId].link({ season: seasonId }),
    ]);
  }

  async function unlinkPrayerFromSeason(prayerId: string, seasonId: string) {
    await db.transact([
      db.tx.prayers[prayerId].unlink({ season: seasonId }),
    ]);
  }

  async function linkFileToSeason(fileId: string, seasonId: string) {
    await db.transact([
      db.tx.seasons[seasonId].link({ file: fileId }),
    ]);
  }

  async function unlinkFileFromSeason(seasonId: string, fileId: string) {
    await db.transact([
      db.tx.seasons[seasonId].unlink({ file: fileId }),
    ]);
  }

  return {
    seasons,
    currentSeason,
    seasonsLoading: isLoading,
    seasonsAsOptions,
    addNewSeason,
    deleteSeason,
    editSeason,
    linkPrayerToSeason,
    unlinkPrayerFromSeason,
    linkFileToSeason,
    unlinkFileFromSeason,
  };
}
