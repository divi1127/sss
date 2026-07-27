const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { pool } = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const [rows] = await pool.query('SELECT id FROM admins WHERE email = ?', [email]);
    if (rows.length === 0) return res.json({ message: 'If the email exists, a reset link has been sent' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await pool.query('INSERT INTO password_resets (email, token, type, expires_at) VALUES (?, ?, ?, ?)', [email, token, 'admin', expiresAt]);

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/reset-password/${token}`;
    console.log('--- PASSWORD RESET (dev) ---');
    console.log('Admin:', email);
    console.log('Reset URL:', resetUrl);
    console.log('-----------------------------');

    const { sendPasswordResetEmail } = require('../utils/email');
    sendPasswordResetEmail(email, resetUrl);

    res.json({ message: 'If the email exists, a reset link has been sent', resetUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: 'Token and password required' });

    const [rows] = await pool.query(
      'SELECT * FROM password_resets WHERE token = ? AND type = ? AND used = 0 AND expires_at > NOW()',
      [token, 'admin']
    );
    if (rows.length === 0) return res.status(400).json({ error: 'Invalid or expired token' });

    const hash = await bcrypt.hash(password, 10);
    await pool.query('UPDATE admins SET password_hash = ? WHERE email = ?', [hash, rows[0].email]);
    await pool.query('UPDATE password_resets SET used = 1 WHERE id = ?', [rows[0].id]);

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const [rows] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const admin = rows[0];
    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, email: admin.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/seed', async (req, res) => {
  try {
    const hash = await bcrypt.hash('admin123', 10);
    await pool.query('INSERT IGNORE INTO admins (email, password_hash) VALUES (?, ?)', ['admin@vesselwash.com', hash]);
    res.json({ message: 'Admin seeded: admin@vesselwash.com / admin123' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', authMiddleware, (req, res) => {
  res.json({ admin: req.admin });
});

module.exports = router;
