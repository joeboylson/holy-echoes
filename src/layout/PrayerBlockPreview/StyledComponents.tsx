import styled from "styled-components";

export const StyledPrayerBlockPreview = styled.div`
  width: 100%;
  height: calc(100vh - 48px - 24px - 50px - 12px);
  background-color: #fff;
  align-content: start;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const PrayerBlocksWrapper = styled.div`
  height: fit-content;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  padding-bottom: 100px;
`;
