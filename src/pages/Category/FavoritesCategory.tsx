import { useEffect } from "react";
import { useStatusBar } from "@/contexts/StatusBarContext";
import LoggedInUserWrapper from "@/layout/LoggedInUserWrapper";
import NavigationHeader from "@/components/NavigationHeader";
import { Pages } from "@/layout/App/router";
import useUserFavorites from "@/hooks/useUserFavorites";
import FavoritePrayerItem from "@/components/FavoritePrayerItem";
import { Reorderable, reorderReorderable } from "@/utils";
import { Favorite } from "@schema";
import ReorderableList from "@/layout/ReorderableList";

export default function FavoritesCategory() {
  const {
    favorites,
    isLoading: favoritesLoading,
    userIsNotGuest,
  } = useUserFavorites();

  const { setStatusBarColor } = useStatusBar();

  useEffect(() => {
    setStatusBarColor("#0082cb");
  }, [setStatusBarColor]);

  if (favoritesLoading) return <div>Loading...</div>;

  if (!userIsNotGuest) {
    return (
      <LoggedInUserWrapper>
        <div className="w-screen grid grid-cols-1 mx-auto gap-3 h-full content-start">
          <NavigationHeader backTo={Pages.HOME} />

          <div className="px-6 w-full max-w-[600px] mx-auto flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">
                Please log in to view favorites
              </h2>
              <p className="text-gray-600 mb-6">
                You need to be logged in to save and view your favorite prayers.
              </p>
              <button
                onClick={() =>
                  (window.location.href = `/login?returnTo=${encodeURIComponent(
                    "/category/favorites"
                  )}`)
                }
                className="bg-[#0082cb] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#006ba6] transition-colors"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </LoggedInUserWrapper>
    );
  }

  const handleOnReorder = async (items: Reorderable[]) => {
    await reorderReorderable(items, "favorites");
  };

  return (
    <LoggedInUserWrapper>
      <div className="w-screen grid grid-cols-1 mx-auto gap-3 h-full content-start">
        <NavigationHeader backTo={Pages.HOME} />

        <div className="px-6 w-full max-w-[600px] mx-auto">
          <div className="py-6 border-b">
            <h1 className="text-2xl font-bold text-center">Favorites</h1>
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No favorite prayers yet
            </div>
          ) : (
            <ReorderableList
              items={favorites}
              onReorder={handleOnReorder}
              enabled={true}
              renderItem={(item: Favorite) => (
                <FavoritePrayerItem favorite={item} />
              )}
            />
          )}
        </div>
      </div>
    </LoggedInUserWrapper>
  );
}
