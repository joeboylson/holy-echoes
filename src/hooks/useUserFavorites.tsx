import { db } from "@/database";
import { id, lookup } from "@instantdb/react";
import { useLoggedInUser } from "./useLoggedInUser";

interface UseUserFavoritesOptions {
  skip?: boolean;
}

export default function useUserFavorites({
  skip = false,
}: UseUserFavoritesOptions = {}) {
  const { user } = useLoggedInUser();

  const { data, isLoading } = db.useQuery(
    !skip
      ? {
          favorites: {
            $: {
              order: {
                order: "asc",
              },
            },
            prayer: {},
          },
        }
      : null
  );

  const favorites = data?.favorites ?? [];

  const addFavorite = async (prayerId: string) => {
    if (!user?.email) {
      throw new Error("User must be authenticated to add favorites");
    }

    const favoriteId = id();
    const maxOrder =
      favorites.length > 0
        ? Math.max(...favorites.map((f) => f.order || 0)) + 1
        : 1;

    await db.transact([
      db.tx.favorites[favoriteId].create({ order: maxOrder }),
      db.tx.favorites[favoriteId].link({
        owner: lookup("email", user.email),
        prayer: prayerId,
      }),
    ]);

    return favoriteId;
  };

  const userIsNotGuest = !!user?.id;

  const removeFavorite = async (favoriteId: string) => {
    await db.transact(db.tx.favorites[favoriteId].delete());
  };

  const isFavorite = (prayerId: string): boolean => {
    return favorites.some((favorite) => favorite.prayer?.id === prayerId);
  };

  const getFavoriteByPrayerId = (prayerId: string) => {
    return favorites.find((favorite) => favorite.prayer?.id === prayerId);
  };

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoriteByPrayerId,
    userIsNotGuest,
  };
}
