import styled from "styled-components";

export const StyledPrayerControls = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4px;
`;

export const ControlRowWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4px;
  background-color: white;
  padding: 12px 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

export const ControlRow = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 4px;
  height: 32px;
  align-items: center;
`;
