import { useEffect } from "react";
import { useStatusBar } from "@/contexts/StatusBarContext";
import { useHeaderColor } from "@/contexts/HeaderColorContext";
import LoggedInUserWrapper from "@/layout/LoggedInUserWrapper";
import NavigationHeader from "@/components/NavigationHeader";
import { Pages } from "@/layout/App/router";
import { db } from "@/database";
import ScrollablePageLayout from "@/components/ScrollablePageLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Profile() {
  const { setStatusBarColor } = useStatusBar();
  const { headerColor } = useHeaderColor();
  const { user } = db.useAuth();

  useEffect(() => {
    setStatusBarColor(headerColor);
  }, [setStatusBarColor, headerColor]);

  const handleSignOut = () => {
    db.auth.signOut();
  };

  return (
    <LoggedInUserWrapper>
      <ScrollablePageLayout
        variant="50"
        header={<NavigationHeader backTo={Pages.HOME} />}
      >
        <div className="px-6 w-full max-w-[640px] mx-auto">
          <div className="py-6 border-b">
            <h1 className="text-2xl font-bold text-center">Profile</h1>
          </div>

          <div className="py-6 space-y-6">
            {user ? (
              <>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-sm font-medium text-gray-500 mb-2">
                    Email
                  </h2>
                  <p className="text-lg text-gray-900">{user.email}</p>
                </div>

                <Button
                  variant="destructive"
                  onClick={handleSignOut}
                  className="w-full"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>You are not signed in</CardTitle>
                  <CardDescription>
                    Sign in to access your profile and save your favorite
                    prayers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button variant="primary" size="lg" asChild>
                    <a href="/login">Sign In</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </ScrollablePageLayout>
    </LoggedInUserWrapper>
  );
}
