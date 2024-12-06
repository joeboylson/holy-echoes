import { createContext } from "react";
import { User } from "@instantdb/react";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
import { WithChildren } from "../../types";
import { db } from "../../database";
import Header from "../Header";
import { Pages } from "../App";

const PageWrapper = styled.div`
  padding-top: 24px;
`;

interface UserContextType {
  user: User | undefined;
}

export const UserContext = createContext<UserContextType>({
  user: undefined,
});

export default function AuthenticatedWrapper({ children }: WithChildren) {
  const authState = db.useAuth();

  // TODO: improve loading screen
  if (authState.isLoading) return <p>Loading...</p>;

  // TODO: improve error message screen
  if (authState.error) return <code>{authState.error.message}</code>;
  if (!authState.user) return <Navigate to={Pages.LOGIN} />;

  return (
    <UserContext.Provider value={{ user: authState.user }}>
      <Header />
      <PageWrapper>{children}</PageWrapper>
    </UserContext.Provider>
  );
}
