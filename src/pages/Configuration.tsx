/* eslint-disable react-refresh/only-export-components */

import AdminAccessWrapper from "../layout/AdminAccessWrapper";
import { useWindowSize } from "@uidotdev/usehooks";
import WindowTooSmall from "../components/WindowTooSmall";
import { HEADER_HEIGHT } from "@/constants/layout";
import { useState } from "react";
import CategoriesList from "@/layout/CategoryList";
import SeasonsList from "@/layout/SeasonsList";
import { Button } from "@/components/ui/button";

export enum ConfigOptions {
  CATEGORIES = "Categories",
  SEASONS = "Seasons",
}

export default function Configuration() {
  const [configOption, setConfigOption] = useState<ConfigOptions>(
    ConfigOptions.CATEGORIES
  );

  const size = useWindowSize();
  if ((size.width ?? 0) < 1200) return <WindowTooSmall />;

  return (
    <AdminAccessWrapper data-id="AdminAccessWrapper">
      <div
        className="p-6 w-screen grid grid-cols-[200px_1fr] gap-6 overflow-hidden"
        style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}
        data-id="StyledConfiguration"
      >
        <div className="grid [align-content:flex-start] gap-[8px]">
          {Object.values(ConfigOptions).map((option) => {
            return (
              <Button key={option} onClick={() => setConfigOption(option)}>
                {option}
              </Button>
            );
          })}
        </div>

        <div>
          {configOption === ConfigOptions.CATEGORIES && (
            <div className="grid gap-[24px] ">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Edit & Reorder Categories:
              </h1>
              <CategoriesList />
            </div>
          )}

          {configOption === ConfigOptions.SEASONS && (
            <div className="grid gap-[24px] ">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Edit & Manage Seasons:
              </h1>
              <SeasonsList />
            </div>
          )}
        </div>
      </div>
    </AdminAccessWrapper>
  );
}
