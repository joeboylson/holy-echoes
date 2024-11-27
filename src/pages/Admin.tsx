import styled from "styled-components";
import PrayerList from "../layout/PrayerList";
import PrayerBlockEditor from "../layout/PrayerBlockEditor";
import PrayerBlockPreview from "../layout/PrayerBlockPreview";
import { useParams } from "react-router-dom";

const StyledAdmin = styled.div`
  width: 100vw;
  height: 100vh;

  display: grid;
  grid-template-columns: 500px 1fr 500px;
  grid-template-rows: 1fr;
`;

export default function Admin() {
  const { prayerId } = useParams();

  return (
    <StyledAdmin>
      <PrayerList allowAdmin />

      {prayerId && (
        <>
          <PrayerBlockEditor />
          <PrayerBlockPreview />
        </>
      )}
    </StyledAdmin>
  );
}
