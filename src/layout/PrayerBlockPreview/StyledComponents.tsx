import styled from "styled-components";
import { PRAYER_HEADER_HEIGHT } from "@/pages/Prayer/StyledComponents";

export const StyledPrayerBlockPreview = styled.div`
  height: calc(var(--header-height) - ${PRAYER_HEADER_HEIGHT}px);
  max-width: 600px;
  margin: auto;
  overflow-y: scroll;
  padding: 24px;

  .container {
    display: grid;
    width: 100%;
    grid-template-rows: 1fr 24px;
    background-color: #fff;
    align-content: start;
    overflow-x: hidden;
  }

  padding-bottom: 20vh;
`;
