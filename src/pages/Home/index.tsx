import { useEffect } from "react";
import useCategories from "@/hooks/useCategories";
import Logo from "@/assets/he-textlogo-white.png";
import { useStatusBar } from "@/contexts/StatusBarContext";
import LoggedInUserWrapper from "@/layout/LoggedInUserWrapper";
import { Link } from "react-router-dom";
import FavoriteHomeItem from "@/layout/FavoriteHomeItem";
import AllPrayersHomeItem from "@/layout/AllPrayersHomeItem";
import { themeClasses } from "@/styles/theme";

export default function Home() {
  const { categoriesWithPrayers } = useCategories();
  const { setStatusBarColor } = useStatusBar();

  useEffect(() => {
    setStatusBarColor("#0082cb");
  }, [setStatusBarColor]);

  return (
    <LoggedInUserWrapper>
      <div className="w-screen grid grid-cols-1 mx-auto gap-3 h-full content-start">
        <div className={`w-full h-[100px] mx-auto ${themeClasses.header} grid place-items-center shadow-lg z-10`}>
          <img src={Logo} alt="Holy Echoes App Logo" className="!w-[250px]" />
        </div>

        <div className="px-6 w-full max-w-[600px] mx-auto pb-[100px]">
          <div className="py-6">
            <div className="grid gap-4 grid-cols-2">
              <FavoriteHomeItem />
              <AllPrayersHomeItem />

              {categoriesWithPrayers.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className={`flex flex-col justify-between p-4 ${themeClasses.card} border ${themeClasses.cardBorder} rounded-lg shadow hover:shadow-md transition-shadow no-underline ${themeClasses.text} hover:text-gray-900 dark:hover:text-white sepia:hover:text-[oklch(0.2_0.02_60)]`}
                >
                  <h2 className="text-lg font-semibold">{category.name}</h2>
                  <p className={`text-sm ${themeClasses.textMuted} mt-1`}>
                    {category.prayers?.length || 0} prayers
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LoggedInUserWrapper>
  );
}
