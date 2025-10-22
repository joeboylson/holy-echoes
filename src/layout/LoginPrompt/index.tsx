import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface LoginPromptProps {
  returnTo?: string;
}

export default function LoginPrompt({ returnTo = "/category/favorites" }: LoginPromptProps) {
  const handleLogin = () => {
    window.location.href = `/login?returnTo=${encodeURIComponent(returnTo)}`;
  };

  return (
    <Card className="min-w-[300px] max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Please log in to use favorites</CardTitle>
        <CardDescription>
          You need to be logged in to save and view your favorite prayers.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button variant="primary" size="lg" onClick={handleLogin}>
          Log In
        </Button>
      </CardContent>
    </Card>
  );
}
