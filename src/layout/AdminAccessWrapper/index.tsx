/* eslint-disable react-refresh/only-export-components */

import Header from "../Header";
import { createContext } from "react";
import { User } from "@instantdb/react";
import { Navigate } from "react-router-dom";
import { WithChildren } from "../../types";
import { db } from "@/database";
import { Pages } from "../App/router";

interface UserContextType {
  user: User | null;
}

export const UserContext = createContext<UserContextType>({
  user: null,
});

export default function AdminAccessWrapper({ children }: WithChildren) {
  return (
    <div>
      <db.SignedIn>
        <AdminAccessWrapperInner children={children} />
      </db.SignedIn>
      <db.SignedOut>
        <Navigate to="/" />;
      </db.SignedOut>
    </div>
  );
}

function AdminAccessWrapperInner({ children }: WithChildren) {
  const user = db.useUser();

  const userQuery = db.useQuery(
    user?.id
      ? {
          $users: {
            admin: {},
            $: { where: { id: user?.id } },
          },
        }
      : null
  );

  if (userQuery.isLoading) return <p>Loading...</p>;
  if (!user) return <Navigate to={Pages.LOGIN} />;

  const dbUser = userQuery.data?.$users?.[0];
  const hasAdminAccess = dbUser?.admin;

  if (!hasAdminAccess) {
    return <Navigate to="/" />;
  }

  return (
    <UserContext.Provider value={{ user }}>
      <Header />
      {children}
    </UserContext.Provider>
  );
}
