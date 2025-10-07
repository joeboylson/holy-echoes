import type { Prayer } from "@schema";
import { Link, useParams } from "react-router-dom";
import { Pages } from "../App/router";
import { isEmpty } from "lodash";
import { useMemo } from "react";

interface _props {
  prayer: Prayer;
}

export default function PrayerListItem({ prayer }: _props) {
  const { categoryId } = useParams();

  const to = useMemo(() => {
    const { SELECTED_ADMIN_PRAYER, SELECTED_PRAYER, HOME } = Pages;
    const currentRoute = window.location.pathname;
    const route = currentRoute.includes("admin")
      ? SELECTED_ADMIN_PRAYER
      : SELECTED_PRAYER;

    // For category-aware routes, require category ID or redirect to home
    if (route === SELECTED_PRAYER) {
      if (!categoryId) return HOME;
      return route
        .replace(":categoryId", categoryId)
        .replace(":prayerId", prayer.id ?? "");
    }

    return route.replace(":prayerId", prayer.id ?? "");
  }, [prayer, categoryId]);

  const { prayerId } = useParams();

  const isActive = prayerId === prayer.id;

  const prayerName = useMemo(
    () => (isEmpty(prayer.name) ? "No Name" : prayer.name),
    [prayer]
  );

  return (
    <div className="relative overflow-hidden h-9 flex items-center">
      <Link
        to={to}
        className={`no-underline leading-9 ${
          isActive
            ? "text-gray-900 dark:text-white sepia:text-[oklch(0.25_0.02_60)] font-bold"
            : "text-gray-600 dark:text-gray-200 sepia:text-[oklch(0.5_0.02_65)] hover:text-gray-900 hover:font-bold dark:hover:text-white sepia:hover:text-[oklch(0.25_0.02_60)]"
        }`}
      >
        {prayerName}
      </Link>
      {!prayer.published && (
        <p className="absolute top-0 right-0 text-[10px] m-1.5 px-2 leading-6 pointer-events-none bg-[#0082cb] dark:bg-[oklch(0.32_0.12_240)] sepia:bg-[oklch(0.35_0.03_65)] text-white uppercase rounded-full">
          Not Published
        </p>
      )}
    </div>
  );
}
