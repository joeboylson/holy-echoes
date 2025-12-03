import usePrayer from "@/hooks/usePrayer";
import Block from "@/components/Block";

interface PrayerPreviewScaledProps {
  prayerId: string;
  scale?: number;
  maxBlocks?: number;
  className?: string;
}

export default function PrayerPreviewScaled({
  prayerId,
  scale = 0.3,
  maxBlocks = 3,
  className = "",
}: PrayerPreviewScaledProps) {
  const { prayer, prayerLoading } = usePrayer(prayerId, undefined, false, true);

  if (prayerLoading || !prayer) {
    return null;
  }

  const blocksToShow = prayer.prayerBlocks?.slice(0, maxBlocks) ?? [];

  return (
    <div
      className={`origin-top-left ${className}`}
      style={{
        transform: `scale(${scale})`,
        width: `${100 / scale}%`,
        height: `${100 / scale}%`,
      }}
    >
      {blocksToShow.map((block) => (
        <Block key={block.id} prayerBlock={block} />
      ))}
    </div>
  );
}
