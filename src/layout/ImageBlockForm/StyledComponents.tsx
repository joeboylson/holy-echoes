import { BlockTypes } from "@/database";
import styled from "styled-components";

export const BlockInputCurrentImageWrapper = styled.div<{
  blocktype?: BlockTypes;
}>`
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 12px;

  ${(props) =>
    props.blocktype === BlockTypes.ICON &&
    `
    img {
      width: 36px;
    }  
  `}
`;

export const BlockInputImage = styled.input`
  border: 0;
  outline: none;

  &::file-selector-button {
    width: calc(100% - 36px);
    height: 32px;
    border: 1px solid #888;
    border-radius: 8px;
    outline: none;
    color: #555;
    background-color: #ddd;
    padding: 0 12px;
    display: grid;
    place-items: center;

    &:disabled {
      opacity: 0.25;
      cursor: not-allowed;
    }
  }
`;
