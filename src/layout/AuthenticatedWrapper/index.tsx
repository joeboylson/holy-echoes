import { createContext, useMemo } from "react";
import { AuthState, User } from "@instantdb/react";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
import { WithChildren } from "../../types";
import { db, TableNames } from "../../database";
import Header from "../Header";
import { Pages } from "../App";
import { first, isEmpty } from "lodash";

const { $USERS, ADMIN } = TableNames;

const PageWrapper = styled.div`
  padding-top: 24px;
`;

interface UserContextType {
  user: User | null;
}

export const UserContext = createContext<UserContextType>({
  user: null,
});

export default function AuthenticatedWrapper({ children }: WithChildren) {
  const authState = db.useAuth();

  const userId = useMemo(() => {
    if (authState.user) return authState.user.id;
  }, [authState]);

  if (authState.isLoading) return <p>Loading...</p>;
  if (authState.error) return <code>{authState.error.message}</code>;
  if (!userId) return <Navigate to={Pages.LOGIN} />;

  return (
    <AuthenticatedWrapperInner authState={authState} children={children} />
  );
}

type _props = WithChildren & {
  authState: AuthState;
};

function AuthenticatedWrapperInner({ authState, children }: _props) {
  const userQuery = db.useQuery(
    authState.user?.id
      ? {
          [$USERS]: {
            [ADMIN]: {},
            $: { where: { id: authState.user?.id } },
          },
        }
      : null
  );

  if (userQuery.isLoading) return <p>Loading...</p>;
  if (!authState.user) return <Navigate to={Pages.LOGIN} />;

  return (
    <UserContext.Provider value={{ user: authState.user }}>
      <Header />
      <PageWrapper>{children}</PageWrapper>
    </UserContext.Provider>
  );
}
