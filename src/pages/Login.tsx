import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { db } from "@/database";
import { Pages } from "../layout/App/router";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

export const StyledLogin = styled.div`
  width: 100vw;
  height: var(--header-height);
  display: grid;
  place-items: center;
`;

export const LoginForm = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  gap: 12px;
`;

enum LoginTabs {
  ENTER_EMAIL = "enter_email",
  ENTER_MAGIC_CODE = "enter_magic_code",
}

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<LoginTabs>(LoginTabs.ENTER_EMAIL);
  const [email, setEmail] = useState<string>();
  const [emailIsSent, setEmailIsSent] = useState(false);
  const [code, setCode] = useState<string>();
  const [message, setMessage] = useState<string>();

  const handleSubmitEmail = () => {
    if (!email) return setMessage("Please enter an email address");
    setEmailIsSent(true);

    db.auth.sendMagicCode({ email }).catch((err) => {
      setEmailIsSent(false);
      setMessage("Oops, there was an error:" + err.body?.message);
    });

    setTab(LoginTabs.ENTER_MAGIC_CODE);
  };

  const handleSubmitCode = () => {
    if (!email) return setMessage("Please enter an email address");
    if (!code) return setMessage("Please enter your magic code");

    db.auth
      .signInWithMagicCode({ email, code })
      .then(() => navigate(Pages.ADMIN))
      .catch((err) => {
        setMessage("Oops, there was an error:" + err.body?.message);
      });

    navigate("/admin");
  };

  return (
    <div className="grid w-[100vw] h-[var(--header-height)] place-items-center">
      <Card className="bg-neutral-100">
        <div className="w-[500px] h-[200px] grid gap-[24px] content-start px-[24px]">
          <h1 className="text-4xl text-center">Login</h1>

          <Tabs value={tab} onValueChange={(_tab) => setTab(_tab as LoginTabs)}>
            <TabsList className="grid grid-cols-2 gap-[24px] w-full">
              <TabsTrigger value={LoginTabs.ENTER_EMAIL} className="bg-primary">
                Enter Email
              </TabsTrigger>
              <TabsTrigger value={LoginTabs.ENTER_MAGIC_CODE}>
                Enter Magic Code
              </TabsTrigger>
            </TabsList>

            {/* Email Input */}
            <TabsContent value="enter_email" className="grid gap-[12px] w-full">
              <Input
                type="text"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={handleSubmitEmail}>Submit Email</Button>
            </TabsContent>

            <TabsContent
              value="enter_magic_code"
              className="grid gap-[12px] w-full"
            >
              <div className="grid place-items-center">
                <InputOTP maxLength={6} onChange={setCode}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button onClick={handleSubmitCode} disabled={!emailIsSent}>
                Submit
              </Button>
            </TabsContent>
          </Tabs>

          {message && <code>{message}</code>}
        </div>
      </Card>
    </div>
  );
}
