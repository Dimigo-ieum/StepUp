import express from 'express';
import createError from 'http-errors';
import pool from '../utils/connectdb.js';
import sendVerificationEmail from '../utils/sendemail.js';
import argon2 from "argon2";

var router = express.Router();

const ARGON_OPTS = {
  type: argon2.argon2id,
  memoryCost: 64 * 1024,  // 64 MiB
  timeCost: 3,            // iterations
  parallelism: 1          // raise if you can
  // Optionally: secret: Buffer.from(process.env.PEPPER, 'utf8')  // if supported
};

export async function hashPassword(password) {
  return await argon2.hash(password, ARGON_OPTS);   // returns PHC string
}

export async function verifyPassword(hash, password) {
  return await argon2.verify(hash, password);
}

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
  const hashedPassword = await hashPassword(password);
  console.log(hashedPassword)
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
      [id, email, hashedPassword, display_name, role]
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
  return;
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
    return;
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
  return;
});

router.post('/login', async function(req, res, next) {
  const { email, password } = req.body;
  try {
    const [rst] = await pool.query(
      "SELECT * FROM users WHERE email_normalized = ?",
      [email.toLowerCase()]
    );
    if (rst.length === 0) {
      next(createError(401, "Invalid email or password"));
      return;
    }
    const user = rst[0];
    if (!await verifyPassword(user.password_hash, password)) {
      next(createError(401, "Invalid email or password"));
      return;
    }
    res.status(200).json({ message: "Login successful" });
    console.log("someone logged in!!");
    return;
  } catch (err) {
    next(createError(500, "Error logging in"));
    return;
  }
});

export default router;
