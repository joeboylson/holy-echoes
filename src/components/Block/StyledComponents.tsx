import styled, { css } from "styled-components";

// const OLG_GLORY_BLUE = "#0A3161";
const BASE_TEXT = "#2c2c2c";

const BASE_SIZE = "21px";
const TITLE_SIZE = "34px";
const SMALL_SIZE = "16px";

const LINE_HEIGHT_RATIO_TITLE = 1.1;
const LINE_HEIGHT_RATIO_TEXT = 1.3;

export const BaseBlockCSS = css`
  min-height: 16px;
  color: ${BASE_TEXT};
  font-size: ${BASE_SIZE};
  line-height: calc(${BASE_SIZE} * ${LINE_HEIGHT_RATIO_TEXT});

  * {
    font-family: "Neuton", serif !important;
  }

  &.space-above {
    padding-top: 24px !important;
  }
`;

export const Body = styled.div`
  ${BaseBlockCSS}
`;

export const BodyCentered = styled.div`
  ${BaseBlockCSS}
  text-align: center;
`;

export const CenteredTitle = styled.h1`
  ${BaseBlockCSS}
  text-align: center;
  font-size: ${TITLE_SIZE};
  line-height: calc(${TITLE_SIZE} * ${LINE_HEIGHT_RATIO_TITLE});
  color: ${BASE_TEXT};
`;

export const InfoText = styled.div`
  ${BaseBlockCSS}
  font-size: ${SMALL_SIZE};
  line-height: calc(${SMALL_SIZE} * ${LINE_HEIGHT_RATIO_TEXT});
  text-align: center;
`;

export const Reference = styled.div`
  ${BaseBlockCSS}
  font-size: ${SMALL_SIZE};
  line-height: calc(${SMALL_SIZE} * ${LINE_HEIGHT_RATIO_TEXT});
  text-align: center;
  font-style: italic;
  font-weight: 100;
`;

export const Quote = styled.div`
  ${BaseBlockCSS}
  font-size: ${SMALL_SIZE};
  line-height: calc(${SMALL_SIZE} * ${LINE_HEIGHT_RATIO_TEXT});
  font-style: italic;
  font-weight: 100;

  display: grid;
  :nth-child(2) {
    justify-self: end;
  }
`;

export const BlockImage = styled.img`
  ${BaseBlockCSS}
  width: 100%;
`;

export const BlockImageSmall = styled.img`
  ${BaseBlockCSS}
  width: calc(100% * 0.68);
  margin: 0 auto;
`;

export const BlockImageIcon = styled.img`
  ${BaseBlockCSS}
  width: 36px;
  margin: 0 auto;
`;

export const LitanyWrapper = styled.div`
  ${BaseBlockCSS}
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  p {
    line-height: calc(21px * 1.1);
  }
`;

export const BlockSpacer = styled.div<{ height: string }>`
  height: ${(props) => props.height}px;
`;
