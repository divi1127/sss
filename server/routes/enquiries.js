const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const authMiddleware = require('../middleware/auth');

// Create enquiry
router.post('/', async (req, res) => {
  const { product_id, name, phone, message } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Name and phone are required' });
  try {
    await pool.query(
      'INSERT INTO enquiries (product_id, name, phone, message) VALUES (?, ?, ?, ?)',
      [product_id || null, name, phone, message || '']
    );
    res.status(201).json({ message: 'Enquiry submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Get all enquiries
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, p.name as product_name
      FROM enquiries e
      LEFT JOIN products p ON e.product_id = p.id
      ORDER BY e.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Update enquiry status
router.put('/:id', authMiddleware, async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query('UPDATE enquiries SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Delete enquiry
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM enquiries WHERE id = ?', [req.params.id]);
    res.json({ message: 'Enquiry deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
