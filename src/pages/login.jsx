import { useState } from "react";

import "../styles/login.css";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await API.post("/auth/login", {
      username,
      password,
    });

    localStorage.setItem("token", res.data.token);
    navigate("/dashboard");

  } catch (err) {
    console.error(err);
    setError("Invalid username or password");
  }
};
  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="logo">VaultCore</h1>
        <p className="subtitle">Secure Banking Portal</p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Sign In</button>

          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}