import { PrayerBlock } from "@schema";

interface _props {
  prayerBlock: PrayerBlock;
  className?: string;
}

export default function TwoColumnBlock({ prayerBlock, className }: _props) {
  const baseClass = className?.includes("space-above") ? "pt-6" : "";

  return (
    <div
      data-id="TwoColumnWrapper"
      className={`min-h-4 text-[#2c2c2c] text-[21px] leading-[27.3px] grid grid-cols-2 gap-4 [&>p]:leading-[23.1px] [&_*]:font-['Neuton',_serif] ${baseClass} ${className}`}
    >
      {(prayerBlock.litanyBlocks ?? []).map((i) => {
        const { call, response } = i;

        return (
          <>
            <p>{call}</p>
            <p>{response}</p>
          </>
        );
      })}
    </div>
  );
}
