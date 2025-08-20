import { useEffect } from "react";
import useCategories from "@/hooks/useCategories";
import Logo from "@/assets/he-textlogo-white.png";
import { useStatusBar } from "@/contexts/StatusBarContext";
import LoggedInUserWrapper from "@/layout/LoggedInUserWrapper";
import { Link } from "react-router-dom";

export default function Home() {
  const { categoriesWithPrayers } = useCategories();
  const { setStatusBarColor } = useStatusBar();

  useEffect(() => {
    setStatusBarColor("#0082cb");
  }, [setStatusBarColor]);

  return (
    <LoggedInUserWrapper>
      <div className="w-screen grid grid-cols-1 mx-auto overflow-y-scroll gap-3 h-full content-start">
        <div className="w-full h-[100px] mx-auto bg-[#0082cb] grid place-items-center shadow-lg z-10">
          <img src={Logo} alt="Holy Echoes App Logo" className="!w-[250px]" />
        </div>

        <div className="px-6 w-full max-w-[600px] mx-auto pb-[100px]">
          <div className="py-6">
            <div className="grid gap-4 grid-cols-2">
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
      </div>
    </LoggedInUserWrapper>
  );
}
