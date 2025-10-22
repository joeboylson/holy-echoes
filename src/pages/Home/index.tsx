import { useEffect } from "react";
import useCategories from "@/hooks/useCategories";
import { useStatusBar } from "@/contexts/StatusBarContext";
import LoggedInUserWrapper from "@/layout/LoggedInUserWrapper";
import { Link } from "react-router-dom";
import FavoriteHomeItem from "@/layout/FavoriteHomeItem";
import AllPrayersHomeItem from "@/layout/AllPrayersHomeItem";
import ScrollablePageLayout from "@/components/ScrollablePageLayout";
import HomeHeader from "@/layout/HomeHeader";

export default function Home() {
  const { categoriesWithPrayers } = useCategories();
  const { setStatusBarColor } = useStatusBar();

  useEffect(() => {
    setStatusBarColor("#0082cb");
  }, [setStatusBarColor]);

  return (
    <LoggedInUserWrapper>
      <ScrollablePageLayout variant="100" header={<HomeHeader />}>
        <div className="px-6 w-full max-w-[600px] mx-auto">
          <div className="py-6">
            <div className="grid gap-4 grid-cols-2">
              <FavoriteHomeItem />
              <AllPrayersHomeItem />

              {categoriesWithPrayers.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className="flex flex-col justify-between p-4 bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow no-underline text-gray-900 hover:text-gray-900"
                >
                  <h2 className="text-lg font-semibold">{category.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {category.prayers?.length || 0} prayers
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollablePageLayout>
    </LoggedInUserWrapper>
  );
}
