import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import "./style.css";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:8080/login",
        { username, password },
        { withCredentials: true }
      );

      if (response.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/customer");
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Something went wrong."
      );
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="bank-logo">🏦</div>

        <h1>Online Banking</h1>
        <p className="subtitle">Secure Banking Portal</p>

        {error && (
          <div className="alert error">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn primary">
            Login
          </button>
        </form>

        <p className="login-note">Authorized users only</p>
      </div>
    </div>
  );
}

export default Login;