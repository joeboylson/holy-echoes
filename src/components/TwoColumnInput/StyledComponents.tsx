import styled from "styled-components";

export const TwoColumnRowWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  padding-top: 12px;
`;

export const StyledTwoColumnRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 36px;
  gap: 4px;
  align-items: center;
  justify-items: center;

  button {
    padding: 0;
    margin: 0;
    background-color: transparent;
    border: none;
  }

  &.header {
    padding-right: 32px;
  }
`;

export const RowHeader = styled.p`
  text-align: center;
`;
