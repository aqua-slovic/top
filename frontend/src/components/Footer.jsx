import { Link } from 'react-router-dom';
import { openWhatsAppWithIp, SHOP_WHATSAPP, SHOP_WHATSAPP_DISPLAY, SHOP_EMAIL } from '../utils/ip.js';

export default function Footer() {
  const year = new Date().getFullYear();

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    openWhatsAppWithIp({ source: 'Footer Support Link' });
  };

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <strong className="footer-logo">TOP<span>CARE</span></strong>
            <p>Your trusted shop for quality products across Malawi. We deliver nationwide — order by email or WhatsApp and pay on delivery.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/cart">Cart</Link>
          </div>
          <div className="footer-contact">
            <h4>Get in Touch</h4>
            <a
              href={`https://wa.me/${SHOP_WHATSAPP}`}
              target="_blank"
              rel="noreferrer"
              onClick={handleWhatsAppClick}
              title="Chat with TOP CARE on WhatsApp (IP Verified)"
            >
              📱 WhatsApp: {SHOP_WHATSAPP_DISPLAY}
            </a>
            <a href={`mailto:${SHOP_EMAIL}`}>📧 {SHOP_EMAIL}</a>
            <p>📍 Lilongwe & Blantyre, Malawi (Nationwide Delivery)</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} TOP CARE. All rights reserved.</span>
          <span className="muted">Prices are in Malawi Kwacha (MWK). Pay on delivery across Malawi.</span>
        </div>
      </div>
    </footer>
  );
}
