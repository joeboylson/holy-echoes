import styled from "styled-components";
import { useContext } from "react";
import { UserContext } from "../AdminAccessWrapper";
import { db } from "@/database";
import { NavLink, useNavigate } from "react-router-dom";
import { Pages } from "../App/router";
import { HEADER_HEIGHT } from "@/constants/layout";
import { Button } from "@/components/ui/button";

const StyledHeader = styled.div`
  background-color: #ddd;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr 100px;
  align-items: center;
  height: ${HEADER_HEIGHT}px;

  a {
    color: blue;
    &.active {
      text-decoration: underline;
    }
  }
`;

export default function Header() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleLogout = () => {
    db.auth.signOut();
    navigate(Pages.LOGIN);
  };

  return (
    <StyledHeader data-id="StyledHeader">
      <div className="flex gap-[36px]">
        <p>{user?.email}</p>
        <nav className="flex gap-[12px]">
          <NavLink to={Pages.ADMIN}>Prayer Dashboard</NavLink>
          <NavLink to={Pages.CONFIG}>Configuration</NavLink>
          <NavLink to={Pages.ALL_PRAYER_BLOCKS}>All Prayer Blocks</NavLink>
        </nav>
      </div>
      <Button variant="outline" onClick={handleLogout}>Logout</Button>
    </StyledHeader>
  );
}
