import styled from "styled-components";
import PrayerBlockPreview from "../layout/PrayerBlockPreview";
import { Link, useParams } from "react-router-dom";
import { Pages } from "../layout/App";
import { ArrowLeft } from "@phosphor-icons/react";

const StyledPrayer = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
  align-content: start;
  justify-items: left;
`;

const BackLink = styled(Link)`
  height: 36px;
  display: grid;
  grid-template-columns: 16px 1fr;
  gap: 8px;
  align-items: center;
  background-color: #eee;
  padding: 0 16px;
  border-radius: 8px;
`;

export default function Prayer() {
  const { prayerId } = useParams();

  return (
    <StyledPrayer data-id="StyledPrayer">
      <BackLink to={Pages.HOME}>
        <ArrowLeft /> Back
      </BackLink>
      {prayerId && <PrayerBlockPreview />}
    </StyledPrayer>
  );
}
