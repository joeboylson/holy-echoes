import { useEffect } from "react";
import { useStatusBar } from "@/contexts/StatusBarContext";
import LoggedInUserWrapper from "@/layout/LoggedInUserWrapper";
import NavigationHeader from "@/components/NavigationHeader";
import { Pages } from "@/layout/App/router";

export default function Search() {
  const { setStatusBarColor } = useStatusBar();

  useEffect(() => {
    setStatusBarColor("#0082cb");
  }, [setStatusBarColor]);

  return (
    <LoggedInUserWrapper>
      <div className="w-screen grid grid-cols-1 mx-auto gap-3 h-full content-start">
        <NavigationHeader backTo={Pages.HOME} />

        <div className="px-6 w-full max-w-[600px] mx-auto flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Coming Soon
            </h1>
            <p className="text-gray-600 text-lg">
              Prayer search functionality will be available soon.
            </p>
          </div>
        </div>
      </div>
    </LoggedInUserWrapper>
  );
}
