import styled from "styled-components";
import PrayerList from "../../layout/PrayerList";
import { useEffect, useState } from "react";
import { Category } from "@/database";
import useCategories from "@/hooks/useCategories";
import { CategoryButton } from "./StyledComponents";
import Logo from "@/assets/logo-1024.png";
import clsx from "clsx";
import { useStatusBar } from "@/contexts/StatusBarContext";

const StyledHome = styled.div`
  width: 100vw;
  display: grid;
  grid-template-columns: 1fr;
  margin: 0 auto;
  overflow-y: scroll;
`;

const HomeHeader = styled.div`
  box-shadow: 0 1px 1px hsl(0deg 0% 0% / 0.075),
    0 2px 2px hsl(0deg 0% 0% / 0.075), 0 4px 4px hsl(0deg 0% 0% / 0.075),
    0 8px 8px hsl(0deg 0% 0% / 0.075), 0 16px 16px hsl(0deg 0% 0% / 0.075);
  z-index: +1;
`;

export default function Home() {
  const { categoriesWithPrayers } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<Category>();

  const { setStatusBarColor } = useStatusBar();
  useEffect(() => {
    setStatusBarColor("#0082cb");
  }, []);

  return (
    <StyledHome
      data-id="StyledHome"
      className="grid gap-[12px] h-full content-start"
    >
      <HomeHeader className="w-full h-[100px] mx-auto bg-[#0082cb] grid place-items-center">
        {/**
         * HOLY ECHOES LOGO
         */}
        <img src={Logo} alt={"Holy Echoes App Logo"} className="!w-[48px]" />
      </HomeHeader>

      <div className="px-[24px] max-w-[600px] mx-auto">
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
