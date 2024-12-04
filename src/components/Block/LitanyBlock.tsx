import { orderBy } from "lodash";
import { PrayerBlock } from "../../database";
import { LitanyWrapper } from "./StyledComponents";
import { CSSProperties } from "react";
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
}

export default function LitanyBlock({ prayerBlock }: _props) {
  const orderedLitanyBlocks = orderBy(prayerBlock?.litanyBlocks, "order");

  return (
    <LitanyWrapper>
      {orderedLitanyBlocks.map((i) => {
        const { call, response, superscript, inline } = i;
        const responseStyle = { textIndent: "50px" } as CSSProperties;

        if (!call && !response && !superscript) return <span />;

        if (inline)
          return (
            <p>
              {`${call} ${response}`}
              <sup>{superscript}</sup>
            </p>
          );

        return (
          <IndentedResponseWrapper>
            <p>
              {`${call}`}
              <sup>&nbsp;{superscript}</sup>
            </p>
            <IndentedResponse>{response}</IndentedResponse>
          </IndentedResponseWrapper>
        );
      })}
    </LitanyWrapper>
  );
}
