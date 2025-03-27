import styled from "styled-components";
import PrayerList from "../layout/PrayerList";

const StyledHome = styled.div`
  width: calc(100vw - 48px);
  height: calc(100vh - 48px);
  display: grid;
  grid-template-columns: 1fr;
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
  overflow-y: auto;
`;

export default function Home() {
  return (
    <StyledHome>
      <PrayerList />
    </StyledHome>
  );
}
