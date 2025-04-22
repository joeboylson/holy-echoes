import { orderBy } from "lodash";
import { PrayerBlock } from "../../database";
import { LitanyWrapper } from "./StyledComponents";
import styled from "styled-components";

const IndentedResponseWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
`;

const IndentedResponse = styled.p`
  text-indent: 24px;
`;

interface _props {
  prayerBlock: PrayerBlock;
  className?: string;
}

export default function LitanyBlock({ prayerBlock, className }: _props) {
  const orderedLitanyBlocks = orderBy(prayerBlock?.litanyBlocks, "order");

  return (
    <LitanyWrapper data-id="LitanyWrapper" className={className}>
      {orderedLitanyBlocks.map((i) => {
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
          <IndentedResponseWrapper>
            <p>
              {`${call}`}
              <sup>&nbsp;{superscript}</sup>
            </p>
            <IndentedResponse>{response ?? ""}</IndentedResponse>
          </IndentedResponseWrapper>
        );
      })}
    </LitanyWrapper>
  );
}
