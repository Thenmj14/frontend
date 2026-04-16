import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/login.css"; // Ensure to import the same styles

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setLoading(true);

    try {
      await API.post("/auth/register", {
        username: username.trim(),
        password: password.trim(),
      });

      setMessage("Account created! Redirecting to login...");
      setIsError(false);
      setTimeout(() => navigate("/"), 2000); // Redirect after 2 sec
    } catch (err) {
      console.error(err);
      setIsError(true);
      if (err.response && err.response.data) {
        setMessage(err.response.data.message || "Registration failed");
      } else {
        setMessage("Server not reachable");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1>Create Account</h1>
        <p className="subtitle">Join VaultCore today</p>

        <form onSubmit={handleRegister}>
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

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        {message && (
          <p className="error" style={{ color: isError ? "#ef4444" : "#10b981", marginTop: "16px" }}>
            {message}
          </p>
        )}

        <p style={{ marginTop: "20px", fontSize: "14px", color: "#6b7280" }}>
          Already have an account?{" "}
          <span
            style={{ color: "#8b5cf6", cursor: "pointer", fontWeight: "600" }}
            onClick={() => navigate("/")}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}