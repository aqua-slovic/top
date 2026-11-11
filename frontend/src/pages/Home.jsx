import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { PRODUCTS, CATEGORIES } from '../data/products.js';
import { openWhatsAppWithIp, SHOP_WHATSAPP } from '../utils/ip.js';

export default function Home() {
  const navigate = useNavigate();
  const [featured] = useState(PRODUCTS.filter(p => p.badge).slice(0, 5));
  const [popular] = useState(PRODUCTS.slice(0, 10));

  return (
    <>
      <Navbar />

      {/* Hero Banner */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">🛍️ Malawi's Online Shop</div>
            <h1>Quality Products,<br /><span className="hero-accent">Delivered to You</span></h1>
            <p>Shop electronics, clothing, groceries, beauty & home products. Add to cart, order via WhatsApp or email — pay on delivery.</p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-accent btn-lg">Shop Now</Link>
              <Link to="/contact" className="btn btn-secondary btn-lg">Contact Us</Link>
            </div>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">{PRODUCTS.length}+</span>
              <span className="hero-stat-label">Products</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">{CATEGORIES.length}</span>
              <span className="hero-stat-label">Categories</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">Free</span>
              <span className="hero-stat-label">Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="trust-bar">
        <div className="container">
          <div className="trust-items">
            <div className="trust-item">
              <span className="trust-icon">🚚</span>
              <div>
                <strong>Nationwide Delivery</strong>
                <small>Across all of Malawi</small>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">💰</span>
              <div>
                <strong>Pay on Delivery</strong>
                <small>No upfront payment</small>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">💬</span>
              <div>
                <strong>WhatsApp Support</strong>
                <small>Quick & easy ordering</small>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">✅</span>
              <div>
                <strong>Quality Guaranteed</strong>
                <small>Trusted products</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <div className="container">
        <div className="section-title">
          <h2>Shop by Category</h2>
        </div>
        <div className="category-grid">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className="category-card"
              onClick={() => navigate(`/shop?category=${c.id}`)}
              style={{ '--cat-color': c.color }}
            >
              <span className="category-icon">{c.icon}</span>
              <span className="category-name">{c.name}</span>
              <span className="category-count">
                {PRODUCTS.filter(p => p.category_id === c.id).length} items
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      {featured.length > 0 && (
        <div className="container">
          <div className="section-title">
            <h2>⭐ Featured Products</h2>
            <Link to="/shop">See all</Link>
          </div>
          <div className="grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* All Products */}
      <div className="container">
        <div className="section-title">
          <h2>Popular Products</h2>
          <Link to="/shop">Browse all →</Link>
        </div>
        <div className="grid">
          {popular.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container">
          <h2>Ready to order?</h2>
          <p>Browse our products, add to cart, and place your order via WhatsApp or email. No payment upfront — pay when it arrives!</p>
          <div className="hero-actions">
            <Link to="/shop" className="btn btn-accent btn-lg">Start Shopping</Link>
            <a
              href={`https://wa.me/${SHOP_WHATSAPP}`}
              className="btn btn-secondary btn-lg"
              target="_blank"
              rel="noreferrer"
              onClick={(e) => {
                e.preventDefault();
                openWhatsAppWithIp({ source: 'Home Banner CTA' });
              }}
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
