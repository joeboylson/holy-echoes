import { PrayerBlock } from "@schema";

interface _props {
  prayerBlock: PrayerBlock;
  className?: string;
}

export default function LitanyBlock({ prayerBlock, className }: _props) {
  const baseClass = className?.includes("space-above") ? "pt-6" : "";

  return (
    <div
      data-id="LitanyWrapper"
      className={`min-h-4 text-[#2c2c2c] text-[21px] leading-[27.3px] grid grid-cols-1 gap-4 [&>p]:leading-[23.1px] [&_*]:font-['Neuton',_serif] ${baseClass} ${className}`}
    >
      {(prayerBlock.litanyBlocks ?? []).map((i) => {
        const { call, response, superscript, inline } = i;

        if (!call && !response && !superscript) return <span />;

        if (inline)
          return (
            <p>
              {`${call} ${response ?? ""}`}
              <sup>{superscript}</sup>
            </p>
          );

        return (
          <div className="grid grid-cols-1">
            <p>
              {`${call}`}
              <sup>&nbsp;{superscript}</sup>
            </p>
            <p className="indent-6">{response ?? ""}</p>
          </div>
        );
      })}
    </div>
  );
}
