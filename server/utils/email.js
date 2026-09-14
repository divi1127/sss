const axios = require('axios');

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const FROM_NAME = 'S CUBE';
const FROM_EMAIL = process.env.FROM_EMAIL_ADDRESS || 'noreply@scube.in';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || null;
const CALL_NUMBER = '04322 222646';

// ─── Send via Brevo API ───────────────────────────────────────────────────────
async function sendEmail({ to, subject, html, toName }) {
  if (!BREVO_API_KEY) {
    // Dev mode fallback
    console.log('\n─── EMAIL (dev mode — no BREVO_API_KEY) ───');
    console.log('To:', to, toName ? `(${toName})` : '');
    console.log('Subject:', subject);
    console.log('Preview:', html.replace(/<[^>]*>/g, '').substring(0, 200) + '...');
    console.log('────────────────────────────────────────────\n');
    return;
  }

  try {
    const payload = {
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [{ email: to, name: toName || to }],
      subject,
      htmlContent: html,
    };

    await axios.post('https://api.brevo.com/v3/smtp/email', payload, {
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
    });
    console.log(`✉️  Email sent to ${to} — "${subject}"`);
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    console.error('Brevo email error:', msg);
  }
}

// ─── Shared HTML helpers ──────────────────────────────────────────────────────
function emailFooter() {
  return `
    <div style="border-top:1px solid #e5e7eb;margin-top:28px;padding-top:16px;text-align:center;">
      <img src="https://sss-liard-pi.vercel.app/logo.png" alt="S CUBE" width="50" style="margin-bottom:8px;border-radius:8px;" />
      <p style="color:#9ca3af;font-size:12px;margin:0;font-family:Arial,sans-serif;">S CUBE — Premium Home Care Products</p>
      <p style="color:#9ca3af;font-size:12px;margin:4px 0;font-family:Arial,sans-serif;">📞 ${CALL_NUMBER} &nbsp;|&nbsp; ✉️ info@scube.in</p>
      <p style="color:#9ca3af;font-size:11px;margin:4px 0;font-family:Arial,sans-serif;">Pudukkottai, Tamil Nadu, India</p>
    </div>`;
}

function headerBlock(title, subtitle) {
  return `
    <div style="background:linear-gradient(135deg,#16a34a,#15803d);color:white;padding:32px 28px;text-align:center;border-radius:12px 12px 0 0;">
      <div style="font-size:40px;margin-bottom:8px;">🧴</div>
      <h1 style="margin:0;font-size:22px;font-weight:700;font-family:Arial,sans-serif;">${title}</h1>
      ${subtitle ? `<p style="margin:8px 0 0;opacity:0.9;font-size:14px;font-family:Arial,sans-serif;">${subtitle}</p>` : ''}
    </div>`;
}

function wrapper(inner) {
  return `<!DOCTYPE html><html><body style="margin:0;padding:20px;background:#f3f4f6;font-family:Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
      ${inner}
    </div>
  </body></html>`;
}

// ─── 1. Order Confirmation (to Customer) ─────────────────────────────────────
async function sendOrderConfirmation(order, items, customerEmail) {
  if (!customerEmail) return;
  const trackUrl = `${CLIENT_URL}/track-order/${order.id}`;

  const itemRows = items.map(i => `
    <tr>
      <td style="padding:10px 8px;color:#374151;border-bottom:1px solid #f3f4f6;">${i.product_name || `Product #${i.product_id}`}</td>
      <td style="padding:10px 8px;text-align:center;color:#6b7280;border-bottom:1px solid #f3f4f6;">${i.quantity}</td>
      <td style="padding:10px 8px;text-align:right;color:#6b7280;border-bottom:1px solid #f3f4f6;">₹${parseFloat(i.price).toFixed(2)}</td>
      <td style="padding:10px 8px;text-align:right;font-weight:600;color:#111827;border-bottom:1px solid #f3f4f6;">₹${(i.quantity * parseFloat(i.price)).toFixed(2)}</td>
    </tr>`).join('');

  const html = wrapper(`
    ${headerBlock('Order Confirmed! 🎉', `Order #${order.id}`)}
    <div style="padding:28px;">
      <p style="color:#374151;font-size:16px;margin:0 0 20px;">Hi <strong>${order.customer_name || 'Valued Customer'}</strong>,<br><br>
      Thank you for choosing S CUBE! We've received your order and will process it shortly.</p>

      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin-bottom:20px;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="color:#6b7280;padding:4px 0;">Order ID</td><td style="font-weight:700;text-align:right;">#${order.id}</td></tr>
          <tr><td style="color:#6b7280;padding:4px 0;">Status</td><td style="color:#f59e0b;font-weight:600;text-align:right;">${order.status}</td></tr>
          <tr><td style="color:#6b7280;padding:4px 0;">Order Total</td><td style="font-weight:700;font-size:18px;color:#111827;text-align:right;">₹${parseFloat(order.total_amount).toFixed(2)}</td></tr>
          <tr><td style="color:#6b7280;padding:4px 0;">Date</td><td style="color:#374151;text-align:right;">${new Date(order.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</td></tr>
        </table>
      </div>

      <h3 style="color:#374151;margin:0 0 12px;font-size:15px;">Items Ordered</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <thead><tr style="background:#f3f4f6;">
          <th style="padding:10px 8px;text-align:left;color:#6b7280;">Product</th>
          <th style="padding:10px 8px;text-align:center;color:#6b7280;">Qty</th>
          <th style="padding:10px 8px;text-align:right;color:#6b7280;">Price</th>
          <th style="padding:10px 8px;text-align:right;color:#6b7280;">Total</th>
        </tr></thead>
        <tbody>${itemRows}</tbody>
      </table>

      <div style="text-align:center;margin:28px 0;">
        <a href="${trackUrl}" style="display:inline-block;background:#16a34a;color:white;padding:14px 36px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;">
          📦 Track Your Order
        </a>
      </div>

      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px;font-size:13px;color:#166534;">
        📞 Need help? Call us at <strong>${CALL_NUMBER}</strong> or WhatsApp us anytime!
      </div>
    </div>
    ${emailFooter()}
  `);

  await sendEmail({ to: customerEmail, toName: order.customer_name, subject: `✅ Order Confirmed — #${order.id} | S CUBE`, html });
}

// ─── 2. New Order Alert (to Admin) ───────────────────────────────────────────
async function sendAdminOrderAlert(order, items) {
  if (!ADMIN_EMAIL) return;
  const adminUrl = `${CLIENT_URL}/admin/orders`;

  const itemRows = items.map(i => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #f3f4f6;">${i.product_name || `Product #${i.product_id}`}</td>
      <td style="padding:8px;text-align:center;border-bottom:1px solid #f3f4f6;">${i.quantity}</td>
      <td style="padding:8px;text-align:right;font-weight:600;border-bottom:1px solid #f3f4f6;">₹${(i.quantity * parseFloat(i.price)).toFixed(2)}</td>
    </tr>`).join('');

  const html = wrapper(`
    ${headerBlock('🛍️ New Order Received!', `Order #${order.id} — Action Required`)}
    <div style="padding:28px;">
      <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:14px;margin-bottom:20px;font-size:14px;">
        ⚠️ <strong>A new order needs your attention!</strong> Please verify the payment and confirm.
      </div>

      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin-bottom:20px;font-size:14px;">
        <p style="margin:0 0 6px;"><strong>Customer:</strong> ${order.customer_name}</p>
        <p style="margin:0 0 6px;"><strong>Phone:</strong> ${order.customer_phone}</p>
        ${order.customer_email ? `<p style="margin:0 0 6px;"><strong>Email:</strong> ${order.customer_email}</p>` : ''}
        <p style="margin:0 0 6px;"><strong>Source:</strong> ${order.order_source}</p>
        <p style="margin:0;"><strong>Total:</strong> <span style="font-size:20px;font-weight:700;color:#16a34a;">₹${parseFloat(order.total_amount).toFixed(2)}</span></p>
      </div>

      <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e5e7eb;">
        <thead><tr style="background:#f3f4f6;">
          <th style="padding:8px;text-align:left;">Product</th>
          <th style="padding:8px;text-align:center;">Qty</th>
          <th style="padding:8px;text-align:right;">Subtotal</th>
        </tr></thead>
        <tbody>${itemRows}</tbody>
      </table>

      <div style="text-align:center;margin:24px 0;">
        <a href="${adminUrl}" style="display:inline-block;background:#2563eb;color:white;padding:14px 36px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">
          🔧 Open Admin Panel
        </a>
      </div>
    </div>
    ${emailFooter()}
  `);

  await sendEmail({ to: ADMIN_EMAIL, toName: 'S CUBE Admin', subject: `🛍️ New Order #${order.id} — ₹${parseFloat(order.total_amount).toFixed(2)} | S CUBE`, html });
}

// ─── 3. Status Update (to Customer) ──────────────────────────────────────────
async function sendStatusUpdate(order, customerEmail) {
  if (!customerEmail) return;
  const trackUrl = `${CLIENT_URL}/track-order/${order.id}`;

  const statusConfig = {
    'Confirmed':          { icon: '✅', color: '#16a34a', msg: 'Great news! Your order has been confirmed and we are preparing it for dispatch.' },
    'Out for Delivery':   { icon: '🚚', color: '#2563eb', msg: 'Your order is out for delivery! Our delivery partner is on the way.' },
    'Delivered':          { icon: '🎉', color: '#059669', msg: 'Your order has been delivered! We hope you love S CUBE.' },
    'Cancelled':          { icon: '❌', color: '#dc2626', msg: 'Your order has been cancelled. Please contact us if you have questions.' },
    'Payment Failed':     { icon: '❌', color: '#dc2626', msg: 'Payment verification failed. Please contact us for assistance.' },
  };
  const cfg = statusConfig[order.status] || { icon: '📦', color: '#6b7280', msg: 'Your order status has been updated.' };

  const trackingBlock = order.tracking_number ? `
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px;margin:16px 0;font-size:14px;">
      <p style="margin:0 0 4px;"><strong>🚚 Tracking Number:</strong> ${order.tracking_number}</p>
      ${order.estimated_delivery ? `<p style="margin:0;"><strong>📅 Estimated Delivery:</strong> ${new Date(order.estimated_delivery).toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</p>` : ''}
    </div>` : '';

  const reviewBlock = order.status === 'Delivered' ? `
    <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:16px;margin:16px 0;text-align:center;">
      <p style="margin:0 0 10px;color:#92400e;font-size:14px;"><strong>⭐ Enjoying S CUBE?</strong> Share your experience!</p>
      <a href="${trackUrl}" style="display:inline-block;background:#f59e0b;color:white;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">Write a Review</a>
    </div>` : '';

  const html = wrapper(`
    ${headerBlock(`${cfg.icon} Order Update`, `Order #${order.id} — ${order.status}`)}
    <div style="padding:28px;">
      <p style="color:#374151;font-size:15px;margin:0 0 20px;">${cfg.msg}</p>

      <div style="border:2px solid ${cfg.color}30;border-left:4px solid ${cfg.color};border-radius:10px;padding:20px;text-align:center;margin-bottom:16px;">
        <p style="margin:0 0 4px;color:#6b7280;font-size:13px;">Current Status</p>
        <p style="margin:0;font-size:24px;font-weight:700;color:${cfg.color};">${cfg.icon} ${order.status}</p>
      </div>

      ${trackingBlock}
      ${reviewBlock}

      <div style="text-align:center;margin:24px 0;">
        <a href="${trackUrl}" style="display:inline-block;background:#16a34a;color:white;padding:14px 36px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">
          📦 Track My Order
        </a>
      </div>

      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px;font-size:13px;color:#166534;">
        📞 Need help? Call us at <strong>${CALL_NUMBER}</strong>
      </div>
    </div>
    ${emailFooter()}
  `);

  await sendEmail({ to: customerEmail, toName: order.customer_name, subject: `${cfg.icon} Order #${order.id} is now ${order.status} | S CUBE`, html });
}

// ─── 4. Delivery Review Request (to Customer) ────────────────────────────────
async function sendDeliveryReviewRequest(order, customerEmail) {
  if (!customerEmail) return;
  const reviewUrl = `${CLIENT_URL}/track-order/${order.id}`;

  const html = wrapper(`
    ${headerBlock('🎉 Your Order is Delivered!', `Order #${order.id}`)}
    <div style="padding:28px;text-align:center;">
      <p style="color:#374151;font-size:16px;margin:0 0 12px;">Hi <strong>${order.customer_name || 'Valued Customer'}</strong>,</p>
      <p style="color:#6b7280;font-size:15px;margin:0 0 20px;">We hope you're loving your S CUBE product! Your feedback helps us improve and helps other customers make better decisions.</p>
      <div style="font-size:36px;margin:16px 0;">⭐⭐⭐⭐⭐</div>
      <a href="${reviewUrl}" style="display:inline-block;background:#f59e0b;color:white;padding:16px 40px;border-radius:10px;text-decoration:none;font-weight:700;font-size:17px;margin-bottom:20px;">
        ⭐ Leave a Review
      </a>
      <p style="color:#9ca3af;font-size:13px;margin:16px 0 0;">It only takes 1 minute!</p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px;margin-top:20px;font-size:13px;color:#166534;">
        📞 Questions? Call us at <strong>${CALL_NUMBER}</strong>
      </div>
    </div>
    ${emailFooter()}
  `);

  await sendEmail({ to: customerEmail, toName: order.customer_name, subject: `⭐ How was your S CUBE order? — Leave a Review!`, html });
}

// ─── 5. Password Reset ────────────────────────────────────────────────────────
async function sendPasswordResetEmail(email, resetUrl) {
  const html = wrapper(`
    ${headerBlock('🔒 Password Reset', 'S CUBE Account')}
    <div style="padding:28px;">
      <p style="color:#374151;font-size:15px;margin:0 0 20px;">You requested a password reset. Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${resetUrl}" style="display:inline-block;background:#16a34a;color:white;padding:14px 36px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;">
          🔒 Reset My Password
        </a>
      </div>
      <p style="color:#9ca3af;font-size:13px;text-align:center;margin:0;">If you didn't request this, safely ignore this email.</p>
    </div>
    ${emailFooter()}
  `);

  await sendEmail({ to: email, subject: '🔒 Password Reset | S CUBE', html });
}

module.exports = {
  sendOrderConfirmation,
  sendAdminOrderAlert,
  sendStatusUpdate,
  sendDeliveryReviewRequest,
  sendPasswordResetEmail,
};
