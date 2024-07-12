import axios from "axios";
import { useState } from "react";
import useLogin from "../hooks/useLogin";

const Signup = () => {
  const [error, login] = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/user/signup`,
        {
          username,
          email,
          password,
          firstname,
          lastname,
          phone,
        }
      );

      login(e, { email, password });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign Up</h3>

      <label>Email address:</label>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <label>Password:</label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <label>Username:</label>
      <input
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
      <label>First Name:</label>
      <input
        type="text"
        onChange={(e) => setFirstname(e.target.value)}
        value={firstname}
      />
      <label>Last Name:</label>
      <input
        type="text"
        onChange={(e) => setLastname(e.target.value)}
        value={lastname}
      />
      <label>Phone:</label>
      <input
        type="number"
        onChange={(e) => setPhone(e.target.value)}
        value={phone}
      />

      <button>Sign up</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Signup;
