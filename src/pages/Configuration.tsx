/* eslint-disable react-refresh/only-export-components */

import styled from "styled-components";
import AdminAccessWrapper from "../layout/AdminAccessWrapper";
import { useWindowSize } from "@uidotdev/usehooks";
import WindowTooSmall from "../components/WindowTooSmall";
import { HEADER_HEIGHT } from "@/constants/layout";
import { useState } from "react";
import CategoriesList from "@/layout/CategoryList";
import { Button } from "@/components/ui/button";

export enum ConfigOptions {
  CATEGORIES = "Categories",
}

const StyledConfiguration = styled.div`
  padding: 24px;
  width: 100vw;
  height: calc(var(--header-height) - ${HEADER_HEIGHT}px);
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 24px;
  overflow: hidden;
`;

export default function Configuration() {
  const [configOption, setConfigOption] = useState<ConfigOptions>(
    ConfigOptions.CATEGORIES
  );

  const size = useWindowSize();
  if ((size.width ?? 0) < 1200) return <WindowTooSmall />;

  return (
    <AdminAccessWrapper data-id="AdminAccessWrapper">
      <StyledConfiguration data-id="StyledConfiguration">
        <div className="grid [align-content:flex-start] gap-[8px]">
          {Object.values(ConfigOptions).map((configOption) => {
            return (
              <Button onClick={() => setConfigOption(configOption)}>
                {configOption}
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
        </div>
      </StyledConfiguration>
    </AdminAccessWrapper>
  );
}
