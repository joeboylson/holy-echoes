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
    <div className="relative overflow-hidden h-9 items-center grid">
      <Link
        to={to}
        className="text-gray-600 no-underline leading-9 hover:text-black hover:font-bold"
      >
        {prayerName}
      </Link>
      {!favorite.prayer?.published && (
        <p className="absolute top-0 right-0 text-[10px] m-1.5 px-2 leading-6 pointer-events-none bg-[var(--blue-10)] text-white uppercase rounded-full">
          Not Published
        </p>
      )}
    </div>
  );
}
