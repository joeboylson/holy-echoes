import styled from "styled-components";

export const StyledPrayerBlockPreview = styled.div`
  .container {
    display: grid;
    width: 100%;
    height: calc(100vh - 36px - 48px);
    grid-template-rows: 1fr 24px;
    background-color: #fff;
    align-content: start;
    overflow-x: hidden;
    padding-right: 16px;
    padding-bottom: 16px;
  }

  &.with-pagination .container {
    height: calc(100vh - 36px - 48px - 50px);
  }
`;

export const PrayerBlockPagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
`;
