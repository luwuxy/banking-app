import db from "../config/database.js";

function showLogin(req, res) {
  res.json({
    error: null
  });
}

function login(req, res) {
  const { username, password } = req.body;

  const sql = `
        SELECT user_id, username, role FROM users
        WHERE username = ? AND password = ?
      `;

  db.query(
    sql,
    [username, password],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.json({
          error: "Database error."
        });
      }

      if (results.length === 0) {
        return res.json({
          error: "Invalid username or password."
        });
      }

      req.session.user = results[0];

      return res.json({
        role: results[0].role
      });
    }
  );
}

function logout(req, res) {
  req.session.destroy(() => {
    res.redirect("http://localhost:5173/");
  });
}

function register(req, res) {
  const registerInfo = req.body;

  const sql = `CALL sp_createaccount(?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    Object.values(registerInfo),
    (err) => {
      if (err) {
        console.error(err);
        return res.json({
          error: "Database error."
        });
      }

      const userSQL = `
        SELECT user_id, username, role
        FROM users
        WHERE username = ?
      `;

      db.query(
        userSQL,
        [registerInfo.username],
        (err, results) => {
          if (err) {
            console.error(err);
            return res.json({
              error: "Account created, but login failed."
            });
          }

          if (results.length === 0) {
            return res.json({
              error: "Account created, but user could not be found."
            });
          }

          req.session.user = results[0];

          return res.json({
            role: results[0].role
          });
        }
      )
    }
  )
}

export default {
  showLogin,
  login,
  logout,
  register
};