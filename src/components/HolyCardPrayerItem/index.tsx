import { Link } from "react-router-dom";
import usePrayer from "@/hooks/usePrayer";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import PrayerPreviewScaled from "@/components/PrayerPreviewScaled";

interface HolyCardPrayerItemProps {
  prayerId: string;
}

export default function HolyCardPrayerItem({
  prayerId,
}: HolyCardPrayerItemProps) {
  const { prayer, prayerLoading } = usePrayer(prayerId, undefined, false, true);

  if (prayerLoading || !prayer) {
    return (
      <AspectRatio ratio={2 / 3}>
        <div className="w-full h-full bg-gray-100 rounded-lg animate-pulse" />
      </AspectRatio>
    );
  }

  return (
    <Link
      to={`/category/all-prayers/prayer/${prayerId}`}
      className="block no-underline"
    >
      <AspectRatio ratio={2 / 3}>
        <div className="relative w-full h-full bg-white rounded-lg border border-gray-200 border-[2px] overflow-hidden">
          {/* Prayer preview background */}
          <div className="absolute inset-0 overflow-hidden p-2">
            <PrayerPreviewScaled
              prayerId={prayerId}
              scale={0.4}
              maxBlocks={3}
            />
          </div>

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

          {/* Prayer title overlay */}
          <div className="absolute inset-0 flex items-center justify-center p-6 z-10">
            <h3 className="text-center text-[18px] font-bold text-white leading-tight">
              {prayer.name}
            </h3>
          </div>
        </div>
      </AspectRatio>
    </Link>
  );
}
