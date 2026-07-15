const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

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

router.post('/seed', async (req, res) => {
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
