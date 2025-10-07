import { useEffect, useContext } from "react";
import { useStatusBar } from "@/contexts/StatusBarContext";
import LoggedInUserWrapper from "@/layout/LoggedInUserWrapper";
import NavigationHeader from "@/components/NavigationHeader";
import { Pages } from "@/layout/App/router";
import { db } from "@/database";
import { UserContext } from "@/layout/AdminAccessWrapper";
import { useTheme, ThemeName } from "@/contexts/ThemeContext";
import { useFontSize, FontSizeName } from "@/contexts/FontSizeContext";

export default function Profile() {
  const { setStatusBarColor } = useStatusBar();
  const { user } = useContext(UserContext);
  const { theme, setTheme } = useTheme();
  const { fontSize, setFontSize } = useFontSize();

  useEffect(() => {
    setStatusBarColor("#0082cb");
  }, [setStatusBarColor]);

  const handleSignOut = () => {
    db.auth.signOut();
  };

  return (
    <LoggedInUserWrapper>
      <div className="w-screen grid grid-cols-1 mx-auto gap-3 h-full content-start">
        <NavigationHeader backTo={Pages.HOME} />

        <div className="px-6 w-full max-w-[600px] mx-auto pb-24">
          <div className="py-6 border-b">
            <h1 className="text-2xl font-bold text-center">Profile</h1>
          </div>

          <div className="py-6 space-y-6">
            <div className="bg-white dark:bg-gray-800 sepia:bg-[oklch(0.95_0.015_80)] border border-gray-200 dark:border-gray-700 sepia:border-[oklch(0.82_0.02_75)] rounded-lg p-6">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 sepia:text-[oklch(0.5_0.02_65)] mb-2">
                Theme
              </h2>
              <div className="flex gap-3">
                {(["light", "dark", "sepia"] as ThemeName[]).map((themeName) => (
                  <button
                    key={themeName}
                    onClick={() => setTheme(themeName)}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                      theme === themeName
                        ? "bg-[#0082cb] text-white"
                        : "bg-gray-100 dark:bg-gray-700 sepia:bg-[oklch(0.88_0.02_75)] text-gray-900 dark:text-white sepia:text-[oklch(0.25_0.02_60)] hover:bg-gray-200 dark:hover:bg-gray-600 sepia:hover:bg-[oklch(0.85_0.02_75)]"
                    }`}
                  >
                    {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 sepia:bg-[oklch(0.95_0.015_80)] border border-gray-200 dark:border-gray-700 sepia:border-[oklch(0.82_0.02_75)] rounded-lg p-6">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 sepia:text-[oklch(0.5_0.02_65)] mb-2">
                Text Size
              </h2>
              <div className="flex gap-3">
                {(["small", "medium", "large"] as FontSizeName[]).map((sizeName) => (
                  <button
                    key={sizeName}
                    onClick={() => setFontSize(sizeName)}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                      fontSize === sizeName
                        ? "bg-[#0082cb] text-white"
                        : "bg-gray-100 dark:bg-gray-700 sepia:bg-[oklch(0.88_0.02_75)] text-gray-900 dark:text-white sepia:text-[oklch(0.25_0.02_60)] hover:bg-gray-200 dark:hover:bg-gray-600 sepia:hover:bg-[oklch(0.85_0.02_75)]"
                    }`}
                  >
                    {sizeName.charAt(0).toUpperCase() + sizeName.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {user ? (
              <>
                <div className="bg-white dark:bg-gray-800 sepia:bg-[oklch(0.95_0.015_80)] border border-gray-200 dark:border-gray-700 sepia:border-[oklch(0.82_0.02_75)] rounded-lg p-6">
                  <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 sepia:text-[oklch(0.5_0.02_65)] mb-2">
                    Email
                  </h2>
                  <p className="text-lg text-gray-900 dark:text-white sepia:text-[oklch(0.25_0.02_60)]">
                    {user.email}
                  </p>
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
                <p className="text-gray-600 dark:text-gray-400 sepia:text-[oklch(0.5_0.02_65)] mb-4">
                  You are not signed in
                </p>
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
      </div>
    </LoggedInUserWrapper>
  );
}
