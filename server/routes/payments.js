const express = require('express');
const { pool } = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { search, status: filterStatus, method } = req.query;
    let sql = `SELECT p.*, o.total_amount, o.status as order_status, o.order_source,
               c.name as customer_name, c.phone as customer_phone, c.email as customer_email
               FROM payments p
               JOIN orders o ON p.order_id = o.id
               JOIN customers c ON o.customer_id = c.id`;
    const params = [];
    const conditions = [];

    if (search) {
      conditions.push(`(c.name LIKE ? OR c.phone LIKE ? OR p.transaction_id LIKE ? OR p.order_id LIKE ?)`);
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (filterStatus) {
      conditions.push(`p.status = ?`);
      params.push(filterStatus);
    }
    if (method) {
      conditions.push(`p.method = ?`);
      params.push(method);
    }

    if (conditions.length > 0) sql += ` WHERE ${conditions.join(' AND ')}`;
    sql += ` ORDER BY p.created_at DESC`;

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, o.total_amount, o.status as order_status, o.order_source,
              c.name as customer_name, c.phone as customer_phone, c.email as customer_email
       FROM payments p
       JOIN orders o ON p.order_id = o.id
       JOIN customers c ON o.customer_id = c.id
       WHERE p.id = ?`, [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Payment not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/verify', authMiddleware, async (req, res) => {
  try {
    const { status, transactionId, notes } = req.body;
    const validStatuses = ['verified', 'failed', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updates = ['status = ?', 'verified_by = ?', 'verified_at = NOW()'];
    const vals = [status, req.admin.id];

    if (transactionId) { updates.push('transaction_id = ?'); vals.push(transactionId); }
    if (notes !== undefined) { updates.push('notes = ?'); vals.push(notes); }

    vals.push(req.params.id);
    await pool.query(`UPDATE payments SET ${updates.join(', ')} WHERE id = ?`, vals);

    const [payment] = await pool.query('SELECT order_id FROM payments WHERE id = ?', [req.params.id]);
    if (payment.length > 0) {
      const orderStatus = status === 'verified' ? 'Confirmed' : status === 'failed' ? 'Payment Failed' : 'Cancelled';
      await pool.query('UPDATE orders SET status = ? WHERE id = ?', [orderStatus, payment[0].order_id]);
    }

    res.json({ message: `Payment ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
