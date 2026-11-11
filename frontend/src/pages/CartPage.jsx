import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatMWK } from '../utils/currency.js';

export default function CartPage() {
  const { items, total, count, setQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="empty-state">
            <h2>Your cart is empty</h2>
            <p className="muted">Add some products and come back to place your order.</p>
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
        <div className="cart-layout">
          <div className="panel cart-items">
            <h2>Shopping Cart <span className="muted">({count} items)</span></h2>
            {items.map((it) => (
              <div className="cart-item" key={it.id}>
                {it.image_url ? (
                  <img src={it.image_url} alt={it.name} />
                ) : (
                  <div style={{ width: 80, height: 80 }} className="panel text-center">&#128717;</div>
                )}
                <div className="cart-item-body">
                  <h3>{it.name}</h3>
                  <div className="price">{formatMWK(it.quantity * it.price)}</div>
                  <div className="cart-item-actions">
                    <select
                      className="qty-select"
                      value={it.quantity}
                      onChange={(e) => setQuantity(it.id, Number(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                    <button className="btn btn-sm btn-outline" onClick={() => removeItem(it.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="panel cart-subtotal">
            <h2 style={{ fontSize: 18 }}>Subtotal</h2>
            <div style={{ fontSize: 20 }}>
              <strong>{formatMWK(total)}</strong>
            </div>
            <p className="note">Delivery arranged by the shop on confirmation.</p>
            <button className="btn btn-accent btn-block" onClick={() => navigate('/checkout')}>
              Proceed to checkout
            </button>
            <p className="note mt-8">No payment is taken now. You choose email or WhatsApp to send the order.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}