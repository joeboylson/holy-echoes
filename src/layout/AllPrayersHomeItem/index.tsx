import usePrayers from "@/hooks/usePrayers";
import { Link } from "react-router-dom";

export default function AllPrayersHomeItem() {
  const { prayers } = usePrayers();

  return (
    <Link
      to="/category/all-prayers"
      className="flex flex-col justify-between p-4 bg-white dark:bg-[oklch(0.22_0_0)] sepia:bg-[oklch(0.95_0.015_80)] border border-gray-200 dark:border-[oklch(0.3_0_0)] sepia:border-[oklch(0.82_0.02_75)] rounded-lg shadow hover:shadow-md transition-shadow no-underline text-gray-900 dark:text-gray-100 sepia:text-[oklch(0.25_0.02_60)] hover:text-gray-900 dark:hover:text-white sepia:hover:text-[oklch(0.2_0.02_60)]"
    >
      <h2 className="text-lg font-semibold">All Prayers</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 sepia:text-[oklch(0.5_0.02_65)] mt-1">{prayers.length} prayers</p>
    </Link>
  );
}
