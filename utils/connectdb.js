import mysql from "mysql2/promise";
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "db", // Use "db" for Docker container networking
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

(async () => {
  const [rows] = await pool.query("SELECT NOW()");
  console.log("Connected to MySQL:", rows);
})();

export default pool;
