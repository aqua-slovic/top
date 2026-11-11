import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { formatMWK } from '../utils/currency.js';

export default function OrderSuccess() {
  const { state } = useLocation();
  const order = state?.order || null;

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="success-box">
          <div className="success-icon">✅</div>
          <h2>Order Sent Successfully!</h2>
          {order?.channel === 'whatsapp' && (
            <p>
              Your order was copied into WhatsApp.{' '}
              {state?.opened
                ? 'Press send on the opened chat to deliver it to the shop.'
                : 'Press the button below to open WhatsApp and send it.'}
            </p>
          )}
          {order?.channel === 'email' && (
            <p>Your order has been prepared as an email. Please press send in your email app to deliver it to the shop.</p>
          )}

          {order && (
            <div className="panel">
              <p><strong>Reference:</strong> <code>{order.reference}</code></p>
              <p><strong>Customer:</strong> {order.customerName}</p>
              
              <div className="summary-rows">
                {(order.items || []).map((it, i) => (
                  <div className="summary-row" key={i}>
                    <span>{it.name} ×{it.quantity}</span>
                    <span>{formatMWK(it.quantity * it.price)}</span>
                  </div>
                ))}
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>{formatMWK(order.total)}</span>
              </div>

              <div className="row mt-8" style={{ justifyContent: 'center' }}>
                {order?.channel === 'whatsapp' && state?.waLink && (
                  <a className="btn btn-accent btn-lg" href={state.waLink} target="_blank" rel="noreferrer">
                    📱 Open WhatsApp to Send
                  </a>
                )}
                <Link to="/shop" className="btn btn-secondary btn-lg">Continue Shopping</Link>
              </div>

              <p className="note text-center mt-8">
                💰 No payment made — the shop will contact you and you pay on delivery.
              </p>
            </div>
          )}

          {!order && (
            <div className="panel">
              <p className="muted">No order details available. If you placed an order, please check your WhatsApp or email.</p>
              <Link to="/shop" className="btn btn-accent btn-block">Browse products</Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
