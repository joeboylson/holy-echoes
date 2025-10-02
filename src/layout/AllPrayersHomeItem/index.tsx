import usePrayers from "@/hooks/usePrayers";
import { Link } from "react-router-dom";

export default function AllPrayersHomeItem() {
  const { prayers } = usePrayers();

  return (
    <Link
      to="/category/all-prayers"
      className="flex flex-col justify-between p-4 bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow no-underline text-gray-900 hover:text-gray-900"
    >
      <h2 className="text-lg font-semibold">All Prayers</h2>
      <p className="text-sm text-gray-500 mt-1">{prayers.length} prayers</p>
    </Link>
  );
}
