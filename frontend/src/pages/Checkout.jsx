import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatMWK } from '../utils/currency.js';
import { getClientIp } from '../utils/ip.js';

const SHOP_WHATSAPP = '265992393452';
const SHOP_EMAIL = 'malatawisdom07@gmail.com';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    deliveryAddress: '',
    channel: 'whatsapp',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const buildMessage = (ip) => {
    const lines = [];
    lines.push('New order from TOP CARE website');
    lines.push('');
    lines.push(`Customer: ${form.customerName.trim()}`);
    if (form.phone.trim()) lines.push(`Phone: ${form.phone.trim()}`);
    if (form.email.trim()) lines.push(`Email: ${form.email.trim()}`);
    if (form.deliveryAddress.trim()) lines.push(`Delivery address: ${form.deliveryAddress.trim()}`);
    lines.push('');
    lines.push('Items:');
    items.forEach((it) => {
      lines.push(`- ${it.name} x${it.quantity} — MK ${Number(it.quantity * it.price).toLocaleString()}`);
    });
    lines.push('');
    lines.push(`Total: MK ${Number(total).toLocaleString()}`);
    lines.push('');
    lines.push(`Sender IP: ${ip}`);
    lines.push(`Date: ${new Date().toLocaleString()}`);
    return lines.join('\n');
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.customerName.trim()) return setError('Please enter your name.');
    if (form.channel === 'email' && !form.email.trim()) return setError('Please enter your email so the shop can reach you.');
    if (form.channel === 'whatsapp' && !form.phone.trim()) return setError('Please enter your phone number (WhatsApp).');

    setSubmitting(true);
    try {
      const ip = await getClientIp();
      const message = buildMessage(ip);
      const reference = `TC-${Date.now()}`;
      const order = {
        id: reference,
        reference,
        channel: form.channel,
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        deliveryAddress: form.deliveryAddress.trim(),
        items: items.map((it) => ({ name: it.name, price: it.price, quantity: it.quantity })),
        total,
      };

      let waLink = null;
      if (form.channel === 'whatsapp') {
        waLink = `https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(message)}`;
        window.open(waLink, '_blank');
      } else {
        const mailto = `mailto:${SHOP_EMAIL}?subject=${encodeURIComponent('New TOP CARE order ' + reference)}&body=${encodeURIComponent(message)}`;
        window.location.href = mailto;
      }

      clearCart();
      navigate(`/order-success/${reference}`, { state: { order, waLink, opened: form.channel === 'whatsapp' } });
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="empty-state">
            <h2>Your cart is empty</h2>
            <p className="muted">Add products before checking out.</p>
            <Link to="/shop" className="btn btn-accent">Browse products</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="section-title"><h2>Checkout</h2></div>
        {error && <div className="alert alert-error">{error}</div>}

        <form className="checkout-grid" onSubmit={submit}>
          <div className="panel form-panel">
            <h3>Your details</h3>
            <div className="field">
              <label htmlFor="name">Full name *</label>
              <input id="name" value={form.customerName} onChange={set('customerName')} placeholder="e.g. John Banda" />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone number</label>
              <input id="phone" value={form.phone} onChange={set('phone')} placeholder="e.g. 0888123456" />
            </div>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input id="email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" />
            </div>
            <div className="field">
              <label htmlFor="address">Delivery address</label>
              <textarea
                id="address"
                rows="2"
                value={form.deliveryAddress}
                onChange={set('deliveryAddress')}
                placeholder="Town, area, landmark"
              />
            </div>

            <h3 style={{ marginTop: 16 }}>How do you want to send the order?</h3>
            <div className="channel-options">
              <label className={`option-card ${form.channel === 'whatsapp' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="channel"
                  value="whatsapp"
                  checked={form.channel === 'whatsapp'}
                  onChange={set('channel')}
                />
                <span>
                  <span className="option-title">WhatsApp</span>
                  <span className="option-desc">Opens WhatsApp with your order ready to send to the shop.</span>
                </span>
              </label>

              <label className={`option-card ${form.channel === 'email' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="channel"
                  value="email"
                  checked={form.channel === 'email'}
                  onChange={set('channel')}
                />
                <span>
                  <span className="option-title">Email</span>
                  <span className="option-desc">Opens your email app with the order ready to send.</span>
                </span>
              </label>
            </div>
          </div>

          <div className="panel summary-panel">
            <h3>Order summary</h3>
            <div className="summary-rows">
              {items.map((it) => (
                <div className="summary-row" key={it.id}>
                  <span>{it.name} x{it.quantity}</span>
                  <span>{formatMWK(it.quantity * it.price)}</span>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>{formatMWK(total)}</span>
            </div>
            <button type="submit" className="btn btn-accent btn-block" disabled={submitting}>
              {submitting ? 'Preparing…' : form.channel === 'whatsapp' ? 'Send order via WhatsApp' : 'Send order via email'}
            </button>
            <p className="note mt-8">No payment is taken here — the shop confirms and you pay on delivery.</p>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}