import { Link } from "react-router-dom";
import styled from "styled-components";

export const StyledPrayer = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
  align-content: start;
  justify-items: left;
`;

export const PrayerHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const BackLink = styled(Link)`
  height: 36px;
  display: grid;
  grid-template-columns: 16px 1fr;
  gap: 8px;
  align-items: center;
  background-color: #eee;
  padding: 0 16px;
  border-radius: 8px;
`;

export const PrayerBlockPagination = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 24px);
  gap: 24px;
  align-items: center;
  height: 24px;
`;
