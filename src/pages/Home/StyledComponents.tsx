import styled from "styled-components";

export const CategoryButton = styled.button`
  transition-duration: 200ms;
  background-color: white;
  border: 1px solid var(--blue-10);
  color: var(--blue-10);

  &:hover,
  &.is-active {
    background-color: var(--blue-10);
    border: 1px solid var(--blue-10);
    color: white;
  }
`;
