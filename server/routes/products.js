const express = require('express');
const { pool } = require('../config/db');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');
const { transformItem, transformArray } = require('../utils/url');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { sort, size } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (size) {
      query += ' AND size = ?';
      params.push(size);
    }

    if (sort === 'price_asc') query += ' ORDER BY price ASC';
    else if (sort === 'price_desc') query += ' ORDER BY price DESC';
    else if (sort === 'name') query += ' ORDER BY name ASC';
    else query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json(transformArray(rows));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/stats/summary', authMiddleware, async (req, res) => {
  try {
    const [total] = await pool.query('SELECT COUNT(*) as count FROM products');
    const [lowStock] = await pool.query('SELECT COUNT(*) as count FROM products WHERE stock IS NOT NULL AND stock < 10');
    const [lowStockProducts] = await pool.query('SELECT id, name, stock FROM products WHERE stock IS NOT NULL AND stock < 10 ORDER BY stock ASC LIMIT 5');

    res.json({
      totalProducts: total[0].count,
      lowStockCount: lowStock[0].count,
      lowStockProducts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(transformItem(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, size, stock } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, size, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, size, stock, imageUrl]
    );
    res.status(201).json(transformItem({ id: result.insertId, name, description, price, size, stock, image_url: imageUrl }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, size, stock } = req.body;
    let query = 'UPDATE products SET name=?, description=?, price=?, size=?, stock=?';
    const params = [name, description, price, size, stock];

    if (req.file) {
      query += ', image_url=?';
      params.push(`/uploads/${req.file.filename}`);
    }

    query += ' WHERE id=?';
    params.push(req.params.id);

    await pool.query(query, params);
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
