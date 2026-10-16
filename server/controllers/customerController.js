import db from '../config/database.js';

function dashboard(req, res) {
  const userId = req.session.user.user_id;

  const accountSQL = `SELECT * FROM vw_customer_accounts WHERE user_id = ?`;

  db.query(
    accountSQL,
    [userId],
    (err, accounts) => {
      if (err) {
        console.error(err);
        return res.send("Database error.");
      }
      
      if (accounts.length === 0) {
        return res.send(
          "No bank account found."
        );
      }

      const account = accounts[0];

      const transactionSQL = `
        SELECT * FROM vw_transaction_history
        WHERE account_number = ?
        ORDER BY transaction_date DESC
      `;

      db.query(
        transactionSQL,
        [account.account_number],
        (err, transactions) => {
          if (err) {
            console.error(err);
            return res.send("Unable to load transactions.");
          }

          res.render("customer-dashboard", {
            account,
            transactions,
            success: req.query.success,
            error: req.query.error
          })
        }
      )
    }
  )
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

export {
  dashboard,
  deposit,
  withdraw
};