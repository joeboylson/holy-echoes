import styled from "styled-components";
import PrayerList from "../layout/PrayerList";
import PrayerBlockEditor from "../layout/PrayerBlockEditor";
import PrayerBlockPreview from "../layout/PrayerBlockPreview";
import AuthenticatedWrapper from "../layout/AuthenticatedWrapper";
import { useWindowSize } from "@uidotdev/usehooks";
import WindowTooSmall from "../components/WindowTooSmall";

const StyledAdmin = styled.div`
  width: calc(100vw - 48px);
  height: calc(100vh - 48px - 24px - 50px - 12px);
  padding: 24px;
  display: grid;
  grid-template-columns: 300px 1fr 400px;
  gap: 12px;
  overflow: hidden;
`;

export default function Admin() {
  const size = useWindowSize();

  if ((size.width ?? 0) < 1200) return <WindowTooSmall />;

  return (
    <AuthenticatedWrapper>
      <StyledAdmin>
        <PrayerList filterUnpublished={false} />
        <PrayerBlockEditor />
        <PrayerBlockPreview filterUnpublished={false} />
      </StyledAdmin>
    </AuthenticatedWrapper>
  );
}
