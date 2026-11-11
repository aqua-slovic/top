import { useState, useEffect } from 'react';
import { getClientIp, openWhatsAppWithIp, SHOP_WHATSAPP_DISPLAY } from '../utils/ip.js';

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);
  const [ip, setIp] = useState('Resolving…');
  const [quickMsg, setQuickMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getClientIp().then((res) => {
      if (isMounted) setIp(res);
    });
    return () => { isMounted = false; };
  }, []);

  const handleStartChat = async (preset) => {
    setLoading(true);
    const msg = preset || quickMsg.trim();
    await openWhatsAppWithIp({
      message: msg ? `*Quick Inquiry:*\n${msg}` : '',
      source: 'Floating WhatsApp Widget'
    });
    setLoading(false);
    setOpen(false);
    setQuickMsg('');
  };

  return (
    <div className="floating-wap-wrapper" aria-label="WhatsApp Contact">
      {/* Expanded Quick Chat Card */}
      {open && (
        <div className="floating-wap-card" role="dialog" aria-labelledby="wap-card-title">
          <div className="wap-card-header">
            <div className="wap-card-header-info">
              <div className="wap-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </div>
              <div>
                <h3 id="wap-card-title">TOP CARE Support</h3>
                <span className="wap-status-pill">
                  <span className="wap-status-dot"></span> Online • Fast reply
                </span>
              </div>
            </div>
            <button
              type="button"
              className="wap-close-btn"
              onClick={() => setOpen(false)}
              aria-label="Close WhatsApp chat"
            >
              ✕
            </button>
          </div>

          <div className="wap-card-body">
            <p className="wap-welcome-text">
              Hello! 👋 Chat directly with our team on WhatsApp for orders, delivery status, or product inquiries across Malawi.
            </p>

            <div className="wap-ip-banner">
              <span className="wap-shield-icon">🛡️</span>
              <div className="wap-ip-info">
                <strong>Sender IP Verified:</strong> <code>{ip}</code>
                <small>Sent with your message for verified customer security</small>
              </div>
            </div>

            <div className="wap-quick-chips">
              <button
                type="button"
                className="wap-chip"
                onClick={() => handleStartChat('Hi, I want to inquire about nationwide delivery.')}
              >
                🚚 Delivery Info
              </button>
              <button
                type="button"
                className="wap-chip"
                onClick={() => handleStartChat('Hi, I need assistance with product availability.')}
              >
                🛍️ Product Inquiry
              </button>
              <button
                type="button"
                className="wap-chip"
                onClick={() => handleStartChat('Hi, I would like to track my order.')}
              >
                📦 Track Order
              </button>
            </div>

            <div className="wap-input-wrap">
              <input
                type="text"
                placeholder="Type your message or question…"
                value={quickMsg}
                onChange={(e) => setQuickMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleStartChat();
                }}
              />
            </div>

            <button
              type="button"
              className="wap-send-btn"
              disabled={loading}
              onClick={() => handleStartChat()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
              </svg>
              <span>{loading ? 'Preparing…' : 'Chat on WhatsApp (IP Verified)'}</span>
            </button>

            <div className="wap-footer-note">
              <span>Direct WhatsApp: <strong>{SHOP_WHATSAPP_DISPLAY}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        type="button"
        className={`floating-wap-btn ${open ? 'active' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Contact TOP CARE on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        <span className="wap-btn-pulse"></span>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#ffffff">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
        <span className="floating-wap-label">WhatsApp</span>
      </button>
    </div>
  );
}

