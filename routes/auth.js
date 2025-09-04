import express from 'express';
import createError from 'http-errors';
import pool from '../utils/connectdb.js';
import sendVerificationEmail from '../utils/sendemail.js';

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

async function genToken() {
  return Math.random().toString(36).substring(2);
}

router.post('/signup', async function(req, res, next) {
  const { email, password, display_name, role } = req.body;
  try {
    const [rst] = await pool.query(
      "SELECT * FROM users WHERE email_normalized = ?",
      [email.toLowerCase()]
    );
    if (rst.length > 0) {
      next(createError(409, "User already exists"));
      return;
    }
    var id = await createId();
    if (id < 0) {
      next(createError(500, "Failed to create user ID"));
      return;
    }
    // Create user in the database
    var [result] = await pool.query(
      "INSERT INTO users (id, email, password_hash, display_name, role) VALUES (?, ?, ?, ?, ?)",
      [id, email, password, display_name, role]
    );
  } catch (err) {
    next(createError(500, "Error fetching users"));
    return;
  }
  try {
    // Create Email verification token
    await pool.query(
      "INSERT INTO email_verification_tokens (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))",
      [id, await genToken()]
    );
  } catch (err) {
    console.log(err);
    next(createError(500, "Creating email verification"));
    return;
  }
  try {
    await sendVerificationEmail(email, await genToken());
  } catch (err) {
    next(createError(500, "Sending email verification"));
    return;
  }
  res.status(201).json({ id: result.insertId, email });
});

router.post('/verify', async function(req, res, next) {
  const { token } = req.body;
  try {
    var [rst] = await pool.query(
      "SELECT * FROM email_verification_tokens WHERE token_hash = ?",
      [token]
    );
  } catch (err) {
    next(createError(500, "Error fetching token"));
    return;
  }
  rst = rst[0];
  if (rst.length === 0) {
    next(createError(404, "Token invalid"));
  }
  if (new Date(rst.expires_at) < new Date()) {
    next(createError(410, "Token expired"));
    return;
  }
  // Mark email as verified
  try {
    await pool.query(
      "UPDATE users SET email_verified_at = NOW() WHERE id = ?",
      [rst.user_id]
    );
  } catch (err) {
    console.log(err);
    next(createError(500, "Error marking user as verified"));
    return;
  }
  res.status(200).json({ message: "Email verified successfully" });
});


export default router;
