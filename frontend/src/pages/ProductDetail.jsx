import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatMWK } from '../utils/currency.js';
import { getProduct, getCategory, PRODUCTS } from '../data/products.js';
import { openWhatsAppWithIp } from '../utils/ip.js';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = getProduct(id);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="empty-state">
            <h2>Product not found</h2>
            <p className="muted">The product you're looking for doesn't exist or has been removed.</p>
            <Link to="/shop" className="btn btn-accent">Browse products</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const max = Math.max(1, Number(product.stock) || 1);
  const category = getCategory(product.category_id);
  const related = PRODUCTS.filter(p => p.category_id === product.category_id && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <Navbar />
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-sep">/</span>
          <Link to="/shop">Shop</Link>
          <span className="breadcrumb-sep">/</span>
          {category && (
            <>
              <Link to={`/shop?category=${category.id}`}>{category.name}</Link>
              <span className="breadcrumb-sep">/</span>
            </>
          )}
          <span>{product.name}</span>
        </nav>

        <div className="detail">
          <div className="detail-image">
            {product.badge && <span className="product-badge detail-badge">{product.badge}</span>}
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} />
            ) : (
              <span className="placeholder" style={{ fontSize: 80, color: '#999' }}>&#128717;</span>
            )}
          </div>

          <div className="detail-body">
            <p className="detail-category">{category?.name || 'Uncategorised'}</p>
            <h1>{product.name}</h1>
            <div className="price">{formatMWK(product.price)}</div>

            <div className="detail-divider"></div>

            <p className="detail-desc">{product.description || 'No description available.'}</p>

            <span className={`stock-label ${Number(product.stock) > 0 ? '' : 'out'}`}>
              {Number(product.stock) > 0 ? `✓ In stock (${product.stock} available)` : '✗ Out of stock'}
            </span>

            <div className="qty-row">
              <label htmlFor="qty">Quantity:</label>
              <select
                id="qty"
                className="qty-select"
                value={quantity}
                onChange={(e) => setQuantity(Math.min(max, Number(e.target.value)))}
              >
                {Array.from({ length: Math.min(max, 10) }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div className="detail-actions">
              <button
                className={`btn btn-accent btn-lg ${added ? 'btn-success-flash' : ''}`}
                disabled={Number(product.stock) <= 0}
                onClick={handleAdd}
              >
                {added ? '✓ Added to cart!' : '🛒 Add to cart'}
              </button>
              <Link to="/cart" className="btn btn-secondary btn-lg">View cart</Link>
            </div>

            <button
              type="button"
              className="btn btn-whatsapp-outline btn-block mt-8"
              onClick={() => openWhatsAppWithIp({
                source: `Product Page (${product.name})`,
                details: { productName: product.name, price: formatMWK(product.price) }
              })}
            >
              💬 Ask about this product on WhatsApp
            </button>

            <div className="detail-note">
              <div className="note-item">💰 <strong>Pay on delivery</strong> — no payment taken now</div>
              <div className="note-item">📱 <strong>Order via WhatsApp or email</strong></div>
              <div className="note-item">🚚 <strong>Delivered across Malawi</strong></div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <>
            <div className="section-title">
              <h2>You may also like</h2>
            </div>
            <div className="grid">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
