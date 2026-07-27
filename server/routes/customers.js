const express = require('express');
const { pool } = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { search, sort } = req.query;
    let sql = `SELECT c.*, 
               (SELECT COUNT(*) FROM orders WHERE customer_id = c.id) as total_orders,
               (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE customer_id = c.id) as total_spent,
               (SELECT MAX(created_at) FROM orders WHERE customer_id = c.id) as last_order_date
               FROM customers c`;
    const params = [];

    if (search) {
      sql += ` WHERE c.name LIKE ? OR c.phone LIKE ? OR c.email LIKE ?`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (sort === 'orders') sql += ` ORDER BY total_orders DESC`;
    else if (sort === 'spent') sql += ` ORDER BY total_spent DESC`;
    else if (sort === 'name') sql += ` ORDER BY c.name ASC`;
    else sql += ` ORDER BY c.created_at DESC`;

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const [customers] = await pool.query(`
      SELECT c.*,
        (SELECT COUNT(*) FROM orders WHERE customer_id = c.id) as total_orders,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE customer_id = c.id) as total_spent,
        (SELECT MAX(created_at) FROM orders WHERE customer_id = c.id) as last_order_date
      FROM customers c WHERE c.id = ?
    `, [req.params.id]);

    if (customers.length === 0) return res.status(404).json({ error: 'Customer not found' });

    const [orders] = await pool.query(`
      SELECT o.id, o.total_amount, o.order_source, o.status, o.created_at
      FROM orders o WHERE o.customer_id = ? ORDER BY o.created_at DESC
    `, [req.params.id]);

    res.json({ ...customers[0], orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
