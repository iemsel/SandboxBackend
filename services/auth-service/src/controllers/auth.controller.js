/* eslint-disable prettier/prettier */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return reject(err);
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) return reject(err);
        resolve(hash);
      });
    });
  });
}

function comparePassword(password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, same) => {
      if (err) return reject(err);
      resolve(same);
    });
  });
}

// POST /register
async function register(req, res) {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ error: 'email, name and password are required' });
  }

  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email is already registered' });
    }

    const hash = await hashPassword(password);

    const [result] = await db.query(
      'INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)',
      [email, name, hash],
    );

    return res.status(201).json({
      id: result.insertId,
      email,
      name,
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

// POST /login
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    const ok = await comparePassword(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ sub: user.id, email: user.email, name: user.name }, JWT_SECRET, {
      expiresIn: '8h',
    });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

// GET /me
async function me(req, res) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    const [rows] = await db.query('SELECT id, email, name, created_at FROM users WHERE id = ?', [
      payload.sub,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error('Me error:', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

async function changePassword(req, res) {
  const { oldPassword, newPassword } = req.body;
  
  // MANUALLY GET USER ID FROM TOKEN (Like in your 'me' function)
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const userId = payload.sub; // This is your req.user.id equivalent

    const [rows] = await db.query("SELECT password_hash FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) return res.status(404).json({ error: "User not found" });
    
    const user = rows[0];
    const isMatch = await comparePassword(oldPassword, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: "Current password incorrect" });

    const newHash = await hashPassword(newPassword);
    await db.query("UPDATE users SET password_hash = ? WHERE id = ?", [newHash, userId]);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change Password error:", err);
    res.status(401).json({ error: "Invalid token or server error" });
  }
}

async function resetPasswordRequest(req, res) {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ error: "Email and new password are required" });
  }

  try {
    // 1. Check if user exists
    const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "No account found with that email" });
    }

    // 2. Hash new password
    const hash = await hashPassword(newPassword);

    // 3. Update database
    await db.query("UPDATE users SET password_hash = ? WHERE email = ?", [hash, email]);

    return res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  register,
  login,
  me,
  changePassword,
  resetPasswordRequest,
};
