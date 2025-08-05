import { Link } from "react-router-dom";
import styled from "styled-components";

export const PRAYER_HEADER_HEIGHT = 36 + 16;

export const StyledPrayer = styled.div`
  width: 100vw;
  height: var(--window-height);
  display: grid;
  grid-template-columns: 1fr;
  margin: 0 auto;
  align-content: start;
  justify-items: left;
  overflow-y: hidden;
`;

export const PrayerHeader = styled.div`
  padding: 8px 12px;
  width: 100%;
  height: ${PRAYER_HEADER_HEIGHT}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0082cb;

  box-shadow: 0 1px 1px hsl(0deg 0% 0% / 0.075),
    0 2px 2px hsl(0deg 0% 0% / 0.075), 0 4px 4px hsl(0deg 0% 0% / 0.075),
    0 8px 8px hsl(0deg 0% 0% / 0.075), 0 16px 16px hsl(0deg 0% 0% / 0.075);
  z-index: +1;
`;

export const BackLink = styled(Link)`
  display: grid;
  grid-template-columns: 16px 1fr;
  gap: 8px;
  align-items: center;
  background-color: transparent;
  padding: 0 16px;
  color: white;
`;

export const PrayerBlockPagination = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 24px);
  gap: 24px;
  align-items: center;
  height: 24px;
`;
