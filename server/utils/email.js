const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    transporter = { sendMail: async (opts) => { console.log('--- EMAIL (dev mode) ---'); console.log('To:', opts.to); console.log('Subject:', opts.subject); console.log('Body:', opts.html); console.log('------------------------'); } };
  }
  return transporter;
}

async function sendOrderConfirmation(order, items, customerEmail) {
  if (!customerEmail) return;
  const trackUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/track-order/${order.id}`;
  const statusColor = order.status === 'Payment Verification Pending' ? '#f59e0b' : '#6b7280';
  const itemsHtml = items.map(i => `<tr style="border-bottom:1px solid #e5e7eb"><td style="padding:8px">${i.product_name || `Product #${i.product_id}`}</td><td style="padding:8px;text-align:center">${i.quantity}</td><td style="padding:8px;text-align:right">₹${parseFloat(i.price).toFixed(2)}</td><td style="padding:8px;text-align:right">₹${(i.quantity * parseFloat(i.price)).toFixed(2)}</td></tr>`).join('');

  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:Segoe UI,sans-serif">
      <div style="background:#16a34a;color:white;padding:30px;text-align:center;border-radius:12px 12px 0 0">
        <h1 style="margin:0;font-size:24px">Order Confirmed!</h1>
        <p style="margin:8px 0 0;opacity:0.9">Order #${order.id}</p>
      </div>
      <div style="background:#f9fafb;padding:30px;border-radius:0 0 12px 12px">
        <p style="color:#374151;font-size:16px">Thank you for your order!</p>
        <div style="background:white;border-radius:8px;padding:16px;margin:16px 0">
          <p style="margin:0 0 8px;color:#6b7280;font-size:14px"><strong>Status:</strong> <span style="color:${statusColor}">${order.status}</span></p>
          <p style="margin:0 0 8px;color:#6b7280;font-size:14px"><strong>Total:</strong> ₹${parseFloat(order.total_amount).toFixed(2)}</p>
          <p style="margin:0;color:#6b7280;font-size:14px"><strong>Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
        </div>
        <h3 style="color:#374151;margin:16px 0 8px">Items Ordered</h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <thead><tr style="background:#f3f4f6"><th style="padding:8px;text-align:left">Product</th><th style="padding:8px;text-align:center">Qty</th><th style="padding:8px;text-align:right">Price</th><th style="padding:8px;text-align:right">Subtotal</th></tr></thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <div style="text-align:center;margin:24px 0">
          <a href="${trackUrl}" style="display:inline-block;background:#16a34a;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px">Track Your Order</a>
        </div>
        <p style="color:#6b7280;font-size:13px;text-align:center;margin-top:16px">You can also copy this link to track: <br><a href="${trackUrl}" style="color:#2563eb">${trackUrl}</a></p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
        <p style="color:#9ca3af;font-size:12px;text-align:center">S CUBE - Premium Vessel Washing Liquid<br>RAJES SOLUTIONS</p>
      </div>
    </div>`;

  try {
    await getTransporter().sendMail({
      from: `"S CUBE" <${process.env.SMTP_USER || 'noreply@scube.in'}>`,
      to: customerEmail,
      subject: `Order Confirmed - #${order.id} | S CUBE`,
      html,
    });
    console.log('Order confirmation email sent to', customerEmail);
  } catch (err) {
    console.error('Failed to send email:', err.message);
  }
}

async function sendStatusUpdate(order, customerEmail) {
  if (!customerEmail) return;
  const trackUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/track-order/${order.id}`;
  const statusColors = {
    'Confirmed': '#16a34a',
    'Out for Delivery': '#3b82f6',
    'Delivered': '#059669',
    'Cancelled': '#dc2626',
    'Payment Failed': '#dc2626',
  };
  const color = statusColors[order.status] || '#6b7280';
  const icon = order.status === 'Cancelled' || order.status === 'Payment Failed' ? '❌' : '✅';

  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:Segoe UI,sans-serif">
      <div style="background:#16a34a;color:white;padding:30px;text-align:center;border-radius:12px 12px 0 0">
        <h1 style="margin:0;font-size:24px">${icon} Order Update</h1>
        <p style="margin:8px 0 0;opacity:0.9">Order #${order.id}</p>
      </div>
      <div style="background:#f9fafb;padding:30px;border-radius:0 0 12px 12px">
        <p style="color:#374151;font-size:16px">Your order status has been updated.</p>
        <div style="background:white;border-radius:8px;padding:16px;margin:16px 0;text-align:center">
          <p style="margin:0;color:#6b7280;font-size:14px">Current Status</p>
          <p style="margin:4px 0 0;font-size:20px;font-weight:bold;color:${color}">${order.status}</p>
        </div>
        <div style="text-align:center;margin:24px 0">
          <a href="${trackUrl}" style="display:inline-block;background:#16a34a;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px">Track Your Order</a>
        </div>
        <p style="color:#6b7280;font-size:13px;text-align:center;margin-top:16px">Track link: <a href="${trackUrl}" style="color:#2563eb">${trackUrl}</a></p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
        <p style="color:#9ca3af;font-size:12px;text-align:center">S CUBE - Premium Vessel Washing Liquid</p>
      </div>
    </div>`;

  try {
    await getTransporter().sendMail({
      from: `"S CUBE" <${process.env.SMTP_USER || 'noreply@scube.in'}>`,
      to: customerEmail,
      subject: `Order Update - #${order.id} | ${order.status} | S CUBE`,
      html,
    });
    console.log('Status update email sent to', customerEmail);
  } catch (err) {
    console.error('Failed to send email:', err.message);
  }
}

module.exports = { sendOrderConfirmation, sendStatusUpdate };
