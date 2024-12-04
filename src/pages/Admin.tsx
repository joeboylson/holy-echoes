import styled from "styled-components";
import PrayerList from "../layout/PrayerList";
import PrayerBlockEditor from "../layout/PrayerBlockEditor";
import PrayerBlockPreview from "../layout/PrayerBlockPreview";

const StyledAdmin = styled.div`
  width: calc(100vw - 48px);
  height: calc(100vh - 48px);
  padding: 24px;
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  grid-template-rows: 1fr;
  gap: 36px;
  overflow: hidden;
`;

export default function Admin() {
  return (
    <StyledAdmin>
      <PrayerList filterUnpublished={false} />
      <PrayerBlockEditor />
      <PrayerBlockPreview filterUnpublished={false} />
    </StyledAdmin>
  );
}
