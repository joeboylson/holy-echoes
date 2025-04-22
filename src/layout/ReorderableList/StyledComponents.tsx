import styled from "styled-components";

export const StyledReorderableContainer = styled.div`
  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  [data-swapy-highlighted] {
    background-color: rgba(0, 0, 255, 0.25);
  }

  [data-swapy-dragging] {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .item {
    position: relative;
  }

  [data-swapy-handle] {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    width: 24px;
    height: 24px;
    background-color: rgba(255, 255, 255, 0.75);
    background-color: red;
    display: grid;
    place-items: center;
    border-radius: 24px;
    height: inherit;
    z-index: 1;
  }
`;
