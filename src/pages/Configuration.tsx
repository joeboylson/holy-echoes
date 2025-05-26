import styled from "styled-components";
import AuthenticatedWrapper from "../layout/AuthenticatedWrapper";
import { useWindowSize } from "@uidotdev/usehooks";
import WindowTooSmall from "../components/WindowTooSmall";
import { HEADER_HEIGHT } from "@/constants/layout";
import { useState } from "react";
import CategoriesList from "@/layout/CategoryList";
import { Button } from "@/components/ui/button";
import ImageV2 from "@/_dev/image_v2";

export enum ConfigOptions {
  CATEGORIES = "Categories",
  IMAGE_V2 = "Image V2",
}

const StyledConfiguration = styled.div`
  padding: 24px;
  width: 100vw;
  height: calc(100vh - ${HEADER_HEIGHT}px);
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
    <AuthenticatedWrapper data-id="AuthenticatedWrapper">
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

          {configOption === ConfigOptions.IMAGE_V2 && <ImageV2 />}
        </div>
      </StyledConfiguration>
    </AuthenticatedWrapper>
  );
}
