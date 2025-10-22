import { useEffect } from "react";
import { useStatusBar } from "@/contexts/StatusBarContext";
import LoggedInUserWrapper from "@/layout/LoggedInUserWrapper";
import NavigationHeader from "@/components/NavigationHeader";
import { Pages } from "@/layout/App/router";
import { db } from "@/database";
import ScrollablePageLayout from "@/components/ScrollablePageLayout";

export default function Profile() {
  const { setStatusBarColor } = useStatusBar();
  const { user } = db.useAuth();

  useEffect(() => {
    setStatusBarColor("#0082cb");
  }, [setStatusBarColor]);

  const handleSignOut = () => {
    db.auth.signOut();
  };

  return (
    <LoggedInUserWrapper>
      <ScrollablePageLayout variant="50" header={<NavigationHeader backTo={Pages.HOME} />}>
        <div className="px-6 w-full max-w-[600px] mx-auto">
          <div className="py-6 border-b">
            <h1 className="text-2xl font-bold text-center">Profile</h1>
          </div>

          <div className="py-6 space-y-6">
            {user ? (
              <>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-sm font-medium text-gray-500 mb-2">
                    Email
                  </h2>
                  <p className="text-lg text-gray-900">{user.email}</p>
                </div>

                <button
                  onClick={handleSignOut}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">You are not signed in</p>
                <a
                  href="/login"
                  className="inline-block bg-[#0082cb] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#006ba6] transition-colors no-underline"
                >
                  Sign In
                </a>
              </div>
            )}
          </div>
        </div>
      </ScrollablePageLayout>
    </LoggedInUserWrapper>
  );
}
