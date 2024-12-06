import styled from "styled-components";

export const LitanyRowWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  padding-top: 12px;
`;

export const LitanyRow = styled.div`
  display: grid;
  grid-template-columns: 3fr 3fr 1fr 42px 20px 20px 20px;
  gap: 4px;

  button {
    padding: 0;
    margin: 0;
    background-color: transparent;
    border: none;
  }
`;

export const RowHeader = styled.p`
  font-size: 12px;
`;
