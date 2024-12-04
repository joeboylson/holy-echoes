import styled from "styled-components";
import PrayerBlockPreview from "../layout/PrayerBlockPreview";
import { Link, useParams } from "react-router-dom";
import { Pages } from "../layout/App";
import { ArrowLeft } from "@phosphor-icons/react";

const StyledPrayer = styled.div`
  width: calc(100vw - 48px);
  height: calc(100vh - 48px);
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
  align-content: start;
  justify-items: left;
`;

export default function Prayer() {
  const { prayerId } = useParams();

  return (
    <StyledPrayer>
      <Link to={Pages.HOME}>
        <ArrowLeft /> Back
      </Link>
      {prayerId && <PrayerBlockPreview />}
    </StyledPrayer>
  );
}
