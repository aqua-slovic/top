// TOP CARE — IP Address & Contact Utilities

export const SHOP_WHATSAPP = '265992393452';
export const SHOP_WHATSAPP_DISPLAY = '+265 992 393 452';
export const SHOP_EMAIL = 'malatawisdom07@gmail.com';

let memoryIp = null;

// Read cached IP from sessionStorage if available
try {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    const cached = window.sessionStorage.getItem('topcare_client_ip');
    if (cached && cached !== 'unknown' && cached !== 'Client (Direct)') {
      memoryIp = cached;
    }
  }
} catch {
  // Ignore sessionStorage errors
}

// Fetch helper with timeout
async function fetchWithTimeout(url, timeoutMs = 2800) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

/**
 * Resolves the client's public IP address with multiple fast fallbacks.
 * Caches the result in memory and sessionStorage.
 */
export async function getClientIp() {
  if (memoryIp && memoryIp !== 'unknown') {
    return memoryIp;
  }

  // Fast candidate endpoints
  const fetchers = [
    async () => {
      const data = await fetchWithTimeout('https://api.ipify.org?format=json', 2500);
      return data?.ip;
    },
    async () => {
      const data = await fetchWithTimeout('https://api64.ipify.org?format=json', 2500);
      return data?.ip;
    },
    async () => {
      const data = await fetchWithTimeout('https://ipapi.co/json/', 2500);
      return data?.ip;
    },
    async () => {
      const data = await fetchWithTimeout('https://api.db-ip.com/v2/free/self', 2500);
      return data?.ipAddress;
    }
  ];

  for (const fetcher of fetchers) {
    try {
      const ip = await fetcher();
      if (ip && typeof ip === 'string' && ip.trim().length >= 7) {
        memoryIp = ip.trim();
        try {
          if (typeof window !== 'undefined' && window.sessionStorage) {
            window.sessionStorage.setItem('topcare_client_ip', memoryIp);
          }
        } catch {
          // Ignore
        }
        return memoryIp;
      }
    } catch {
      // Continue to next provider
    }
  }

  return memoryIp || 'Client (Direct)';
}

/**
 * Synchronous read of currently cached IP (or null)
 */
export function getCachedIp() {
  if (memoryIp) return memoryIp;
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return window.sessionStorage.getItem('topcare_client_ip');
    }
  } catch {
    // Ignore
  }
  return null;
}

// Background pre-fetch on load so clicks never lag
if (typeof window !== 'undefined') {
  setTimeout(() => {
    getClientIp().catch(() => {});
  }, 100);
}

/**
 * Generates and opens a WhatsApp chat link guaranteed to include the sender IP address
 */
export async function openWhatsAppWithIp({ message = '', source = 'Website', details = {} } = {}) {
  const ip = await getClientIp();
  const timestamp = new Date().toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  let fullMessage = '';

  if (message && message.trim().length > 0) {
    // If message already contains sender IP, use as is
    if (message.includes('Sender IP') || message.includes('IP:')) {
      fullMessage = message.trim();
    } else {
      fullMessage = [
        message.trim(),
        '',
        '━━━━━━━━━━━━━━━━━━━━',
        '🛡️ *Verified Sender Info:*',
        `• Sender IP: ${ip}`,
        `• Timestamp: ${timestamp}`,
        `• Source: ${source}`
      ].join('\n');
    }
  } else {
    // Default professional support message with IP stamp
    const lines = [
      '👋 *Hello TOP CARE Support!*',
      '━━━━━━━━━━━━━━━━━━━━',
      'I am contacting you from the TOP CARE website regarding your products and delivery.',
      ''
    ];

    if (details.productName) {
      lines.push(`🛍️ *Inquiry about:* ${details.productName}`);
      if (details.price) lines.push(`💰 *Price:* ${details.price}`);
      lines.push('');
    }

    lines.push('🛡️ *Sender Verification:*');
    lines.push(`• Sender IP: ${ip}`);
    lines.push(`• Date: ${timestamp}`);
    lines.push(`• Source: ${source}`);
    lines.push('━━━━━━━━━━━━━━━━━━━━');
    lines.push('Please let me know how you can assist me.');

    fullMessage = lines.join('\n');
  }

  const url = `https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(fullMessage)}`;
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  return { url, ip };
}
