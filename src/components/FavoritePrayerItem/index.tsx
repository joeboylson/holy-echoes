import type { Favorite } from "@schema";
import { Link } from "react-router-dom";
import { Pages } from "@/layout/App/router";
import { isEmpty } from "lodash";
import { useMemo } from "react";

interface FavoritePrayerItemProps {
  favorite: Favorite;
}

export default function FavoritePrayerItem({
  favorite,
}: FavoritePrayerItemProps) {
  const to = useMemo(() => {
    return Pages.SELECTED_PRAYER.replace(":categoryId", "favorites").replace(
      ":prayerId",
      favorite.prayer?.id ?? ""
    );
  }, [favorite]);

  const prayerName = useMemo(
    () => (isEmpty(favorite.prayer?.name) ? "No Name" : favorite.prayer?.name),
    [favorite]
  );

  return (
    <div className="relative overflow-hidden h-9 flex items-center">
      <Link
        to={to}
        className="no-underline leading-9 text-gray-600 dark:text-gray-200 sepia:text-[oklch(0.5_0.02_65)] hover:text-gray-900 hover:font-bold dark:hover:text-white sepia:hover:text-[oklch(0.25_0.02_60)]"
      >
        {prayerName}
      </Link>
      {!favorite.prayer?.published && (
        <p className="absolute top-0 right-0 text-[10px] m-1.5 px-2 leading-6 pointer-events-none bg-[#0082cb] dark:bg-[oklch(0.32_0.12_240)] sepia:bg-[oklch(0.35_0.03_65)] text-white uppercase rounded-full">
          Not Published
        </p>
      )}
    </div>
  );
}
