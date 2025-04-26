import styled from "styled-components";
import PrayerList from "../layout/PrayerList";
import PrayerBlockEditor from "../layout/PrayerBlockEditor";
import PrayerBlockPreview from "../layout/PrayerBlockPreview";
import AuthenticatedWrapper from "../layout/AuthenticatedWrapper";
import { useWindowSize } from "@uidotdev/usehooks";
import WindowTooSmall from "../components/WindowTooSmall";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useState } from "react";
import { HEADER_HEIGHT } from "@/constants/layout";

const StyledAdmin = styled.div`
  padding: 24px;
  width: 100vw;
  height: calc(100vh - ${HEADER_HEIGHT}px);
  display: grid;
  gap: 12px;
  overflow: hidden;

  &.hide-prayer-list {
    grid-template-columns: 24px 1fr 1fr;
  }

  grid-template-columns: repeat(3, 1fr);
  @media (max-width: 2200px) {
    grid-template-columns: 500px 1fr 500px;
  }

  @media (max-width: 1800px) {
    grid-template-columns: 350px 1fr 400px;
  }
`;

const PrayerListWrapper = styled.div`
  border-right: 1px solid #ddd;
  padding-right: 12px;
  padding-bottom: 48px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  align-content: start;
  height: calc(100vh - 48px - 24px;);
  overflow-y: auto;

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
    <AuthenticatedWrapper data-id="AuthenticatedWrapper">
      <StyledAdmin className={className} data-id="StyledAdmin">
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
