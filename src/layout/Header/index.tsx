import { useContext } from "react";
import { UserContext } from "../AuthenticatedWrapper";
import styled from "styled-components";
import { db } from "../../database";
import { useNavigate } from "react-router-dom";
import { Pages } from "../App";

const StyledHeader = styled.div`
  background-color: #ddd;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr 100px;
  align-items: center;
  height: 50px;
`;

export default function Header() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleLogout = () => {
    db.auth.signOut();
    navigate(Pages.LOGIN);
  };

  return (
    <StyledHeader>
      <p>{user?.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </StyledHeader>
  );
}
