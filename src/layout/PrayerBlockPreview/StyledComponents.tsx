import styled from "styled-components";

export const StyledPrayerBlockPreview = styled.div`
  width: 100%;
  height: calc(100vh - 108px);
  background-color: #fff;
  align-content: start;
  overflow-x: hidden;
  overflow-y: auto;
  padding-right: 16px;
  padding-bottom: 16px;
`;

export const PrayerBlocksWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  padding-bottom: 64px;
`;
