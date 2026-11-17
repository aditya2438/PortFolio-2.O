import 'dotenv/config';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const RECIPIENT_EMAIL = 'adityachouhan2446@gmail.com';
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

// Sliding-window rate limit state for /api/contact (max 8 requests per 10 minutes per IP)
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_REQUESTS = 8;
const contactRateLog = new Map<string, number[]>();

interface StoredInquiry {
  id: string;
  email: string;
  topic: string;
  message: string;
  createdAt: string;
  deliveredViaEmail: boolean;
}

/**
 * Strips HTML tags, null bytes, dangerous protocols, and control characters
 * to prevent XSS, CRLF email-header injection, and malformed payload persistence.
 */
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

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (contactRateLog.get(ip) || []).filter((ts) => now - ts < RATE_WINDOW_MS);
  if (timestamps.length >= RATE_MAX_REQUESTS) {
    contactRateLog.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  contactRateLog.set(ip, timestamps);
  return false;
}

async function persistInquiry(entry: StoredInquiry): Promise<void> {
  try {
    const dir = path.join(__dirname, '.data');
    await fs.mkdir(dir, { recursive: true });
    const file = path.join(dir, 'inquiries.json');
    let list: StoredInquiry[] = [];
    try {
      const raw = await fs.readFile(file, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) list = parsed;
    } catch {
      list = [];
    }
    list.unshift(entry);
    await fs.writeFile(file, JSON.stringify(list.slice(0, 100), null, 2), 'utf8');
  } catch {
    // Non-fatal persistence safeguard
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function forwardEmailToGmail(
  payload: {
    email: string;
    topic: string;
    message: string;
  },
  originUrl?: string,
): Promise<{
  delivered: boolean;
  requiresActivation: boolean;
  provider?: 'resend' | 'formsubmit';
  note?: string;
}> {
  const rawKey = process.env.RESEND_API_KEY || '';
  const resendKey = rawKey.trim().replace(/^['"]|['"]$/g, '');
  let resendNote: string | undefined;

  if (resendKey) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      const htmlBody = `
        <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0b1120;color:#f8fafc;border-radius:12px;">
          <h2 style="margin:0 0 12px;color:#38bdf8;">New Portfolio Message</h2>
          <p style="margin:0 0 8px;font-size:14px;"><strong>From:</strong> ${escapeHtml(payload.email)}</p>
          <p style="margin:0 0 16px;font-size:14px;"><strong>Topic:</strong> ${escapeHtml(payload.topic)}</p>
          <div style="padding:16px;background:#111827;border:1px solid #1e293b;border-radius:8px;white-space:pre-wrap;font-size:14px;line-height:1.6;">${escapeHtml(payload.message)}</div>
        </div>
      `;
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        signal: ctrl.signal,
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Aditya Portfolio <onboarding@resend.dev>',
          to: [RECIPIENT_EMAIL],
          reply_to: payload.email,
          subject: `[Portfolio] ${payload.topic} — from ${payload.email}`,
          text: `From: ${payload.email}\nTopic: ${payload.topic}\n\n${payload.message}`,
          html: htmlBody,
        }),
      });
      clearTimeout(timer);
      if (res.ok) {
        const okBody = (await res.json().catch(() => ({}))) as { id?: string };
        console.log(`[Contact] Resend delivered inquiry (${okBody.id || 'ok'}) to ${RECIPIENT_EMAIL}`);
        return { delivered: true, requiresActivation: false, provider: 'resend' };
      }
      const errBody = (await res.json().catch(() => ({}))) as { message?: string; name?: string };
      resendNote = errBody?.message || `Resend returned HTTP ${res.status}`;
      console.warn(`[Contact] Resend delivery failed (${res.status}): ${resendNote}`);
    } catch (err) {
      resendNote = err instanceof Error ? err.message : 'Resend request aborted';
      console.warn('[Contact] Resend error:', resendNote);
    }
  }

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3500);
    const effectiveOrigin = originUrl || process.env.APP_URL || `http://localhost:${PORT}`;
    const res = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
      method: 'POST',
      signal: ctrl.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Origin: effectiveOrigin,
        Referer: `${effectiveOrigin.replace(/\/$/, '')}/`,
      },
      body: JSON.stringify({
        email: payload.email,
        _replyto: payload.email,
        topic: payload.topic,
        message: payload.message,
        _subject: `[Portfolio Message] ${payload.topic} from ${payload.email}`,
        _template: 'table',
        _captcha: 'false',
      }),
    });
    clearTimeout(timer);
    if (res.ok) {
      const data = (await res.json().catch(() => ({}))) as {
        success?: string | boolean;
        message?: string;
      };
      const isSuccess = data.success === true || data.success === 'true';
      const needsActivation =
        typeof data.message === 'string' && data.message.toLowerCase().includes('activation');
      return {
        delivered: isSuccess,
        requiresActivation: needsActivation,
        provider: isSuccess ? 'formsubmit' : undefined,
        note: resendNote || (typeof data.message === 'string' ? data.message : undefined),
      };
    }
  } catch {
    // External relay unavailable in sandboxed or offline environments
  }

  return { delivered: false, requiresActivation: false, note: resendNote };
}

async function startServer() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  // Security & Hardening Headers Middleware (iframe preview compatible)
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-DNS-Prefetch-Control', 'off');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
    const devWsSrc = process.env.NODE_ENV !== 'production' ? ' ws://localhost:* wss://localhost:*' : '';
    res.setHeader(
      'Content-Security-Policy',
      `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https://api.resend.com https://formsubmit.co https://fonts.googleapis.com https://fonts.gstatic.com${devWsSrc}; worker-src 'self' blob:; manifest-src 'self'; frame-src 'self' blob: data:; object-src 'self' blob: data:; base-uri 'self'; form-action 'self' https://mail.google.com;`,
    );
    next();
  });

  // Strict 16KB JSON payload cap to guard against oversized payload DoS
  app.use(express.json({ limit: '16kb' }));

  // Handle malformed JSON cleanly without exposing internal stack traces
  app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (err && typeof err === 'object' && 'type' in err) {
      res.status(400).json({ ok: false, error: 'Malformed request payload.' });
      return;
    }
    next(err);
  });

  // Safe CORS & preflight middleware for preview/proxy origins on /api/*
  app.use('/api', (req: Request, res: Response, next: NextFunction) => {
    const origin = req.get('origin');
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    }
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    next();
  });

  app.get('/api/health', (_req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json({ ok: true, timestamp: new Date().toISOString() });
  });

  const resolveResumePath = async (): Promise<string | null> => {
    const candidates = [
      path.join(__dirname, 'public', 'Aditya_Chouhan_Resume.pdf'),
      path.join(__dirname, 'dist', 'Aditya_Chouhan_Resume.pdf'),
    ];
    for (const candidate of candidates) {
      try {
        await fs.access(candidate);
        return candidate;
      } catch {
        // Check next path
      }
    }
    return null;
  };

  app.get('/api/resume', async (_req: Request, res: Response) => {
    const pdfPath = await resolveResumePath();
    if (!pdfPath) {
      res.status(404).json({ ok: false, error: 'Resume PDF not found.' });
      return;
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="Aditya_Chouhan_Resume.pdf"');
    res.sendFile(pdfPath);
  });

  app.get('/api/resume/download', async (_req: Request, res: Response) => {
    const pdfPath = await resolveResumePath();
    if (!pdfPath) {
      res.status(404).json({ ok: false, error: 'Resume PDF not found.' });
      return;
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Aditya_Chouhan_Resume.pdf"');
    res.sendFile(pdfPath);
  });

  app.post('/api/contact', async (req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'no-store');
    try {
      const clientIp = req.ip || 'unknown';

    if (isRateLimited(clientIp)) {
      res.setHeader('Retry-After', '600');
      res.status(429).json({
        ok: false,
        errors: { message: 'Too many messages sent recently. Please try again in a few minutes.' },
      });
      return;
    }

    // Silent honeypot trap for automated spam bots
    const honeypot = sanitizeText(req.body?.website, 120);
    if (honeypot.length > 0) {
      res.json({ ok: true, inquiryId: 'inq_accepted', recipient: RECIPIENT_EMAIL, deliveredViaEmail: false });
      return;
    }

    const email = sanitizeText(req.body?.email, 160);
    const message = sanitizeText(req.body?.message, 2000, true);
    const topic = sanitizeText(req.body?.topic, 80) || 'Portfolio Inquiry';

    const errors: { email?: string; message?: string } = {};
    if (!EMAIL_REGEX.test(email)) {
      errors.email = 'Please enter a valid email address so Aditya can reply.';
    }
    if (message.length < 5) {
      errors.message = 'Please write at least 5 characters in your message.';
    }

    if (Object.keys(errors).length > 0) {
      res.status(400).json({ ok: false, errors });
      return;
    }

    const reqOrigin =
      req.get('origin') ||
      (req.get('host') ? `${req.protocol}://${req.get('host')}` : undefined);

    const { delivered, requiresActivation, provider, note } = await forwardEmailToGmail(
      { email, topic, message },
      reqOrigin,
    );
    const inquiryId = `inq_${Date.now().toString(36)}`;

    await persistInquiry({
      id: inquiryId,
      email,
      topic,
      message,
      createdAt: new Date().toISOString(),
      deliveredViaEmail: delivered,
    });

    const subject = encodeURIComponent(`[Portfolio] ${topic} — from ${email}`);
    const body = encodeURIComponent(`Hi Aditya,\n\n${message}\n\nReply to: ${email}`);

      res.json({
        ok: true,
        inquiryId,
        recipient: RECIPIENT_EMAIL,
        deliveredViaEmail: delivered,
        requiresActivation,
        provider,
        deliveryNote: note,
        gmailComposeUrl: `https://mail.google.com/mail/?view=cm&fs=1&to=${RECIPIENT_EMAIL}&su=${subject}&body=${body}`,
        mailtoUrl: `mailto:${RECIPIENT_EMAIL}?subject=${subject}&body=${body}`,
      });
    } catch (err) {
      console.error('[Contact] Unexpected handler error:', err);
      res.status(500).json({
        ok: false,
        errors: {
          message: 'Mail relay hit an unexpected error. Please try Open in Gmail or WhatsApp directly.',
        },
      });
    }
  });

  app.use('/api', (_req: Request, res: Response) => {
    res.status(404).json({ ok: false, error: 'API endpoint not found.' });
  });

  const distDir = path.join(__dirname, 'dist');
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(
      express.static(distDir, {
        maxAge: '7d',
        etag: true,
        setHeaders(res, filePath) {
          if (filePath.endsWith('index.html') || filePath.endsWith('sw.js')) {
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
          }
        },
      }),
    );
    app.get('*', (_req: Request, res: Response) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const hasResendConfigured = Boolean((process.env.RESEND_API_KEY || '').trim());
  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `Portfolio server running at http://localhost:${PORT} (mode=${isProd ? 'production' : 'development'}, resend=${hasResendConfigured ? 'configured' : 'unset'})`,
    );
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
