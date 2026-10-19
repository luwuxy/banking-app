import db from "../config/database.js";

function testData(req, res) {
  res.json({
    data1: "value1",
    data2: "value2"
  })
}

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

      if (results[0].role === "admin") {
        return res.redirect("/admin");
      }

      return res.redirect("/customer");
    }
  );
}

function logout(req, res) {
  req.session.destroy(() => {
    res.redirect("/");
  });
}

export default {
  testData,
  showLogin,
  login,
  logout
};