import { TwoColumnWrapper } from "./StyledComponents";
import { PrayerBlock } from "@schema";

interface _props {
  prayerBlock: PrayerBlock;
  className?: string;
}

export default function TwoColumnBlock({ prayerBlock, className }: _props) {
  return (
    <TwoColumnWrapper data-id="TwoColumnWrapper" className={className}>
      {(prayerBlock.litanyBlocks ?? []).map((i) => {
        const { call, response } = i;

        return (
          <>
            <p>{call}</p>
            <p>{response}</p>
          </>
        );
      })}
    </TwoColumnWrapper>
  );
}
