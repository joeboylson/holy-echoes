import useSeasons from "@/hooks/useSeasons";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function HomeHeroImage() {
  const { currentSeason } = useSeasons();

  if (!currentSeason?.file?.url) return null;

  return (
    <AspectRatio ratio={16 / 9}>
      <div
        className="relative overflow-hidden w-full h-full sm:rounded-lg"
        style={{
          backgroundImage: `url("${currentSeason.file.url}")`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      />
    </AspectRatio>
  );
}
