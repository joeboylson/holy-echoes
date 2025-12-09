import { useContext } from "react";
import { UserContext } from "../AdminAccessWrapper";
import { db } from "@/database";
import { NavLink, useNavigate } from "react-router-dom";
import { Pages } from "../App/router";
import { HEADER_HEIGHT } from "@/constants/layout";
import { Button } from "@/components/ui/button";

export default function Header() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleLogout = () => {
    db.auth.signOut();
    navigate(Pages.LOGIN);
  };

  return (
    <header
      className="bg-[#0082cb] px-6 grid grid-cols-[1fr_100px] items-center text-white"
      style={{ height: `${HEADER_HEIGHT}px` }}
      data-id="StyledHeader"
    >
      <div className="flex gap-9">
        <p className="font-extrabold text-white">{user?.email}</p>
        <nav className="flex gap-3">
          <NavLink
            to={Pages.ADMIN}
            className="text-white hover:text-white [&.active]:underline"
          >
            Prayer Dashboard
          </NavLink>
          <NavLink
            to={Pages.CONFIG}
            className="text-white hover:text-white [&.active]:underline"
          >
            Configuration
          </NavLink>
          <NavLink
            to={Pages.ALL_PRAYER_BLOCKS}
            className="text-white hover:text-white [&.active]:underline"
          >
            All Prayer Blocks
          </NavLink>
        </nav>
      </div>
      <Button variant="outline" onClick={handleLogout}>
        Logout
      </Button>
    </header>
  );
}
