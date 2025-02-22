import { createContext, useMemo } from "react";
import { User } from "@instantdb/react";
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
  user: User | undefined;
}

export const UserContext = createContext<UserContextType>({
  user: undefined,
});

export default function AuthenticatedWrapper({ children }: WithChildren) {
  const authState = db.useAuth();

  const userId = useMemo(() => {
    if (authState.user) return authState.user.id;
  }, [authState]);

  const userQuery = db.useQuery(
    userId
      ? {
          [$USERS]: {
            [ADMIN]: {},
            $: { where: { id: userId } },
          },
        }
      : null
  );

  const isAdmin = useMemo(() => {
    const _user = first(userQuery.data?.[$USERS]);
    return !isEmpty(_user?.[ADMIN]);
  }, [userQuery]);

  // TODO: improve loading screen
  if (userQuery.isLoading || authState.isLoading) return <p>Loading...</p>;

  // TODO: improve error message screen
  if (authState.error) return <code>{authState.error.message}</code>;
  if (!isAdmin) return <Navigate to={Pages.LOGIN} />;

  return (
    <UserContext.Provider value={{ user: authState.user }}>
      <Header />
      <PageWrapper>{children}</PageWrapper>
    </UserContext.Provider>
  );
}
