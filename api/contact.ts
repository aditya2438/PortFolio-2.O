import type { IncomingMessage, ServerResponse } from 'node:http';

const RECIPIENT_EMAIL = 'adityachouhan2446@gmail.com';
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_REQUESTS = 15;
const rateLog = new Map<string, number[]>();

type ServerlessReq = IncomingMessage & {
  body?: unknown;
  headers: IncomingMessage['headers'];
};

type ServerlessRes = ServerResponse & {
  status?: (code: number) => ServerlessRes;
  json?: (data: unknown) => void;
};

function sanitizeText(raw: unknown, maxLen: number, preserveNewlines = false): string {
  if (typeof raw !== 'string') return '';
  let cleaned = raw
    .replace(/\0/g, '')
    .replace(/<[^>]*>?/gm, '')
    .replace(/javascript:|data:|vbscript:/gi, '');

  if (!preserveNewlines) {
    cleaned = cleaned.replace(/[\r\n\t]+/g, ' ');
  } else {
    cleaned = cleaned.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  }

  return cleaned.trim().slice(0, maxLen);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const list = (rateLog.get(ip) || []).filter((ts) => now - ts < RATE_WINDOW_MS);
  if (list.length >= RATE_MAX_REQUESTS) {
    rateLog.set(ip, list);
    return true;
  }
  list.push(now);
  rateLog.set(ip, list);
  return false;
}

function sendJson(res: ServerResponse, statusCode: number, body: unknown): void {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.statusCode = statusCode;
  res.end(JSON.stringify(body));
}

async function readRequestBody(req: ServerlessReq): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === 'object') {
    return req.body as Record<string, unknown>;
  }
  if (typeof req.body === 'string') {
    return JSON.parse(req.body) as Record<string, unknown>;
  }

  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buf.length;
    if (total > 16 * 1024) {
      throw new Error('PAYLOAD_TOO_LARGE');
    }
    chunks.push(buf);
  }
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) return {};
  return JSON.parse(raw) as Record<string, unknown>;
}

export default async function handler(req: ServerlessReq, res: ServerlessRes): Promise<void> {
  const originHeader = req.headers.origin;
  const origin = Array.isArray(originHeader) ? originHeader[0] : originHeader;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  }

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { ok: false, error: 'Method not allowed. Use POST.' });
    return;
  }

  const forwarded = req.headers['x-forwarded-for'];
  const clientIp =
    (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  if (isRateLimited(clientIp)) {
    res.setHeader('Retry-After', '600');
    sendJson(res, 429, {
      ok: false,
      errors: { message: 'Too many messages sent recently. Please try again in a few minutes.' },
    });
    return;
  }

  let body: Record<string, unknown>;
  try {
    body = await readRequestBody(req);
  } catch (err) {
    if (err instanceof Error && err.message === 'PAYLOAD_TOO_LARGE') {
      sendJson(res, 413, { ok: false, error: 'Request payload too large.' });
      return;
    }
    sendJson(res, 400, { ok: false, error: 'Malformed JSON payload.' });
    return;
  }

  const honeypot = sanitizeText(body.website, 120);
  if (honeypot.length > 0) {
    sendJson(res, 200, {
      ok: true,
      inquiryId: 'inq_accepted',
      recipient: RECIPIENT_EMAIL,
      deliveredViaEmail: false,
    });
    return;
  }

  const email = sanitizeText(body.email, 160);
  const message = sanitizeText(body.message, 2000, true);
  const topic = sanitizeText(body.topic, 80) || 'Portfolio Inquiry';

  const errors: { email?: string; message?: string } = {};
  if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Please enter a valid email address so Aditya can reply.';
  }
  if (message.length < 5) {
    errors.message = 'Please write at least 5 characters in your message.';
  }

  if (Object.keys(errors).length > 0) {
    sendJson(res, 400, { ok: false, errors });
    return;
  }

  const rawKey = process.env.RESEND_API_KEY || '';
  const resendKey = rawKey.trim().replace(/^['"]|['"]$/g, '');
  let delivered = false;
  let requiresActivation = false;
  let provider: 'resend' | 'formsubmit' | undefined;
  let note: string | undefined;

  if (resendKey) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      const htmlBody = `
        <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0b1120;color:#f8fafc;border-radius:12px;">
          <h2 style="margin:0 0 12px;color:#38bdf8;">New Portfolio Message</h2>
          <p style="margin:0 0 8px;font-size:14px;"><strong>From:</strong> ${escapeHtml(email)}</p>
          <p style="margin:0 0 16px;font-size:14px;"><strong>Topic:</strong> ${escapeHtml(topic)}</p>
          <div style="padding:16px;background:#111827;border:1px solid #1e293b;border-radius:8px;white-space:pre-wrap;font-size:14px;line-height:1.6;">${escapeHtml(message)}</div>
        </div>
      `;
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        signal: ctrl.signal,
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Aditya Portfolio <onboarding@resend.dev>',
          to: [RECIPIENT_EMAIL],
          reply_to: email,
          subject: `[Portfolio] ${topic} — from ${email}`,
          text: `From: ${email}\nTopic: ${topic}\n\n${message}`,
          html: htmlBody,
        }),
      });
      clearTimeout(timer);

      if (resendRes.ok) {
        delivered = true;
        provider = 'resend';
      } else {
        const errBody = (await resendRes.json().catch(() => ({}))) as { message?: string };
        note = errBody?.message || `Resend returned HTTP ${resendRes.status}`;
      }
    } catch (err) {
      note = err instanceof Error ? err.message : 'Resend request timed out';
    }
  } else {
    note = 'RESEND_API_KEY is not configured in Vercel Environment Variables yet.';
  }

  if (!delivered) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 3500);
      const hostHeader = req.headers.host;
      const host = Array.isArray(hostHeader) ? hostHeader[0] : hostHeader;
      const effectiveOrigin = origin || (host ? `https://${host}` : 'https://aditya-portfolio-mocha-zeta.vercel.app');
      const fsRes = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
        method: 'POST',
        signal: ctrl.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Origin: effectiveOrigin,
          Referer: `${effectiveOrigin.replace(/\/$/, '')}/`,
        },
        body: JSON.stringify({
          email,
          _replyto: email,
          topic,
          message,
          _subject: `[Portfolio Message] ${topic} from ${email}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });
      clearTimeout(timer);
      if (fsRes.ok) {
        const fsData = (await fsRes.json().catch(() => ({}))) as {
          success?: string | boolean;
          message?: string;
        };
        const isSuccess = fsData.success === true || fsData.success === 'true';
        if (isSuccess) {
          delivered = true;
          provider = 'formsubmit';
        }
        if (typeof fsData.message === 'string' && fsData.message.toLowerCase().includes('activation')) {
          requiresActivation = true;
        }
        if (!note && typeof fsData.message === 'string') {
          note = fsData.message;
        }
      }
    } catch {
      // Fallback unavailable
    }
  }

  const subject = encodeURIComponent(`[Portfolio] ${topic} — from ${email}`);
  const mailBody = encodeURIComponent(`Hi Aditya,\n\n${message}\n\nReply to: ${email}`);

  sendJson(res, 200, {
    ok: true,
    inquiryId: `inq_${Date.now().toString(36)}`,
    recipient: RECIPIENT_EMAIL,
    deliveredViaEmail: delivered,
    requiresActivation,
    provider,
    deliveryNote: note,
    gmailComposeUrl: `https://mail.google.com/mail/?view=cm&fs=1&to=${RECIPIENT_EMAIL}&su=${subject}&body=${mailBody}`,
    mailtoUrl: `mailto:${RECIPIENT_EMAIL}?subject=${subject}&body=${mailBody}`,
  });
}
