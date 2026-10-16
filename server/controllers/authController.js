import db from "../config/database";

function showLogin(req, res) {
  res.render("login", {
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
        return res.render("login", {
          error: "Database error."
        });
      }

      if (results.length === 0) {
        return res.render("login", {
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

export {
  showLogin,
  login,
  logout
};