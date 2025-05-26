import { SpinnerIcon } from "@phosphor-icons/react";
import styled from "styled-components";

const StyledLoadingIcon = styled.div`
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  padding: 24px 0;
  animation: spin 2s linear infinite;
`;

export default function LoadingIcon() {
  return (
    <StyledLoadingIcon data-id="LoadingIcon">
      <SpinnerIcon size={32} />
    </StyledLoadingIcon>
  );
}
