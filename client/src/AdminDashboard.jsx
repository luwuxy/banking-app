import { useState, useEffect } from 'react';
import { Link } from 'react-router';

export default function AdminDashboard() {
  return (
    <>
      <header className="topbar">
        <div>
          <h2>Online Banking</h2>
          <span>Administrator</span>
        </div>
        <Link to="/logout" className="logout">Logout</Link>
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

              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  )
}