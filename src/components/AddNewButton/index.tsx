import { Plus } from "@phosphor-icons/react";
import styled from "styled-components";

const StyledNewButton = styled.button`
  display: flex;
  align-items: center;
  background-color: #70e17b;
  color: #222222;
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

export default function AddNewButton({ itemName, onClick }: _props) {
  return (
    <StyledNewButton onClick={onClick}>
      <span>Add New {itemName}</span>
      <Plus size={16} color="#222222" />
    </StyledNewButton>
  );
}
