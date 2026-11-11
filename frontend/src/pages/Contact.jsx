import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import {
  getClientIp,
  getCachedIp,
  openWhatsAppWithIp,
  SHOP_WHATSAPP,
  SHOP_WHATSAPP_DISPLAY,
  SHOP_EMAIL
} from '../utils/ip.js';

const INQUIRY_TOPICS = [
  { id: 'order', label: '📦 Order Status & Tracking' },
  { id: 'product', label: '🛍️ Product Details & Availability' },
  { id: 'delivery', label: '🚚 Delivery & Areas Covered' },
  { id: 'payment', label: '💰 Pay on Delivery Questions' },
  { id: 'wholesale', label: '🏢 Bulk / Wholesale Purchases' },
  { id: 'support', label: '💬 General Inquiry / Feedback' },
];

const MALAWI_CITIES = [
  'Lilongwe',
  'Blantyre',
  'Mzuzu',
  'Zomba',
  'Kasungu',
  'Mangochi',
  'Salima',
  'Karonga',
  'Dedza',
  'Other / Outside Malawi'
];

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Lilongwe',
    topic: 'order',
    subject: '',
    message: '',
    channel: 'whatsapp',
  });

  const [clientIp, setClientIp] = useState(getCachedIp() || 'Resolving…');
  const [ipLoading, setIpLoading] = useState(!getCachedIp());
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch client IP on mount
  useEffect(() => {
    let isMounted = true;
    getClientIp().then((ip) => {
      if (isMounted) {
        setClientIp(ip);
        setIpLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (error) setError('');
  };

  const getTopicLabel = (id) => INQUIRY_TOPICS.find((t) => t.id === id)?.label || id;

  const buildStructuredMessage = (ipToUse) => {
    const refId = `TC-INQ-${Date.now().toString().slice(-6)}`;
    const timestamp = new Date().toLocaleString('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    const lines = [
      '📬 *NEW INQUIRY — TOP CARE WEBSITE*',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      `👤 *Name:* ${form.name.trim()}`,
      `📱 *Phone:* ${form.phone.trim() || 'Not specified'}`,
    ];

    if (form.email.trim()) {
      lines.push(`📧 *Email:* ${form.email.trim()}`);
    }
    if (form.city) {
      lines.push(`📍 *Location:* ${form.city}`);
    }

    lines.push(`🏷️ *Topic:* ${getTopicLabel(form.topic)}`);
    if (form.subject.trim()) {
      lines.push(`📌 *Subject:* ${form.subject.trim()}`);
    }

    lines.push('');
    lines.push('💬 *Message:*');
    lines.push(form.message.trim());
    lines.push('');
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('🛡️ *SECURITY & VERIFICATION:*');
    lines.push(`• Sender IP Address: ${ipToUse}`);
    lines.push(`• Timestamp: ${timestamp}`);
    lines.push(`• Reference ID: ${refId}`);
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return { message: lines.join('\n'), refId, timestamp, ip: ipToUse };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!form.name.trim()) {
      return setError('Please enter your full name.');
    }
    if (form.channel === 'whatsapp' && !form.phone.trim()) {
      return setError('Please enter your WhatsApp phone number so we can respond to you.');
    }
    if (form.channel === 'email' && !form.email.trim()) {
      return setError('Please enter your email address so we can reply to you.');
    }
    if (!form.message.trim()) {
      return setError('Please write your message or inquiry.');
    }

    setSubmitting(true);

    try {
      // Ensure we have the latest IP
      const ip = await getClientIp();
      setClientIp(ip);

      const { message, refId, timestamp } = buildStructuredMessage(ip);

      let dispatchedUrl = '';

      if (form.channel === 'whatsapp') {
        dispatchedUrl = `https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(message)}`;
        window.open(dispatchedUrl, '_blank', 'noopener,noreferrer');
      } else {
        const mailSubject = form.subject.trim()
          ? `[TOP CARE] ${form.subject.trim()} (${refId})`
          : `[TOP CARE] Inquiry from ${form.name.trim()} (${refId})`;
        dispatchedUrl = `mailto:${SHOP_EMAIL}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(message)}`;
        window.location.href = dispatchedUrl;
      }

      setSubmittedData({
        refId,
        timestamp,
        ip,
        channel: form.channel,
        url: dispatchedUrl
      });
    } catch (err) {
      setError(err.message || 'Something went wrong preparing your message.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickWap = async () => {
    await openWhatsAppWithIp({ source: 'Contact Page - Direct WhatsApp Card' });
  };

  return (
    <>
      <Navbar />

      <main className="contact-page">
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="container">
            <div className="contact-hero-content">
              <div className="hero-badge">🇲🇼 TOP CARE Malawi Support</div>
              <h1>Get in Touch with Our Team</h1>
              <p>
                Have a question about an order, products, or nationwide delivery across Malawi?
                Send us a message below or chat directly on WhatsApp. We reply promptly and your inquiry is verified with your sender IP for secure communication.
              </p>
            </div>
          </div>
        </section>

        {/* 4 Highlights Bar */}
        <div className="container">
          <div className="contact-highlights-grid">
            <div className="contact-highlight-card">
              <div className="contact-card-icon wap-bg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </div>
              <div className="contact-card-text">
                <span className="card-badge green-badge">Instant • Fastest</span>
                <h4>WhatsApp Support</h4>
                <p className="contact-detail">{SHOP_WHATSAPP_DISPLAY}</p>
                <button
                  type="button"
                  className="card-action-btn wap-action"
                  onClick={handleQuickWap}
                >
                  Chat on WhatsApp →
                </button>
              </div>
            </div>

            <div className="contact-highlight-card">
              <div className="contact-card-icon email-bg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div className="contact-card-text">
                <span className="card-badge blue-badge">Replies in 24 hrs</span>
                <h4>Email Support</h4>
                <p className="contact-detail">{SHOP_EMAIL}</p>
                <a href={`mailto:${SHOP_EMAIL}`} className="card-action-btn email-action">
                  Send Email →
                </a>
              </div>
            </div>

            <div className="contact-highlight-card">
              <div className="contact-card-icon delivery-bg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13"/>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
              <div className="contact-card-text">
                <span className="card-badge amber-badge">All 28 Districts</span>
                <h4>Nationwide Delivery</h4>
                <p className="contact-detail">Lilongwe & Blantyre Hubs</p>
                <span className="card-subnote">Pay on Delivery Available</span>
              </div>
            </div>

            <div className="contact-highlight-card">
              <div className="contact-card-icon hours-bg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div className="contact-card-text">
                <span className="card-badge neutral-badge">Malawi Time (CAT)</span>
                <h4>Working Hours</h4>
                <p className="contact-detail">Mon – Sat: 8:00 AM – 6:00 PM</p>
                <span className="card-subnote">Sunday: WhatsApp On-Demand</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: Form on Left, Direct Contact & FAQ on Right */}
        <div className="container contact-main-container">
          <div className="contact-split-layout">
            
            {/* Left: Professional Contact Form */}
            <div className="panel contact-form-panel">
              <div className="form-panel-header">
                <div>
                  <h2 className="panel-title">Send Us a Message</h2>
                  <p className="panel-subtitle">
                    Fill in your details below. You can send this inquiry directly via WhatsApp or Email.
                  </p>
                </div>

                {/* Verified Sender IP Badge */}
                <div className="ip-verification-pill" title="Verified IP address attached to all outgoing inquiries">
                  <span className="ip-status-beacon"></span>
                  <span className="ip-label">Sender IP:</span>
                  <code className="ip-code">{ipLoading ? 'Fetching…' : clientIp}</code>
                  <span className="ip-badge-verified">✓ Verified</span>
                </div>
              </div>

              {/* Security info banner */}
              <div className="security-notice-banner">
                <span className="shield-icon">🛡️</span>
                <span>
                  <strong>Fraud & Spam Prevention:</strong> Your public IP address (<code>{clientIp}</code>) is automatically sent with your message so TOP CARE can verify authentic inquiries and prioritize genuine orders.
                </span>
              </div>

              {error && (
                <div className="alert alert-error" role="alert">
                  <strong>Error: </strong> {error}
                </div>
              )}

              {submittedData ? (
                <div className="contact-success-card">
                  <div className="success-icon-wrap">✓</div>
                  <h3>Your Message is Ready & Dispatched!</h3>
                  <p>
                    {submittedData.channel === 'whatsapp'
                      ? 'WhatsApp has been opened with your inquiry and verified IP address attached. Please press Send in WhatsApp to complete your message.'
                      : 'Your default email client has been opened with your inquiry and verified IP address attached.'}
                  </p>
                  <div className="success-meta-box">
                    <div className="meta-row">
                      <span>Inquiry Reference:</span>
                      <strong>{submittedData.refId}</strong>
                    </div>
                    <div className="meta-row">
                      <span>Sender IP Attached:</span>
                      <code>{submittedData.ip}</code>
                    </div>
                    <div className="meta-row">
                      <span>Timestamp:</span>
                      <span>{submittedData.timestamp}</span>
                    </div>
                    <div className="meta-row">
                      <span>Dispatch Channel:</span>
                      <strong style={{ textTransform: 'capitalize' }}>{submittedData.channel}</strong>
                    </div>
                  </div>

                  <div className="success-actions">
                    {submittedData.channel === 'whatsapp' && (
                      <a
                        href={submittedData.url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-whatsapp btn-lg"
                      >
                        Re-open WhatsApp Chat
                      </a>
                    )}
                    <button
                      type="button"
                      className="btn btn-secondary btn-lg"
                      onClick={() => {
                        setSubmittedData(null);
                        setForm({
                          name: '',
                          phone: '',
                          email: '',
                          city: 'Lilongwe',
                          topic: 'order',
                          subject: '',
                          message: '',
                          channel: 'whatsapp',
                        });
                      }}
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-styled-form">
                  {/* Row 1: Name and Phone */}
                  <div className="form-row-2">
                    <div className="field">
                      <label htmlFor="c-name">
                        Full name <span className="req">*</span>
                      </label>
                      <input
                        id="c-name"
                        type="text"
                        required
                        value={form.name}
                        onChange={set('name')}
                        placeholder="e.g. John Banda"
                        autoComplete="name"
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="c-phone">
                        WhatsApp / Phone number {form.channel === 'whatsapp' && <span className="req">*</span>}
                      </label>
                      <input
                        id="c-phone"
                        type="tel"
                        value={form.phone}
                        onChange={set('phone')}
                        placeholder="e.g. 0992 393 452 or +265 99..."
                        autoComplete="tel"
                      />
                      <small className="field-hint">Best for instant WhatsApp order replies</small>
                    </div>
                  </div>

                  {/* Row 2: Email and City */}
                  <div className="form-row-2">
                    <div className="field">
                      <label htmlFor="c-email">
                        Email address {form.channel === 'email' && <span className="req">*</span>}
                      </label>
                      <input
                        id="c-email"
                        type="email"
                        value={form.email}
                        onChange={set('email')}
                        placeholder="e.g. john@example.com"
                        autoComplete="email"
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="c-city">Your City / District</label>
                      <select id="c-city" value={form.city} onChange={set('city')}>
                        {MALAWI_CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Topic and Subject */}
                  <div className="form-row-2">
                    <div className="field">
                      <label htmlFor="c-topic">Inquiry category</label>
                      <select id="c-topic" value={form.topic} onChange={set('topic')}>
                        {INQUIRY_TOPICS.map((t) => (
                          <option key={t.id} value={t.id}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="c-subject">Subject</label>
                      <input
                        id="c-subject"
                        type="text"
                        value={form.subject}
                        onChange={set('subject')}
                        placeholder="e.g. Delivery timeline to Area 47"
                      />
                    </div>
                  </div>

                  {/* Row 4: Message */}
                  <div className="field">
                    <div className="field-label-row">
                      <label htmlFor="c-message">
                        Message <span className="req">*</span>
                      </label>
                      <span className="char-count">{form.message.length}/800</span>
                    </div>
                    <textarea
                      id="c-message"
                      rows={5}
                      maxLength={800}
                      required
                      value={form.message}
                      onChange={set('message')}
                      placeholder="Please write the details of your inquiry, product questions, or order instructions here…"
                    />
                  </div>

                  {/* Channel Selection */}
                  <div className="channel-section">
                    <label className="channel-section-title">
                      Choose How to Send Your Message:
                    </label>
                    <div className="channel-cards-grid">
                      <label
                        className={`channel-selection-card ${form.channel === 'whatsapp' ? 'selected wap-selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name="channel"
                          value="whatsapp"
                          checked={form.channel === 'whatsapp'}
                          onChange={set('channel')}
                        />
                        <div className="channel-card-body">
                          <div className="channel-title-row">
                            <span className="channel-name">📱 WhatsApp</span>
                            <span className="channel-tag green-tag">Instant • Recommended</span>
                          </div>
                          <p className="channel-desc">
                            Opens WhatsApp with your full inquiry and <strong>verified Sender IP ({clientIp})</strong> pre-filled ready to send.
                          </p>
                        </div>
                      </label>

                      <label
                        className={`channel-selection-card ${form.channel === 'email' ? 'selected email-selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name="channel"
                          value="email"
                          checked={form.channel === 'email'}
                          onChange={set('channel')}
                        />
                        <div className="channel-card-body">
                          <div className="channel-title-row">
                            <span className="channel-name">📧 Email</span>
                            <span className="channel-tag blue-tag">Standard</span>
                          </div>
                          <p className="channel-desc">
                            Opens your email client with your message, subject, and <strong>verified Sender IP ({clientIp})</strong> included.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Message Preview Accordion */}
                  <div className="preview-accordion">
                    <button
                      type="button"
                      className="preview-toggle-btn"
                      onClick={() => setShowPreview((v) => !v)}
                    >
                      <span>{showPreview ? '▼ Hide' : '▶ Preview'} outgoing message & sender IP transmission</span>
                    </button>
                    {showPreview && (
                      <div className="preview-box">
                        <pre>{buildStructuredMessage(clientIp).message}</pre>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="form-submit-wrap">
                    <button
                      type="submit"
                      disabled={submitting}
                      className={`btn btn-block btn-lg ${form.channel === 'whatsapp' ? 'btn-whatsapp-submit' : 'btn-accent'}`}
                    >
                      {submitting ? (
                        <span>Resolving IP & Preparing…</span>
                      ) : form.channel === 'whatsapp' ? (
                        <>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                          </svg>
                          <span>Send Inquiry via WhatsApp (Sender IP: {clientIp})</span>
                        </>
                      ) : (
                        <>
                          <span>📧 Send Inquiry via Email (Sender IP: {clientIp})</span>
                        </>
                      )}
                    </button>
                    <p className="form-guarantee-note">
                      🔒 Your IP address and message are securely handled. No spam, ever.
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* Right: Direct Contact & FAQ */}
            <div className="contact-sidebar">
              {/* Direct WhatsApp Callout */}
              <div className="panel direct-wap-card">
                <div className="direct-wap-header">
                  <span className="wap-badge-pill">Live WAP Support</span>
                  <h3>Need Immediate Help?</h3>
                  <p>
                    Skip the form and chat with our customer representative on WhatsApp right now.
                  </p>
                </div>

                <div className="direct-wap-ip-preview">
                  <div className="preview-row">
                    <span className="preview-label">Direct Line:</span>
                    <strong>{SHOP_WHATSAPP_DISPLAY}</strong>
                  </div>
                  <div className="preview-row">
                    <span className="preview-label">Verified IP:</span>
                    <code>{clientIp}</code>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-whatsapp btn-block btn-lg"
                  onClick={handleQuickWap}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>Chat on WhatsApp Now</span>
                </button>

                <div className="pod-reminder">
                  <strong>💡 Pay on Delivery Notice:</strong>
                  <p>You never pay upfront on TOP CARE. Inspect your items upon arrival and pay in Malawi Kwacha via Cash, Airtel Money, or Mpamba.</p>
                </div>
              </div>

              {/* FAQ Accordion / Quick Assistance */}
              <div className="panel faq-panel">
                <h3>Frequently Asked Questions</h3>

                <div className="faq-item">
                  <h4>🚚 How long does delivery take?</h4>
                  <p>
                    Within Lilongwe and Blantyre, orders typically arrive in 24 hours. For Zomba, Mzuzu, and other districts, delivery takes 1 to 2 business days.
                  </p>
                </div>

                <div className="faq-item">
                  <h4>💰 How do I pay?</h4>
                  <p>
                    All payments are made on delivery. Once our delivery driver arrives, you can pay via Cash, Airtel Money, or TNM Mpamba.
                  </p>
                </div>

                <div className="faq-item">
                  <h4>🛡️ Why is my Sender IP included?</h4>
                  <p>
                    Your public IP address (<code>{clientIp}</code>) is attached to all WhatsApp and email inquiries to prevent automated bots, verify genuine inquiries, and ensure customer order security.
                  </p>
                </div>

                <div className="faq-item">
                  <h4>🔄 Can I inspect items before paying?</h4>
                  <p>
                    Yes! You can inspect your package upon delivery before completing payment to confirm satisfaction.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
