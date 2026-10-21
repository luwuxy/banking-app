import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import axios from 'axios';

export default function AdminDashboard() {
  const [customers, setCustomers] = useState(null);

  async function fetchData() {
    const response = await axios.get("http://localhost:8080/admin", {
      withCredentials: true
    });
    setCustomers(response.data.customers);
  }

  useEffect(() => {
    fetchData();
  }, [])

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
            <h1>Admin Dashboard</h1>
            <p>Manage customer accounts.</p>
          </div>

          <Link to="/admin/create" className="btn primary">
            + Create Customer
          </Link>
        </div>

        <section className="card">
          <h2>Customer Accounts</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Username</th>
                  <th>Account</th>
                  <th>Type</th>
                  <th>Balance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {customers && customers.map(customer => {
                  return (
                    <tr key={customer.account_number}>
                      <td>
                        {customer.customer_id}
                      </td>
                      <td>
                        <strong>
                          {customer.first_name}
                          {customer.last_name}
                        </strong>
                      </td>
                      <td>
                        {customer.username}
                      </td>
                      <td>
                        {customer.account_number}
                      </td>
                      <td>
                        {customer.account_type}
                      </td>
                      <td className="money">
                        ₱{
                          Number(customer.balance).toLocaleString("en-PH", {
                            minimumFractionDigits: 2
                          })
                        }
                      </td>
                      <td>
                        <span className="status">
                          {customer.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  )
}