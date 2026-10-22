import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import './Register.css';

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [accountInfo, setAccountInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    username: "",
    password: ""
  })

  const {
    first_name,
    last_name,
    email,
    phone,
    address,
    username,
    password,
  } = accountInfo;

  function applyInfo(e) {
    setAccountInfo({
      ...accountInfo,
      [e.target.name]: e.target.value
    })
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:8080/register",
        { ...accountInfo },
        { withCredentials: true }
      );

      if (response.data.error) {
        setError(response.data.error);
        return;
      }

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
      <div className="login-card" id="register-card">
        <div className="bank-logo">🏦</div>
        <h1>Online Banking</h1>
        <p className="subtitle">Secure Banking Portal</p>
        <h3>Register</h3>
        {error && (
          <div className="alert error">
            {error}
          </div>
        )}
        <form onSubmit={handleRegister}>
          <label htmlFor="first-name">First Name</label>
          <input type="text" name="first_name" id="first-name" value={first_name} onChange={applyInfo} placeholder="Jane" required />
          <label htmlFor="last-name">Last Name</label>
          <input type="text" name="last_name" id="last-name" value={last_name} onChange={applyInfo} placeholder="Doe" required />
          <label htmlFor="email">Email</label>
          <input type="text" name="email" id="email" value={email} onChange={applyInfo} placeholder="example@email.com" required />
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" name="phone" id="phone" value={phone} onChange={applyInfo} placeholder="09123456789" required />
          <label htmlFor="address">Address</label>
          <input type="text" name="address" id="address" value={address} onChange={applyInfo} placeholder="Enter address" required />
          <label htmlFor="username">Username</label>
          <input type="text" name="username" id="username" value={username} onChange={applyInfo} placeholder="Enter username" required />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" value={password} onChange={applyInfo} placeholder="Enter password" required />
          <button type="submit" className="btn primary">
            Register
          </button>
        </form>
      </div>
    </div>
  )
}