import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { CATEGORIES } from '../data/products.js';

export default function Navbar() {
  const { count } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/shop${search ? `?search=${encodeURIComponent(search)}` : ''}`);
    setMenuOpen(false);
  };

  const goCategory = (id) => {
    const qs = id ? `?category=${encodeURIComponent(id)}` : '';
    navigate(`/shop${qs}`);
    setMenuOpen(false);
  };

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="logo">
            <span>TOP</span>CARE
          </Link>

          <form className="search-area" onSubmit={onSearch}>
            <div className="search-box">
              <input
                type="text"
                aria-label="Search products"
                placeholder="Search TOP CARE products…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" aria-label="Search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </div>
          </form>

          <button
            type="button"
            className="hamburger"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>

          <Link to="/shop" className="topbar-link topbar-link-desktop">
            <small>Browse</small>
            <strong>Shop</strong>
          </Link>

          <Link to="/contact" className="topbar-link topbar-link-desktop">
            <small>Help</small>
            <strong>Contact</strong>
          </Link>

          <Link className="cart-link" to="/cart" aria-label={`Your cart, ${count} items`}>
            <span className="cart-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </span>
            <span>
              {count > 0 && <span className="cart-count">{count}</span>}
              Cart
            </span>
          </Link>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setMenuOpen(false)}>🏠 Home</Link>
          <Link to="/shop" onClick={() => setMenuOpen(false)}>🛍️ All products</Link>
          {CATEGORIES.map((c) => (
            <a
              key={c.id}
              href="#shop"
              onClick={(e) => { e.preventDefault(); goCategory(c.id); }}
            >
              {c.icon} {c.name}
            </a>
          ))}
          <Link to="/contact" onClick={() => setMenuOpen(false)}>📞 Contact</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)}>🛒 Cart ({count})</Link>
        </div>
      )}

      <nav className="subnav subnav-desktop">
        <div className="subnav-inner">
          <a href="#shop" onClick={(e) => { e.preventDefault(); goCategory(''); }}>All</a>
          {CATEGORIES.map((c) => (
            <a key={c.id} href="#shop" onClick={(e) => { e.preventDefault(); goCategory(c.id); }}>
              {c.icon} {c.name}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
