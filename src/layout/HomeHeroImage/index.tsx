import useSeasons from "@/hooks/useSeasons";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function HomeHeroImage() {
  const { currentSeason } = useSeasons();

  if (!currentSeason?.file?.url) return null;

  return (
    <AspectRatio ratio={2 / 1}>
      <div
        className="relative overflow-hidden w-full h-full"
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
