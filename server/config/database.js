import mysql from 'mysql2';

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "banking_db"
})

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed: ", err.message);
    return;
  }

  console.log("Connected to banking_db");
})

export default db;