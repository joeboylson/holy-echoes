import { Link, useLocation } from "react-router-dom";
import { House, Heart, MagnifyingGlass, User } from "@phosphor-icons/react";

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { to: "/home", icon: House },
    { to: "/category/favorites", icon: Heart },
    { to: "/search", icon: MagnifyingGlass },
    { to: "/profile", icon: User },
  ];

  const isActive = (path: string) => {
    if (path === "/home") {
      return location.pathname === "/home" || location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex justify-around items-center h-16 max-w-[600px] mx-auto">
        {navItems.map(({ to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center justify-center flex-1 h-full no-underline transition-colors ${
              isActive(to)
                ? "text-[#0082cb]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon size={28} weight="bold" />
          </Link>
        ))}
      </div>
    </nav>
  );
}
