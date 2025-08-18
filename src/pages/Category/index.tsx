import PrayerList from "../../layout/PrayerList";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useStatusBar } from "@/contexts/StatusBarContext";
import LoggedInUserWrapper from "@/layout/LoggedInUserWrapper";
import useCategories from "@/hooks/useCategories";
import NavigationHeader from "@/components/NavigationHeader";

export default function Category() {
  const { categoryId } = useParams();
  const { categories } = useCategories();
  const { setStatusBarColor } = useStatusBar();

  useEffect(() => {
    setStatusBarColor("#0a79b5");
  }, []);

  const selectedCategory = categories.find((cat) => cat.id === categoryId);

  if (!selectedCategory) {
    return <div>Category not found</div>;
  }

  return (
    <LoggedInUserWrapper>
      <div className="w-screen grid grid-cols-1 mx-auto overflow-y-scroll gap-3 h-full content-start">
        <NavigationHeader />

        <div className="px-6 w-full max-w-[600px] mx-auto">
          <div className="py-6 border-b">
            <h1 className="text-2xl font-bold text-center">
              {selectedCategory.name}
            </h1>
          </div>

          <PrayerList filterByCategory={selectedCategory} />
        </div>
      </div>
    </LoggedInUserWrapper>
  );
}
