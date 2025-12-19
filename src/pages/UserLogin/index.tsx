import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "@/database";
import { Pages } from "../../layout/App/router";
import { useStatusBar } from "@/contexts/StatusBarContext";
import LoggedInUserWrapper from "@/layout/LoggedInUserWrapper";
import NavigationHeader from "@/components/NavigationHeader";
import { Button } from "@/components/ui/button";

enum LoginStep {
  ENTER_EMAIL = "enter_email",
  ENTER_CODE = "enter_code",
}

export default function UserLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setStatusBarColor } = useStatusBar();
  const [step, setStep] = useState<LoginStep>(LoginStep.ENTER_EMAIL);
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [message, setMessage] = useState<string>();
  const [returnTo, setReturnTo] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setStatusBarColor("#0082cb");

    // Get the return URL from query params or referrer
    const searchParams = new URLSearchParams(location.search);
    const returnParam = searchParams.get("returnTo");

    if (returnParam) {
      setReturnTo(returnParam);
    } else {
      // Default to home if no return URL specified
      setReturnTo(Pages.HOME);
    }
  }, [location, setStatusBarColor]);

  const handleSubmitEmail = async () => {
    if (!email.trim()) {
      setMessage("Please enter an email address");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await db.auth.sendMagicCode({ email: email.trim() });
      setStep(LoginStep.ENTER_CODE);
    } catch (err: unknown) {
      const error = err as { body?: { message?: string }; message?: string };
      setMessage(
        "Oops, there was an error: " + (error.body?.message || error.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!email.trim()) {
      setMessage("Please enter an email address");
      return;
    }
    if (!code.trim() || code.length !== 6) {
      setMessage("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await db.auth.signInWithMagicCode({
        email: email.trim(),
        code: code.trim(),
      });
      // Redirect to the return URL or home
      navigate(returnTo || Pages.HOME);
    } catch (err: unknown) {
      const error = err as { body?: { message?: string }; message?: string };
      setMessage(
        "Oops, there was an error: " + (error.body?.message || error.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep(LoginStep.ENTER_EMAIL);
    setCode("");
    setMessage("");
  };

  return (
    <LoggedInUserWrapper>
      <div className="w-screen min-h-screen flex flex-col">
        <NavigationHeader backTo={returnTo || Pages.HOME} />

        <div className="px-6 w-full max-w-[600px] mx-auto flex-1 flex items-center justify-center">
          <div className="w-full">
            <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
              {step === LoginStep.ENTER_EMAIL ? (
                <div className="space-y-8">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                      Welcome
                    </h1>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Enter your email to sign in or create an account. We'll
                      send you a secure code to complete the process.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-3"
                      >
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hc-blue focus:border-transparent text-lg"
                        disabled={isLoading}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSubmitEmail();
                          }
                        }}
                      />
                    </div>

                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleSubmitEmail}
                      disabled={isLoading || !email.trim()}
                      className="w-full text-lg"
                    >
                      {isLoading ? "Sending..." : "Send Code"}
                    </Button>
                  </div>

                  <div className="text-center text-sm text-gray-500 leading-relaxed">
                    <p>
                      No password needed! We'll send a 6-digit code to your
                      email that you can use to sign in securely.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                      Check Your Email
                    </h1>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      We sent a 6-digit code to <strong>{email}</strong>. Enter
                      it below to complete your sign in.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="code"
                        className="block text-sm font-medium text-gray-700 mb-3"
                      >
                        6-Digit Code
                      </label>
                      <input
                        id="code"
                        type="text"
                        value={code}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6);
                          setCode(value);
                        }}
                        placeholder="123456"
                        className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hc-blue focus:border-transparent text-center text-3xl tracking-widest"
                        disabled={isLoading}
                        maxLength={6}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && code.length === 6) {
                            handleSubmitCode();
                          }
                        }}
                      />
                    </div>

                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleSubmitCode}
                      disabled={isLoading || code.length !== 6}
                      className="w-full text-lg"
                    >
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={handleBackToEmail}
                      disabled={isLoading}
                      className="w-full"
                    >
                      Use Different Email
                    </Button>
                  </div>

                  <div className="text-center text-sm text-gray-500 leading-relaxed">
                    <p>
                      Didn't receive the code? Check your spam folder or try
                      again with a different email.
                    </p>
                  </div>
                </div>
              )}

              {message && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </LoggedInUserWrapper>
  );
}
