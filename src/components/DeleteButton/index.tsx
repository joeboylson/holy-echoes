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

const StyledDeleteIconButton = styled.button`
  background-color: transparent;
  margin: 0;
  padding: 0;
  width: 20px;
  height: 20px;
  border: none;
  outline: none;
`;

interface _props {
  itemName: string;
  onClick: () => void;
  icon?: boolean;
}

export default function DeleteButton({
  itemName,
  onClick,
  icon = false,
}: _props) {
  if (icon) {
    return (
      <StyledDeleteIconButton onClick={onClick}>
        <TrashSimple size={20} weight="duotone" color="var(--red-10)" />
      </StyledDeleteIconButton>
    );
  }

  return (
    <StyledDeleteButton onClick={onClick}>
      <span>Delete {itemName}</span>
      <TrashSimple size={16} />
    </StyledDeleteButton>
  );
}
