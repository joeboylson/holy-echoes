import styled from "styled-components";
import PrayerList from "../layout/PrayerList";

const StyledHome = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
  overflow-y: scroll;
`;

export default function Home() {
  return (
    <StyledHome data-id="StyledHome">
      <PrayerList />
    </StyledHome>
  );
}
