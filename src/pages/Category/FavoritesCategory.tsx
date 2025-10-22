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
import ScrollablePageLayout from "@/components/ScrollablePageLayout";
import LoginPrompt from "@/layout/LoginPrompt";

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
        <ScrollablePageLayout
          variant="50"
          header={<NavigationHeader backTo={Pages.HOME} />}
        >
          <div className="px-6 w-full h-full max-w-[600px] mx-auto flex-1 flex items-center justify-center">
            <LoginPrompt returnTo="/category/favorites" />
          </div>
        </ScrollablePageLayout>
      </LoggedInUserWrapper>
    );
  }

  const handleOnReorder = async (items: Reorderable[]) => {
    await reorderReorderable(items, "favorites");
  };

  return (
    <LoggedInUserWrapper>
      <ScrollablePageLayout
        variant="50"
        header={<NavigationHeader backTo={Pages.HOME} />}
      >
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
      </ScrollablePageLayout>
    </LoggedInUserWrapper>
  );
}
