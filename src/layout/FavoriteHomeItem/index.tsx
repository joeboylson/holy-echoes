import useUserFavorites from "@/hooks/useUserFavorites";
import { Link } from "react-router-dom";

export default function FavoriteHomeItem() {
  const { favorites } = useUserFavorites();

  return (
    <Link
      key={"all"}
      to="/category/favorites"
      className="flex flex-col justify-between p-4 bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow no-underline text-gray-900 hover:text-gray-900"
    >
      <h2 className="text-lg font-semibold">Favorites</h2>
      <p className="text-sm text-gray-500 mt-1">{favorites.length} prayers</p>
    </Link>
  );
}
