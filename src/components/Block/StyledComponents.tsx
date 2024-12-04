import styled, { css } from "styled-components";

const OLG_GLORY_BLUE = "#0A3161";
const BASE_TEXT = "#000000";

const BASE_SIZE = "16px";
const TITLE_SIZE = "20px";
const SMALL_SIZE = "12px";

export const BaseBlockCSS = css`
  min-height: 16px;
  color: ${BASE_TEXT};
  font-size: ${BASE_SIZE};

  * {
    font-family: "Neuton", serif !important;
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
  color: ${OLG_GLORY_BLUE};
`;

export const InfoText = styled.div`
  ${BaseBlockCSS}
  font-size: ${SMALL_SIZE};
  text-align: center;
`;

export const Reference = styled.div`
  ${BaseBlockCSS}
  font-size: ${SMALL_SIZE};
  text-align: center;
  font-style: italic;
  font-weight: 100;
`;

export const Quote = styled.div`
  ${BaseBlockCSS}
  font-size: ${SMALL_SIZE};
  font-style: italic;
  font-weight: 100;

  display: grid;
  :nth-child(2) {
    justify-self: end;
  }
`;

export const BlockImage = styled.img`
  width: 100%;
`;

export const BlockImageSmall = styled.img`
  width: calc(100% * 0.68);
  margin: 0 auto;
`;

export const LitanyWrapper = styled.div`
  ${BaseBlockCSS}
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`;
