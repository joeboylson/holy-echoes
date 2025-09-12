import { Heart } from "@phosphor-icons/react";
import useUserFavorites from "@/hooks/useUserFavorites";

interface FavoriteButtonProps {
  prayerId: string;
  className?: string;
}

export default function FavoriteButton({
  prayerId,
  className = "",
}: FavoriteButtonProps) {
  const {
    isFavorite,
    addFavorite,
    removeFavorite,
    getFavoriteByPrayerId,
    userIsNotGuest,
  } = useUserFavorites();

  if (!userIsNotGuest) {
    return null;
  }

  const isCurrentlyFavorited = isFavorite(prayerId);

  const handleToggleFavorite = async () => {
    try {
      if (isCurrentlyFavorited) {
        const favorite = getFavoriteByPrayerId(prayerId);
        if (favorite?.id) {
          await removeFavorite(favorite.id);
        }
      } else {
        await addFavorite(prayerId);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      className={`flex items-center justify-center rounded-full transition-colors !bg-transparent !border-0 !p-0 ${
        isCurrentlyFavorited
          ? "!text-red-600 !hover:bg-red-200"
          : "!text-gray-600 !hover:bg-gray-200"
      } ${className}`}
      title={
        isCurrentlyFavorited ? "Remove from favorites" : "Add to favorites"
      }
    >
      <Heart size={20} weight={isCurrentlyFavorited ? "fill" : "regular"} />
    </button>
  );
}
