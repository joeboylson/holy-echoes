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
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[oklch(0.22_0_0)] sepia:bg-[oklch(0.95_0.015_80)] border-t border-gray-200 dark:border-[oklch(0.3_0_0)] sepia:border-[oklch(0.82_0.02_75)] z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex justify-around items-center h-16 max-w-[600px] mx-auto">
        {navItems.map(({ to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center justify-center flex-1 h-full no-underline transition-colors ${
              isActive(to)
                ? "text-[#0082cb] dark:text-[oklch(0.5_0.12_240)] sepia:text-[oklch(0.35_0.03_65)]"
                : "text-gray-500 dark:text-gray-400 sepia:text-[oklch(0.5_0.02_65)] hover:text-gray-700 dark:hover:text-gray-300 sepia:hover:text-[oklch(0.35_0.02_60)]"
            }`}
          >
            <Icon size={28} weight="bold" />
          </Link>
        ))}
      </div>
    </nav>
  );
}
