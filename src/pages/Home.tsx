import styled from "styled-components";
import PrayerList from "../layout/PrayerList";

const StyledHome = styled.div`
  width: 100vw;
  height: 100vh;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
`;

export default function Home() {
  return (
    <StyledHome>
      <PrayerList />
    </StyledHome>
  );
}
