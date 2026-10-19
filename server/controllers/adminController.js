import db from '../config/database.js';

function dashboard(req, res) {
  const sql = `SELECT * FROM vw_customer_accounts ORDER BY customer_id DESC`;

  db.query(sql, (err, customers) => {
    if (err) {
      console.error(err);
      return res.send("Database error.");
    }

    res.json({
      customers,
    })
  })
}

function showCreateCustomer(req, res) {
  res.json({
    error: null,
  })
}

function createCustomer(req, res) {
  const {
    username,
    password,
    first_name,
    last_name,
    email,
    phone,
    address,
    account_number,
    account_type,
  } = req.body

  const userSQL = `
    INSERT INTO users (username, password, role)
    VALUES (?, ?, 'customer')
  `;

  db.query(userSQL, [username, password], (err, userResult) => {
    if (err) {
      console.error(err);

      return res.json({
        error: "Unable to create login account.",
      })
    }

    const userId = userResult.insertId;

    const customerSQL = `
      INSERT INTO customers
      (user_id, first_name, last_name)
    `;

    db.query(
      customerSQL,
      [userId, first_name, last_name, email, phone, address],
      (err, customerResults) => {
        if (err) {
          console.error(err);

          return res.json({
            error: "Unable to create customer.",
          })
        }

        const customerId = customerResult.insertId;

        const accountSQL = `
          INSERT INTO accounts
          (customer_id, account_number, account_type, balance, status)
          VALUES (?, ?, ?, 0.00, 'Active')
        `;

        db.query(
          accountSQL,
          [customerId, account_number, account_type],
          (err) => {
            if (err) {
              console.error(err);

              return res.json({
                error: "Unable to create bank account.",
              })
            }

            res.redirect("/admin");
          }
        )
      }
    )
  })
}

export default {
  dashboard,
  showCreateCustomer,
  createCustomer,
};