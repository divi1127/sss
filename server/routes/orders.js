const express = require('express');
const { pool } = require('../config/db');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');
const customerAuth = require('./customerAuth');
const { transformItem, transformArray } = require('../utils/url');
const { sendOrderConfirmation, sendAdminOrderAlert, sendStatusUpdate, sendDeliveryReviewRequest } = require('../utils/email');

const router = express.Router();

router.post('/', upload.single('paymentScreenshot'), async (req, res) => {
  try {
    const { customerName, customerPhone, customerAddress, customerEmail, items, orderSource, userId } = req.body;

    if (!customerName || !customerPhone || !items) {
      return res.status(400).json({ error: 'Name, phone, and items are required' });
    }

    let parsedItems;
    try {
      parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
    } catch {
      return res.status(400).json({ error: 'Invalid items format' });
    }

    if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
      return res.status(400).json({ error: 'At least one item is required' });
    }

    const source = orderSource || 'online_payment';
    const screenshotUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const status = source === 'online_payment' ? 'Payment Verification Pending' : 'Pending';

    let totalAmount = 0;
    for (const item of parsedItems) {
      totalAmount += item.price * item.quantity;
    }

    const [customerResult] = await pool.query(
      'INSERT INTO customers (name, phone, address, email) VALUES (?, ?, ?, ?)',
      [customerName, customerPhone, customerAddress || '', customerEmail || null]
    );
    const customerId = customerResult.insertId;

    const [orderResult] = await pool.query(
      'INSERT INTO orders (customer_id, user_id, total_amount, order_source, payment_screenshot_url, status) VALUES (?, ?, ?, ?, ?, ?)',
      [customerId, userId || null, totalAmount, source, screenshotUrl, status]
    );
    const orderId = orderResult.insertId;

    for (const item of parsedItems) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.productId || null, item.quantity, item.price]
      );
    }

    const [orderRows] = await pool.query(
      'SELECT o.*, c.name as customer_name, c.phone as customer_phone, c.address as customer_address, c.email as customer_email FROM orders o JOIN customers c ON o.customer_id = c.id WHERE o.id = ?',
      [orderId]
    );
    const [itemRows] = await pool.query(
      'SELECT oi.*, p.name as product_name, p.image_url FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
      [orderId]
    );

    if (source === 'online_payment') {
      await pool.query(
        'INSERT INTO payments (order_id, amount, method, status, screenshot_url) VALUES (?, ?, ?, ?, ?)',
        [orderId, totalAmount, 'upi', 'pending', screenshotUrl]
      );
    }

    if (customerEmail) {
      sendOrderConfirmation(transformItem(orderRows[0]), itemRows, customerEmail).catch(() => {});
    }
    // Alert admin of new order
    sendAdminOrderAlert(transformItem({ ...orderRows[0], customer_name: customerName, customer_phone: customerPhone, order_source: source }), itemRows).catch(() => {});

    res.status(201).json({
      orderId,
      totalAmount,
      status,
      orderSource: source,
      message: 'Order placed successfully',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { search, source, status: filterStatus } = req.query;
    let sql = `SELECT o.*, c.name as customer_name, c.phone as customer_phone, c.address as customer_address, c.email as customer_email FROM orders o JOIN customers c ON o.customer_id = c.id`;
    const params = [];
    const conditions = [];

    if (search) {
      conditions.push(`(c.name LIKE ? OR c.phone LIKE ? OR o.id LIKE ?)`);
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (source) {
      conditions.push(`o.order_source = ?`);
      params.push(source);
    }
    if (filterStatus) {
      conditions.push(`o.status = ?`);
      params.push(filterStatus);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    sql += ` ORDER BY o.created_at DESC`;

    const [rows] = await pool.query(sql, params);
    res.json(transformArray(rows));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/track/:id', async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.id, o.total_amount, o.order_source, o.status, o.created_at,
             o.tracking_number, o.estimated_delivery,
             c.name as customer_name, c.phone as customer_phone
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      WHERE o.id = ?
    `, [req.params.id]);

    if (orders.length === 0) return res.status(404).json({ error: 'Order not found' });

    const [items] = await pool.query(`
      SELECT oi.quantity, oi.price, p.name as product_name
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [req.params.id]);

    res.json({ ...orders[0], items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.*, c.name as customer_name, c.phone as customer_phone, c.address as customer_address, c.email as customer_email
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      WHERE o.id = ?
    `, [req.params.id]);

    if (orders.length === 0) return res.status(404).json({ error: 'Order not found' });

    const [items] = await pool.query(`
      SELECT oi.*, p.name as product_name, p.image_url
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [req.params.id]);

    res.json(transformItem({ ...orders[0], items }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status, tracking_number, estimated_delivery } = req.body;
    const validStatuses = ['Payment Verification Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled', 'Payment Failed', 'Pending'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    let updateQuery = 'UPDATE orders SET status = ?';
    const updateParams = [status];
    if (tracking_number !== undefined) { updateQuery += ', tracking_number = ?'; updateParams.push(tracking_number || null); }
    if (estimated_delivery !== undefined) { updateQuery += ', estimated_delivery = ?'; updateParams.push(estimated_delivery || null); }
    updateQuery += ' WHERE id = ?';
    updateParams.push(req.params.id);
    await pool.query(updateQuery, updateParams);

    const [orders] = await pool.query(`
      SELECT o.*, c.name as customer_name, c.phone as customer_phone, c.email as customer_email
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      WHERE o.id = ?
    `, [req.params.id]);

    if (orders.length > 0 && orders[0].customer_email) {
      sendStatusUpdate(orders[0], orders[0].customer_email).catch(() => {});
      if (status === 'Delivered') {
        setTimeout(() => sendDeliveryReviewRequest(orders[0], orders[0].customer_email).catch(() => {}), 3000);
      }
    }

    res.json({ message: 'Order status updated', status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/my', customerAuth.authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT o.*, c.name as customer_name, c.phone as customer_phone, c.address as customer_address
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [req.user.id]);
    res.json(transformArray(rows));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/stats/summary', authMiddleware, async (req, res) => {
  try {
    const [totalOrders] = await pool.query('SELECT COUNT(*) as count FROM orders');
    const [pendingVerification] = await pool.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Payment Verification Pending'");
    const [revenue] = await pool.query("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status IN ('Confirmed','Out for Delivery','Delivered')");
    const [confirmed] = await pool.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Confirmed'");
    const [delivered] = await pool.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Delivered'");
    const [todayOrders] = await pool.query("SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = CURDATE()");
    const [weekRevenue] = await pool.query("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1) AND status IN ('Confirmed','Out for Delivery','Delivered')");
    const [sourceBreakdown] = await pool.query('SELECT order_source, COUNT(*) as count FROM orders GROUP BY order_source');
    const [paymentMethodStats] = await pool.query("SELECT method, COUNT(*) as count FROM payments GROUP BY method");
    const [recentOrders] = await pool.query(`
      SELECT o.id, o.total_amount, o.status, o.order_source, o.created_at,
             c.name as customer_name
      FROM orders o JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC LIMIT 5
    `);

    res.json({
      totalOrders: totalOrders[0].count,
      pendingVerification: pendingVerification[0].count,
      revenue: revenue[0].total,
      confirmed: confirmed[0].count,
      delivered: delivered[0].count,
      todayOrders: todayOrders[0].count,
      weekRevenue: weekRevenue[0].total,
      sourceBreakdown,
      paymentMethodStats,
      recentOrders,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
