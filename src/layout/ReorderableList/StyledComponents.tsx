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

  &.is-hovered-over {
    &::after {
      content: "";
      display: block;
      position: absolute;
      top: 8px;
      right: 0;
      width: calc(100% - 96px);
      height: 4px;
      border-radius: 4px;
      background-color: black;
      margin: 24px;
    }
  }

  &.is-dragged {
    opacity: 0.1;
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
