import styled, { css } from "styled-components";

const dragAndDropStyling = css`
  [data-swapy-highlighted] {
    background-color: rgba(0, 0, 0, 0.25);
  }

  [data-swapy-dragging] {
    background-color: rgba(0, 0, 0, 0.1);
  }

  [data-swapy-handle] {
    width: 24px;
    height: 24px;
    cursor: ns-resize;
    padding-top: 2px;
  }
`;

const swapyItemStyling = css`
  .item {
    display: grid;
    grid-template-columns: 1fr 24px;
    gap: 8px;
    align-items: center;

    &.disabled {
      grid-template-columns: 1fr;
    }
  }
`;

export const StyledReorderableContainer = styled.div`
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  ${dragAndDropStyling}
  ${swapyItemStyling}
`;
