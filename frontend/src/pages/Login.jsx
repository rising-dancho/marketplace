import { useState } from "react";
import useLogin from "../hooks/useLogin";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, login] = useLogin();

  const userCredentials = {
    email,
    password,
  };

  return (
    <>
      <form className="login" onSubmit={(e) => login(e, userCredentials)}>
        <h3>Log In</h3>
        <label>Email address:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Log in</button>
        {error && <p>{error}</p>}
        {/* <code>{JSON.stringify(import.meta.env.VITE_SERVER_BASE_URL)}</code> */}
      </form>
    </>
  );
};

export default Login;
