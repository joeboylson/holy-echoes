import { WithChildren } from "../../types";
import { db } from "@/database";
import { UserContext } from "../AdminAccessWrapper";
import BottomNav from "@/components/BottomNav";

export default function LoggedInUserWrapper({ children }: WithChildren) {
  return (
    <div>
      <db.SignedIn>
        <LoggedInUserWrapperInner children={children} />
      </db.SignedIn>
      <db.SignedOut>
        <UserContext.Provider value={{ user: null }}>
          {children}
        </UserContext.Provider>
      </db.SignedOut>
      <BottomNav />
    </div>
  );
}

function LoggedInUserWrapperInner({ children }: WithChildren) {
  const user = db.useUser();

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}
