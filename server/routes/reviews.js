const express = require('express');
const { pool } = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Public: submit a review (anyone with order_id can submit)
router.post('/', async (req, res) => {
  try {
    const { order_id, product_id, customer_name, rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    const [result] = await pool.query(
      'INSERT INTO reviews (order_id, product_id, customer_name, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [order_id || null, product_id || null, customer_name || 'Anonymous', parseInt(rating), comment || '']
    );
    res.status(201).json({ id: result.insertId, message: 'Review submitted successfully! It will appear after approval.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public: get approved reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, customer_name, rating, comment, created_at FROM reviews WHERE product_id = ? AND status = "approved" ORDER BY created_at DESC',
      [req.params.productId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: get all reviews with optional status filter
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    let query = `
      SELECT r.*, 
             o.id as order_ref,
             p.name as product_name
      FROM reviews r
      LEFT JOIN orders o ON r.order_id = o.id
      LEFT JOIN products p ON r.product_id = p.id
    `;
    const params = [];
    if (status) {
      query += ' WHERE r.status = ?';
      params.push(status);
    }
    query += ' ORDER BY r.created_at DESC';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: get summary stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const [total] = await pool.query('SELECT COUNT(*) as count FROM reviews');
    const [pending] = await pool.query('SELECT COUNT(*) as count FROM reviews WHERE status = "pending"');
    const [approved] = await pool.query('SELECT COUNT(*) as count FROM reviews WHERE status = "approved"');
    const [avgRating] = await pool.query('SELECT AVG(rating) as avg FROM reviews WHERE status = "approved"');
    res.json({
      total: total[0].count,
      pending: pending[0].count,
      approved: approved[0].count,
      avgRating: avgRating[0].avg ? parseFloat(avgRating[0].avg).toFixed(1) : null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: approve or reject review
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    await pool.query('UPDATE reviews SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Review status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: delete review
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
