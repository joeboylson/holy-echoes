import { UserContext } from "@/layout/AdminAccessWrapper";
import { useContext } from "react";

export const useLoggedInUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useStatusBar must be used within a StatusBarProvider");
  }
  return context;
};
