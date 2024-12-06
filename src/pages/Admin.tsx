import styled from "styled-components";
import PrayerList from "../layout/PrayerList";
import PrayerBlockEditor from "../layout/PrayerBlockEditor";
import PrayerBlockPreview from "../layout/PrayerBlockPreview";
import AuthenticatedWrapper from "../layout/AuthenticatedWrapper";
import { useWindowSize } from "@uidotdev/usehooks";
import WindowTooSmall from "../components/WindowTooSmall";
import { CaretLeft, CaretRight, Sidebar } from "@phosphor-icons/react";
import { useState } from "react";

const StyledAdmin = styled.div`
  width: calc(100vw - 48px);
  height: calc(100vh - 48px - 24px - 50px - 12px);
  padding: 24px;
  display: grid;
  grid-template-columns: 300px 1fr 400px;
  gap: 12px;
  overflow: hidden;

  &.hide-prayer-list {
    grid-template-columns: 24px 1fr 400px;
  }
`;

const PrayerListWrapper = styled.div`
  border-right: 1px solid #ddd;
  padding-right: 12px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  align-content: start;

  &.hide-prayer-list {
    border: 0;
  }
`;

const TogglePrayerListButton = styled.button`
  padding: 0;
  margin: 0;
  background-color: transparent;
  border: none;
  width: 24px;
  height: 24px;
`;

export default function Admin() {
  const [hidePrayerList, setHidePrayerList] = useState<boolean>(false);
  const togglePrayerList = () => setHidePrayerList((_hide) => !_hide);

  const size = useWindowSize();
  const className = hidePrayerList ? "hide-prayer-list" : "";
  if ((size.width ?? 0) < 1200) return <WindowTooSmall />;

  return (
    <AuthenticatedWrapper>
      <StyledAdmin className={className}>
        <PrayerListWrapper className={className}>
          <TogglePrayerListButton onClick={togglePrayerList}>
            {hidePrayerList ? (
              <CaretRight size={24} color="var(--blue-10)" weight="bold" />
            ) : (
              <CaretLeft size={24} color="var(--blue-10)" weight="bold" />
            )}
          </TogglePrayerListButton>
          {!hidePrayerList && <PrayerList filterUnpublished={false} />}
        </PrayerListWrapper>
        <PrayerBlockEditor />
        <PrayerBlockPreview filterUnpublished={false} />
      </StyledAdmin>
    </AuthenticatedWrapper>
  );
}
