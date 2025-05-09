import { orderBy } from "lodash";
import { PrayerBlock } from "../../database";
import { TwoColumnWrapper } from "./StyledComponents";

interface _props {
  prayerBlock: PrayerBlock;
  className?: string;
}

export default function TwoColumnBlock({ prayerBlock, className }: _props) {
  const orderedTwoColumnBlocks = orderBy(prayerBlock?.litanyBlocks, "order");

  return (
    <TwoColumnWrapper data-id="TwoColumnWrapper" className={className}>
      {orderedTwoColumnBlocks.map((i) => {
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
