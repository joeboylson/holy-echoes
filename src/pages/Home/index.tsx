import styled from "styled-components";
import PrayerList from "../../layout/PrayerList";
import { useState } from "react";
import { Category } from "@/database";
import useCategories from "@/hooks/useCategories";
import { CategoryButton } from "./StyledComponents";
import Logo from "@/assets/logo-1024.png";
import clsx from "clsx";

const StyledHome = styled.div`
  width: 100vw;
  height: var(--window-height);
  display: grid;
  grid-template-columns: 1fr;
  margin: 0 auto;
  overflow-y: scroll;
`;

export default function Home() {
  const { categoriesWithPrayers } = useCategories();

  const [selectedCategory, setSelectedCategory] = useState<Category>();

  return (
    <StyledHome
      data-id="StyledHome"
      className="grid gap-[12px] [align-content:flex-start]"
    >
      <div className="w-full h-[100px] mx-auto bg-[#0082cb] grid place-items-center">
        {/**
         * HOLY ECHOES LOGO
         */}
        <img src={Logo} alt={"Holy Echoes App Logo"} className="!w-[48px]" />
      </div>

      <div className="px-[12px] max-w-[600px] mx-auto">
        <div className="flex flex-wrap gap-[8px] border-b border-b-1 py-[24px]">
          <CategoryButton
            className={clsx({
              "is-active": !selectedCategory,
            })}
            onClick={() => setSelectedCategory(undefined)}
          >
            All Prayers
          </CategoryButton>
          {categoriesWithPrayers.map((category) => {
            return (
              <CategoryButton
                className={clsx({
                  "is-active": selectedCategory?.id === category.id,
                })}
                onClick={() => setSelectedCategory(category)}
              >
                {category.name}
              </CategoryButton>
            );
          })}
        </div>

        <PrayerList filterByCategory={selectedCategory} />
      </div>
    </StyledHome>
  );
}
