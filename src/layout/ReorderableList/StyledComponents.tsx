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
      left: 12px;
      width: 24px;
      height: 24px;
      background-color: rgba(255, 0, 0, 0.75);
      border-radius: 12px;
    }
  }

  &.is-dragged {
    opacity: 0.1;
    cursor: ns-resize;

    &::after {
      opacity: 0;
    }
  }

  &.is-disabled {
    grid-template-columns: 1fr 24px;
  }
`;
