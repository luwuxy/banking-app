import { useState, useEffect } from "react";
import axios from "axios";
import TransferView from "./components/TransferView";

export default function CustomerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [viewTransfer, setViewTransfer] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(0);

  async function fetchData() {
    const response = await axios.get(
      "http://localhost:8080/customer",
      { withCredentials: true }
    );

    setData(response.data);
  }

  useEffect(() => {
    fetchData().catch((err) => {
      setError(
        err.response?.data?.error || "Failed to load dashboard."
      );
    });
  }, []);

  async function handleTransaction(e, endpoint) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    );

    try {
      const response = await axios.post(
        `http://localhost:8080${endpoint}`,
        formData,
        { withCredentials: true }
      );

      if (response.data.error) {
        setError(response.data.error);
        return;
      }

      setSuccess(
        response.data.success || "Transaction completed successfully."
      );

      await fetchData();
      e.target.reset();
    } catch (err) {
      setError(
        err.response?.data?.error || "Transaction failed."
      );
    }
  }

  function onViewTransfer() {
    setViewTransfer(true);
  }

  function onCloseTransfer() {
    setViewTransfer(false);
    setError("");
    setSuccess("");
  }

  if (!data) {
    return (
      <main className="container">
        {error ? (
          <div className="alert error">{error}</div>
        ) : (
          <p>Loading...</p>
        )}
      </main>
    );
  }

  return (
    <>
      {viewTransfer && <TransferView
      onCloseTransfer={onCloseTransfer}
      handleTransaction={handleTransaction}
      data={data}
      error={error}
      success={success}
      selectedAccount={selectedAccount}
      />}

      <header className="topbar">
        <div>
          <h2>Online Banking</h2>
          <span>Customer Portal</span>
        </div>
        <a href="http://localhost:8080/logout" className="logout">Logout</a>
      </header>

      <main className="container">
        <div className="page-header">
          <div>
            <h1>Welcome, {data.accounts[selectedAccount].first_name}</h1>
            <p>Manage your bank account.</p>
          </div>
          <div className="choose-account">
            <button className="btn" disabled={!data.accounts.some(account => account.account_type === "Savings")} onClick={() => setSelectedAccount(0)}>Savings</button>
            <button className="btn" disabled={!data.accounts.some(account => account.account_type === "Checking")} onClick={() => setSelectedAccount(1)}>Checking</button>
          </div>
        </div>

        {(success || data.success) && (
          <div className="alert success">
            {success || data.success}
          </div>
        )}

        {(error || data.error) && (
          <div className="alert error">
            {error || data.error}
          </div>
        )}

        <section className="account-summary">
          <div className="balance-card">
            <div className="left-side">
              <span>Available Balance</span>
              <h1>
                ₱{Number(data.accounts[selectedAccount].balance).toLocaleString("en-PH", {
                  minimumFractionDigits: 2
                })}
              </h1>

              <p>
                Account:{" "}
                <strong>{data.accounts[selectedAccount].account_number}</strong>
              </p>
            </div>
            <button className="transfer" onClick={onViewTransfer}>Transfer Money</button>
          </div>

          <div className="info-card">
            <span>Account Holder</span>
            <h3>
              {data.accounts[selectedAccount].first_name}{" "}
              {data.accounts[selectedAccount].last_name}
            </h3>
            <p>{data.accounts[selectedAccount].email}</p>
          </div>

          <div className="info-card">
            <span>Account Type</span>
            <h3>{data.accounts[selectedAccount].account_type}</h3>
            <p>
              Status: <strong>{data.accounts[selectedAccount].status}</strong>
            </p>
          </div>
        </section>

        <section className="operations">
          <div className="card">
            <h2>Deposit Money</h2>
            <p className="description">
              Add money to your bank account.
            </p>

            <form
              onSubmit={(e) =>
                handleTransaction(e, "/customer/deposit")
              }
            >
              <input
                type="hidden"
                name="account_number"
                value={data.accounts[selectedAccount].account_number}
                readOnly
              />

              <label>Deposit Amount</label>
              <div className="money-input">
                <span>₱</span>
                <input
                  type="number"
                  name="amount"
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
              </div>

              <button type="submit" className="btn primary">
                Deposit Money
              </button>
            </form>
          </div>

          <div className="card">
            <h2>Withdraw Money</h2>
            <p className="description">
              Withdraw money from your account.
            </p>

            <form
              onSubmit={(e) =>
                handleTransaction(e, "/customer/withdraw")
              }
            >
              <input
                type="hidden"
                name="account_number"
                value={data.accounts[selectedAccount].account_number}
                readOnly
              />

              <label>Withdrawal Amount</label>
              <div className="money-input">
                <span>₱</span>
                <input
                  type="number"
                  name="amount"
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
              </div>

              <button type="submit" className="btn danger">
                Withdraw Money
              </button>
            </form>
          </div>
        </section>

        <section className="card">
          <div className="section-header">
            <div>
              <h2>Transaction History</h2>
              <p>Recent account activity</p>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                {data.transactions.length === 0 && (
                  <tr>
                    <td colSpan="4" className="empty">
                      No transactions yet.
                    </td>
                  </tr>
                )}

                {data.transactions.map((transaction) => (
                  <tr key={transaction.transaction_id}>
                    <td>
                      {new Date(
                        transaction.transaction_date
                      ).toLocaleString("en-PH")}
                    </td>

                    <td>
                      {transaction.transaction_type === "Deposit" ? (
                        <span className="transaction deposit">
                          Deposit
                        </span>
                      ) : (
                        <span className="transaction withdrawal">
                          Withdrawal
                        </span>
                      )}
                    </td>

                    <td>{transaction.description}</td>

                    <td className="money">
                      {transaction.transaction_type === "Deposit"
                        ? "+"
                        : "-"}
                      ₱{Number(transaction.amount).toLocaleString(
                        "en-PH",
                        { minimumFractionDigits: 2 }
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}