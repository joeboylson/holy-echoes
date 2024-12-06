import { TrashSimple } from "@phosphor-icons/react";
import styled from "styled-components";

const StyledDeleteButton = styled.button`
  display: flex;
  align-items: center;
  background-color: var(--red-10);
  color: white;
  border: 0;
  outline: none;
  padding: 8px 16px;
  border-radius: 8px;
  place-items: center;
  width: fit-content;

  > span {
    padding-right: 8px;
  }
`;

interface _props {
  itemName: string;
  onClick: () => void;
}

export default function DeleteButton({ itemName, onClick }: _props) {
  return (
    <StyledDeleteButton onClick={onClick}>
      <span>Delete {itemName}</span>
      <TrashSimple size={16} />
    </StyledDeleteButton>
  );
}
