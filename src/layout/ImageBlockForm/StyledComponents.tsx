import { BlockTypes } from "@/database";
import styled from "styled-components";

export const BlockInputCurrentImageWrapper = styled.div<{
  blocktype?: string;
}>`
  display: grid;
  place-items: center;
  background-color: white;
  position: relative;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.1);

  img {
    max-width: 200px;
    padding: 24px;
  }

  button {
    position: absolute;
    top: 12px;
    right: 12px;
  }

  ${(props) =>
    props.blocktype === BlockTypes.ICON &&
    `
    img {
      width: 84px;
    }  
  `};
`;

export const BlockInputImage = styled.input`
  border: 0;
  outline: none;
  padding: 12px;
  height: fit-content;

  &::file-selector-button {
    width: 100%;
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
