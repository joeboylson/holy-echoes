import styled from "styled-components";

export const StyledReorderableContainer = styled.div`
  overflow-y: auto;
  &.is-disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;

export const ReorderableItem = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 24px;
  align-items: center;
  overflow: visible;

  &.is-hovered-over {
    &::after {
      content: "";
      display: block;
      position: absolute;
      top: calc(50% - 12px);
      left: -4px;
      width: 24px;
      height: 24px;

      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M132.94,231.39A8,8,0,0,1,128,224V184H48a16,16,0,0,1-16-16V88A16,16,0,0,1,48,72h80V32a8,8,0,0,1,13.66-5.66l96,96a8,8,0,0,1,0,11.32l-96,96A8,8,0,0,1,132.94,231.39Z"/></svg>');
      background-size: contain;
      background-repeat: no-repeat;
    }
  }

  &.is-dragged {
    opacity: 0.1;
    background-color: rgba(0, 0, 0, 0.1);
    cursor: ns-resize;

    &::after {
      opacity: 0;
    }
  }
`;
