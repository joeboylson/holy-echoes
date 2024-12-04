import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { db } from "../database";
import { Pages } from "../layout/App";

export const StyledLogin = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
`;

export const LoginFormWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  width: 100%;
  padding: 24px;
  max-width: 500px;
`;

export const LoginForm = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  gap: 12px;
`;

export default function Login() {
  const navigate = useNavigate();

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
  };

  return (
    <StyledLogin>
      <LoginFormWrapper>
        <h3>Login:</h3>
        <ol>
          <li>Enter your email address</li>
          <li>Look for an email sent by "auth@pm.instantdb.com"</li>
          <li>Enter the 6-digit Magic Code in 2nd input below</li>
        </ol>
        {message && <code>{message}</code>}
        <LoginForm>
          {/* Email Input */}
          <input
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Code Input */}
          <input
            type="text"
            placeholder="Magic Code"
            onChange={(e) => setCode(e.target.value)}
            disabled={!emailIsSent}
          />

          {/* Send Code Button */}
          <button onClick={handleSubmitEmail}>Submit Email</button>

          {/* Submit Code Button */}
          <button onClick={handleSubmitCode} disabled={!emailIsSent}>
            Submit Magic Code
          </button>
        </LoginForm>
      </LoginFormWrapper>
    </StyledLogin>
  );
}
