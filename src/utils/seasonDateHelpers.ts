/**
 * Utility functions for converting between day-of-year (1-365) and month/day format
 */

// Days in each month (non-leap year)
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * Convert a day of year (1-365) to month and day
 * @param dayOfYear - Day number from 1 to 365
 * @returns Object with month (1-12) and day (1-31)
 */
export function dayOfYearToMonthDay(dayOfYear: number): {
  month: number;
  day: number;
} {
  // Clamp to valid range
  const clampedDay = Math.max(1, Math.min(365, Math.floor(dayOfYear)));

  let remainingDays = clampedDay;
  let month = 1;

  // Find which month this day falls into
  for (let i = 0; i < DAYS_IN_MONTH.length; i++) {
    if (remainingDays <= DAYS_IN_MONTH[i]) {
      month = i + 1;
      break;
    }
    remainingDays -= DAYS_IN_MONTH[i];
  }

  return {
    month,
    day: remainingDays,
  };
}

/**
 * Convert month (1-12) and day (1-31) to day of year (1-365)
 * @param month - Month number from 1 to 12
 * @param day - Day number from 1 to 31
 * @returns Day of year from 1 to 365
 */
export function monthDayToDayOfYear(month: number, day: number): number {
  // Clamp to valid ranges
  const clampedMonth = Math.max(1, Math.min(12, Math.floor(month)));
  const clampedDay = Math.max(
    1,
    Math.min(DAYS_IN_MONTH[clampedMonth - 1], Math.floor(day))
  );

  let dayOfYear = 0;

  // Add days from all previous months
  for (let i = 0; i < clampedMonth - 1; i++) {
    dayOfYear += DAYS_IN_MONTH[i];
  }

  // Add days in current month
  dayOfYear += clampedDay;

  return dayOfYear;
}

/**
 * Format a day of year as a readable date string
 * @param dayOfYear - Day number from 1 to 365
 * @returns Formatted date string like "January 1"
 */
export function formatDayOfYear(dayOfYear: number): string {
  const { month, day } = dayOfYearToMonthDay(dayOfYear);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${monthNames[month - 1]} ${day}`;
}
