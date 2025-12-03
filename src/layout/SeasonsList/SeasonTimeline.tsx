import { Season, Prayer } from "@schema";
import { Slider } from "@/components/ui/slider";
import {
  monthDayToDayOfYear,
  dayOfYearToMonthDay,
} from "@/utils/seasonDateHelpers";
import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { SeasonListItem } from "./SeasonListItem";
import DeleteButton from "@/components/DeleteButton";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon } from "@phosphor-icons/react";

type SeasonTimelineProps = {
  seasons: Season[];
  prayers: Prayer[];
  onUpdateSeason: (season: Season, updates: Partial<Season>) => void;
  onDeleteSeason: (season: Season) => void;
  onLinkPrayer: (prayerId: string, seasonId: string) => void;
  onUnlinkPrayer: (prayerId: string, seasonId: string) => void;
  onLinkFile: (fileId: string, seasonId: string) => void;
  onUnlinkFile: (seasonId: string, fileId: string) => void;
  onAddSeasonBefore: (season: Season) => void;
};

export function SeasonTimeline({
  seasons,
  prayers,
  onUpdateSeason,
  onDeleteSeason,
  onLinkPrayer,
  onUnlinkPrayer,
  onLinkFile,
  onUnlinkFile,
  onAddSeasonBefore,
}: SeasonTimelineProps) {
  // Sort seasons by start day for display
  const sortedSeasons = useMemo(() => {
    return [...seasons].sort((a, b) => {
      const aDayOfYear = monthDayToDayOfYear(a.startMonth, a.startDay);
      const bDayOfYear = monthDayToDayOfYear(b.startMonth, b.startDay);
      return aDayOfYear - bDayOfYear;
    });
  }, [seasons]);

  // Convert seasons to slider values (end days of year)
  const sliderValues = useMemo(() => {
    return sortedSeasons.map((season, index) => {
      // If the season has endMonth and endDay, use those
      if (season.endMonth && season.endDay) {
        return monthDayToDayOfYear(season.endMonth, season.endDay);
      }

      // Otherwise, calculate based on next season's start (fallback for legacy data)
      if (index === sortedSeasons.length - 1) {
        // Last season - default to end of year
        return 365;
      }

      // For other seasons, the end day is one day before the next season starts
      const nextSeason = sortedSeasons[index + 1];
      const nextStartDay = monthDayToDayOfYear(
        nextSeason.startMonth,
        nextSeason.startDay
      );
      return nextStartDay - 1;
    });
  }, [sortedSeasons]);

  // Local state for slider values to allow smooth dragging
  const [localSliderValues, setLocalSliderValues] = useState(sliderValues);

  // Update local values when seasons change
  useEffect(() => {
    setLocalSliderValues(sliderValues);
  }, [sliderValues]);

  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSliderChange = useCallback(
    (newValues: number[]) => {
      // Update local state immediately for smooth UI
      setLocalSliderValues(newValues);

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Debounce the actual database update
      debounceTimerRef.current = setTimeout(() => {
        // Update seasons based on slider values (which represent end days)
        newValues.forEach((endDayOfYear, index) => {
          const season = sortedSeasons[index];
          const { month: endMonth, day: endDay } =
            dayOfYearToMonthDay(endDayOfYear);

          // Update this season's end date
          onUpdateSeason(season, {
            endMonth,
            endDay,
          });

          // If this is not the last season, update the NEXT season's start date
          // to be one day after this season's end date
          if (index < sortedSeasons.length - 1) {
            const nextSeason = sortedSeasons[index + 1];
            const nextStartDay = endDayOfYear + 1;
            const { month: startMonth, day: startDay } = dayOfYearToMonthDay(
              nextStartDay > 365 ? 1 : nextStartDay
            );

            onUpdateSeason(nextSeason, {
              startMonth,
              startDay,
            });
          }
        });

        // Show success toast
        toast.success("Season dates updated successfully");
      }, 500); // 500ms debounce
    },
    [sortedSeasons, onUpdateSeason]
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Calculate visual blocks for the timeline
  const visualBlocks = useMemo(() => {
    if (sortedSeasons.length === 0) return [];

    const blocks = sortedSeasons.map((season, index) => {
      // Calculate start day
      let startDay: number;
      if (index === 0) {
        startDay = 1; // First season always starts on January 1st
      } else {
        // Start day is one day after previous season's end
        const prevEndDay = localSliderValues[index - 1];
        startDay = prevEndDay + 1;
      }

      // End day comes from the slider value
      const endDay = localSliderValues[index];

      const duration =
        endDay >= startDay
          ? endDay - startDay + 1
          : 365 - startDay + endDay + 1;
      const startPercent = ((startDay - 1) / 365) * 100;
      const widthPercent = (duration / 365) * 100;

      return {
        season,
        startDay,
        endDay,
        startPercent,
        widthPercent,
        wrapsAround: false,
      };
    });

    return blocks;
  }, [sortedSeasons, localSliderValues]);

  // Calculate if there's an empty space block needed (at the end of the year)
  const emptySpaceBlock = useMemo(() => {
    if (sortedSeasons.length === 0) return null;

    const lastSeason = visualBlocks[visualBlocks.length - 1];
    if (!lastSeason) return null;

    const lastSeasonEndDay = lastSeason.endDay;

    // If last season ends at day 365, there's no gap
    if (lastSeasonEndDay >= 365) return null;

    // Calculate gap from day after last season ends to end of year
    const gapStartDay = lastSeasonEndDay + 1;
    const gapStartPercent = ((gapStartDay - 1) / 365) * 100;
    const gapDuration = 365 - lastSeasonEndDay;
    const gapWidthPercent = (gapDuration / 365) * 100;

    return {
      startPercent: gapStartPercent,
      widthPercent: gapWidthPercent,
    };
  }, [sortedSeasons, visualBlocks]);

  if (seasons.length === 0) {
    return (
      <div className="text-gray-500 text-sm">
        No seasons yet. Add a season to get started.
      </div>
    );
  }

  return (
    <div className="grid gap-6 p-6 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold">Season Timeline</h3>

      {/* Visual Timeline */}
      <div className="relative h-16 w-full bg-white rounded border overflow-hidden">
        {visualBlocks.map(
          ({ season, startPercent, widthPercent, wrapsAround }) => (
            <div key={season.id}>
              {/* Main block */}
              <div
                className="absolute h-full flex items-center justify-center text-white text-xs font-medium px-2 transition-all border-r-2 border-l-2 border-white"
                style={{
                  backgroundColor: season.color,
                  left: `${startPercent}%`,
                  width: wrapsAround
                    ? `${100 - startPercent}%`
                    : `${widthPercent}%`,
                }}
              >
                <span className="truncate">{season.name}</span>
              </div>
              {/* Wrap-around block for seasons that cross year boundary */}
              {wrapsAround && (
                <div
                  className="absolute h-full flex items-center justify-center text-white text-xs font-medium px-2 transition-all border-r-2 border-l-2 border-white"
                  style={{
                    backgroundColor: season.color,
                    left: "0%",
                    width: `${widthPercent - (100 - startPercent)}%`,
                  }}
                >
                  <span className="truncate">{season.name}</span>
                </div>
              )}
            </div>
          )
        )}

        {/* Empty space block (if seasons don't cover full year) */}
        {emptySpaceBlock && (
          <div
            className="absolute h-full flex items-center justify-center text-gray-400 text-xs italic px-2 transition-all border-r-2 border-l-2 border-gray-300 bg-gray-100"
            style={{
              left: `${emptySpaceBlock.startPercent}%`,
              width: `${emptySpaceBlock.widthPercent}%`,
            }}
          >
            <span className="truncate">Empty</span>
          </div>
        )}
      </div>

      {/* Multi-handle slider */}
      <div className="px-2">
        <Slider
          min={1}
          max={365}
          value={localSliderValues}
          onValueChange={handleSliderChange}
          className="w-full"
        />
      </div>

      {/* Season details */}
      <div className="grid gap-4">
        {sortedSeasons.map((season, index) => {
          const block = visualBlocks[index];
          return (
            <div key={season.id} className="grid gap-4">
              {/* Add Season Before button */}
              <Button
                onClick={() => onAddSeasonBefore(season)}
                variant="primary"
                size="sm"
                className="w-[200px]"
              >
                <ArrowUpIcon />
                Add Season Before
              </Button>

              {/* Season card */}
              <div
                className="p-4 bg-white rounded border-2"
                style={{ borderColor: season.color }}
              >
                <div className="flex gap-4 items-start">
                  <DeleteButton
                    itemName="Season"
                    onClick={() => onDeleteSeason(season)}
                    icon
                  />

                  <SeasonListItem
                    season={season}
                    prayers={prayers}
                    startDay={block?.startDay}
                    endDay={block?.endDay}
                    onSave={(updates) => onUpdateSeason(season, updates)}
                    onLinkPrayer={(prayerId) =>
                      onLinkPrayer(prayerId, season.id)
                    }
                    onUnlinkPrayer={(prayerId) =>
                      onUnlinkPrayer(prayerId, season.id)
                    }
                    onLinkFile={(fileId) => onLinkFile(fileId, season.id)}
                    onUnlinkFile={() => {
                      if (season.file?.id) {
                        onUnlinkFile(season.id, season.file.id);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
