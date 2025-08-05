import styled from "styled-components";

const StyledWindowTooSmall = styled.div`
  width: 100vw;
  height: var(--header-height);
  display: grid;
  place-items: center;

  * {
    padding: 24px;
    max-width: 500px;
  }
`;

export default function WindowTooSmall() {
  return (
    <StyledWindowTooSmall>
      <p>
        It looks like your window is a bit too small to display this page
        properly.
        <br />
        <br />
        For the best experience, please resize your window or view this page on
        a larger screen.
        <br />
        <br />
        Thanks!
      </p>
    </StyledWindowTooSmall>
  );
}
