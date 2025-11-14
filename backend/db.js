// backend/db.js
import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "kaladin",   // tu pass real
  database: "dnd_creador",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
