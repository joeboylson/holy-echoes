import type { Prayer } from "@schema";
import { Link, useParams } from "react-router-dom";
import { Pages } from "../App/router";
import { compact, isEmpty } from "lodash";
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

  const className = compact([prayerId === prayer.id ? "active" : null]).join(
    " "
  );

  const prayerName = useMemo(
    () => (isEmpty(prayer.name) ? "No Name" : prayer.name),
    [prayer]
  );

  return (
    <div className={`relative overflow-hidden h-9 items-center grid ${className}`}>
      <Link
        to={to}
        className="text-gray-600 no-underline leading-9 hover:text-black hover:font-bold [.active_&]:text-black [.active_&]:font-bold"
      >
        {prayerName}
      </Link>
      {!prayer.published && (
        <p className="absolute top-0 right-0 text-[10px] m-1.5 px-2 leading-6 pointer-events-none bg-[var(--blue-10)] text-white uppercase rounded-full">
          Not Published
        </p>
      )}
    </div>
  );
}
