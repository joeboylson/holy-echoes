import { Link } from "react-router-dom";
import useSeasons from "@/hooks/useSeasons";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function FeaturedPrayersCarousel() {
  const { currentSeason } = useSeasons();

  if (!currentSeason) return null;

  const featuredPrayers = currentSeason.prayers ?? [];

  if (featuredPrayers.length === 0) return null;

  return (
    <div className="mb-6">
      {currentSeason.file?.url ? (
        <AspectRatio ratio={2 / 1} className="mb-4">
          <div
            className="relative rounded-lg overflow-hidden w-full h-full"
            style={{
              backgroundImage: `url("${currentSeason.file.url}")`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 bg-black/50" />
            <h2 className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white px-4 text-center z-10">
              {currentSeason.name}
            </h2>
          </div>
        </AspectRatio>
      ) : (
        <h2 className="text-xl font-bold mb-3">{currentSeason.name}</h2>
      )}

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full pb-12"
      >
        <CarouselContent>
          {featuredPrayers.map((prayer) => (
            <CarouselItem
              key={prayer.id}
              className="basis-4/5 md:basis-1/2 lg:basis-1/2"
            >
              <Link
                to={`/category/season/prayer/${prayer.id}`}
                className="block p-3 bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow no-underline text-gray-900 hover:text-gray-900"
              >
                <span className="font-medium">{prayer.name}</span>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 top-auto bottom-0 translate-y-0" />
        <CarouselNext className="right-0 top-auto bottom-0 translate-y-0" />
      </Carousel>
    </div>
  );
}
