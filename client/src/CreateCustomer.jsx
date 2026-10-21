import { useState, useEffect } from "react";
import { Link } from "react-router";
import axios from "axios";

export default function CreateCustomer() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function fetchData() {
    try {
      const response = await axios.get(
        "http://localhost:8080/admin/create",
        { withCredentials: true }
      );
      setData(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to load page."
      );
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    );

    try {
      const response = await axios.post(
        "http://localhost:8080/admin/create",
        formData,
        { withCredentials: true }
      );

      if (response.data.error) {
        setError(response.data.error);
        return;
      }

      setSuccess(
        response.data.success || "Customer created successfully."
      );

      e.target.reset();
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to create customer."
      );
    }
  }

  return (
    <>
      <header className="topbar">
        <div>
          <h2>Online Banking</h2>
          <span>Administrator</span>
        </div>
        <a href="http://localhost:8080/logout" className="logout">Logout</a>
      </header>

      <main className="container">
        <div className="page-header">
          <div>
            <h1>Create Customer</h1>
            <p>Create a new banking customer.</p>
          </div>
          <Link to="/admin" className="btn secondary">Back</Link>
        </div>

        {error && (
          <div className="alert error">{error}</div>
        )}

        {success && (
          <div className="alert success">{success}</div>
        )}

        {data?.error && (
          <div className="alert error">{data.error}</div>
        )}

        <section className="card">
          <form onSubmit={handleSubmit}>
            <h2>Login Information</h2>
            <div className="form-grid">
              <div>
                <label>Username</label>
                <input type="text" name="username" required />
              </div>

              <div>
                <label>Password</label>
                <input type="password" name="password" required />
              </div>
            </div>

            <h2>Customer Information</h2>
            <div className="form-grid">
              <div>
                <label>First Name</label>
                <input type="text" name="first_name" required />
              </div>

              <div>
                <label>Last Name</label>
                <input type="text" name="last_name" required />
              </div>

              <div>
                <label>Email</label>
                <input type="email" name="email" required />
              </div>

              <div>
                <label>Phone</label>
                <input type="text" name="phone" required />
              </div>
            </div>

            <label>Address</label>
            <textarea name="address" rows="3" />

            <h2>Bank Account</h2>
            <div className="form-grid">
              <div>
                <label>Account Number</label>
                <input
                  type="text"
                  name="account_number"
                  required
                />
              </div>

              <div>
                <label>Account Type</label>
                <select name="account_type">
                  <option value="Savings">Savings</option>
                  <option value="Checking">Checking</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn primary">
              Create Customer
            </button>
          </form>
        </section>
      </main>
    </>
  );
}