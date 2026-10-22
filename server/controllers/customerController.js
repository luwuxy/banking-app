import db from '../config/database.js';

function dashboard(req, res) {
  const userId = req.session.user.user_id;

  const accountSQL = `
    SELECT * FROM vw_customer_accounts
    WHERE user_id = ?
  `;

  db.query(accountSQL, [userId], (err, accounts) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error." });
    }

    if (accounts.length === 0) {
      return res.status(404).json({
        error: "No bank account found."
      });
    }

    const transactionSQL = `
      SELECT * FROM vw_transaction_history
      WHERE account_number IN (?)
      ORDER BY transaction_date DESC
    `;

    const accountNumbers = accounts.map(
      (account) => account.account_number
    );

    db.query(transactionSQL, [accountNumbers], (err, transactions) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          error: "Unable to load transactions."
        });
      }

      res.json({
        accounts,
        transactions,
        success: req.query.success,
        error: req.query.error
      });
    });
  });
}

function deposit(req, res) {
  const { account_number, amount } = req.body;

  const depositAmount = parseFloat(amount);

  if (isNaN(depositAmount) || depositAmount <= 0) {
    return res.redirect("/customer?error=Invalid deposit amount");
  }

  const sql = `CALL sp_deposit(?, ?, ?)`;

  db.query(sql, [
    account_number,
    depositAmount,
    "Online Cash Deposit"
  ], (err) => {
    if (err) {
      console.error(err);
      return res.redirect(
        "/customer?error=" +
        encodeURIComponent(
          err.sqlMessage ||
          "Deposit failed"
        )
      );
    }

    res.redirect(
      "/customer?success=" +
      encodeURIComponent("Deposit completed successfully.")
    );
  });
}

function withdraw(req, res) {
  const { account_number, amount } = req.body;

  const withdrawalAmount = parseFloat(amount);

  if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
    return res.redirect("/customer?error=Invalid withdrawal amount");
  }

  const sql = `CALL sp_withdraw(?, ?, ?)`;

  db.query(sql, [
    account_number,
    withdrawalAmount,
    "Online Cash Withdrawal"
  ], (err) => {
    if (err) {
      console.error(err);
      return res.redirect(
        "/customer?error=" +
        encodeURIComponent(err.sqlMessage || "Withdrawal failed")
      );
    }

    res.redirect(
      "/customer?success=" +
      encodeURIComponent("Withdrawal completed successfully.")
    );
  })
}

function transfer(req, res) {
  const { account_number_sender, account_number_recipient, amount, purpose } = req.body;
  const transferAmount = parseFloat(amount);

  if (isNaN(transferAmount) || transferAmount <= 0) {
    return res.redirect("/customer?error=Invalid transfer amount");
  }

  const checkSQL = `
    SELECT account_number
    FROM accounts
    WHERE account_number = ?
  `;

  db.query(checkSQL, [
    account_number_recipient
  ], (err, results) => {
    if (err) {
      console.error(err);
      return res.redirect("/customer?error=Database error");
    }

    if (results.length === 0) {
      return res.redirect(
        "/customer?error=" +
        encodeURIComponent("Recipient account does not exist.")
      );
    }

    const sql = 'CALL sp_transfer(?, ?, ?, ?)';

    db.query(sql, [
      account_number_sender,
      account_number_recipient,
      amount,
      purpose
    ], (err) => {
      if (err) {
        console.error(err);
        return res.redirect(
          "/customer?error=" +
          encodeURIComponent(err.sqlMessage || "Transfer failed")
        );
      }

      res.redirect(
        "/customer?success=" +
        encodeURIComponent("Transfer completed successfully.")
      );
    })
  })
}

export default {
  dashboard,
  deposit,
  withdraw,
  transfer
};