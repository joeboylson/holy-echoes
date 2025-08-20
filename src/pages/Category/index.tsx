import PrayerList from "../../layout/PrayerList";
import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStatusBar } from "@/contexts/StatusBarContext";
import LoggedInUserWrapper from "@/layout/LoggedInUserWrapper";
import useCategory from "@/hooks/useCategory";
import NavigationHeader from "@/components/NavigationHeader";
import { Pages } from "@/layout/App/router";

export default function Category() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { category, prevCategory, nextCategory, isLoading } =
    useCategory(categoryId);
  const { setStatusBarColor } = useStatusBar();

  useEffect(() => {
    setStatusBarColor("#0082cb");
  }, [setStatusBarColor]);

  const handlePrevious = useMemo(() => {
    if (!prevCategory?.id) return undefined;
    return () => navigate(`/category/${prevCategory.id}`);
  }, [prevCategory, navigate]);

  const handleNext = useMemo(() => {
    if (!nextCategory?.id) return undefined;
    return () => navigate(`/category/${nextCategory.id}`);
  }, [nextCategory, navigate]);

  if (isLoading) return <div>Loading...</div>;

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <LoggedInUserWrapper>
      <div className="w-screen grid grid-cols-1 mx-auto overflow-y-scroll gap-3 h-full content-start">
        <NavigationHeader
          backTo={Pages.HOME}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />

        <div className="px-6 w-full max-w-[600px] mx-auto">
          <div className="py-6 border-b">
            <h1 className="text-2xl font-bold text-center">{category.name}</h1>
          </div>

          <PrayerList filterByCategory={category} />
        </div>
      </div>
    </LoggedInUserWrapper>
  );
}
