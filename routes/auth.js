import express from 'express';
import createError from 'http-errors';
import pool from '../utils/connectdb.js';

var router = express.Router();

async function createId() {
  var id;
  var count = 0;
  while (true) {
    if (count++ > 10) {
      return -1;
    }
    id = Math.floor(Math.random() * 10000000000);
    const [rst] = await pool.query(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    if (rst.length === 0) {
      break;
    }
  }
  return id;
}

router.post('/signup', async function(req, res, next) {
  const { email, password, display_name, role } = req.body;
  try {
    const [rst] = await pool.query(
      "SELECT * FROM users WHERE email_normalized = ?",
      [email.toLowerCase()]
    );
    if (rst.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }
    const id = createId();
    if (id < 0) {
      return res.status(500).json({ error: "Failed to create user ID" });
    }
    // Create user in the database
    const [result] = await pool.query(
      "INSERT INTO users (id, email, password, display_name, role) VALUES (?, ?, ?, ?, ?)",
      [id, email, password, display_name, role]
    );
    res.status(201).json({ id: result.insertId, email });
  } catch (err) {
    next(createError(500, "Error fetching users"));
  }

  try {
    // Create Email verification token
    const token = Math.random().toString(36).substring(2);
    await pool.query(
      "INSERT INTO email_verification (user_id, token_hash) VALUES (?, ?)",
      [id, token]
    );
    // Send verification email
    // ...

  } catch (err) {
    next(createError(500, "Creating email verification"));
  }
});

export default router;
