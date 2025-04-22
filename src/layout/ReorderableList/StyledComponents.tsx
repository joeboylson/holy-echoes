import styled from "styled-components";

export const StyledReorderableContainer = styled.div`
  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  [data-swapy-highlighted] {
    background-color: rgba(0, 0, 0, 0.25);
  }

  [data-swapy-dragging] {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .item {
    display: grid;
    grid-template-columns: 1fr 24px;
    gap: 8px;
    align-items: center;
  }

  [data-swapy-handle] {
    width: 24px;
    height: 24px;
    cursor: ns-resize;
  }
`;
