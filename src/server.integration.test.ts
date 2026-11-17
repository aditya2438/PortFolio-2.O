import assert from 'node:assert/strict';
import test from 'node:test';

const BASE_URL = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';

test('HTTP security headers & root HTML entry point serve cleanly', async () => {
  const res = await fetch(`${BASE_URL}/`);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('x-powered-by'), null);
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(res.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
  assert.ok(res.headers.get('permissions-policy')?.includes('camera=()'));
  assert.ok(res.headers.get('content-security-policy')?.includes("default-src 'self'"));

  const html = await res.text();
  assert.ok(html.includes('<div id="root">'));
  assert.ok(html.includes('Aditya Chouhan'));
  assert.ok(html.includes('apple-touch-icon.png'));
  assert.ok(html.includes('manifest.json'));
});

test('PWA manifest.json and all required icons (192, 512, maskable, apple-touch, svg) serve cleanly', async () => {
  const mRes = await fetch(`${BASE_URL}/manifest.json`);
  assert.equal(mRes.status, 200);
  const manifest = (await mRes.json()) as {
    id: string;
    name: string;
    short_name: string;
    start_url: string;
    scope: string;
    display: string;
    icons: { src: string; sizes: string; purpose: string }[];
  };
  assert.equal(manifest.id, '/');
  assert.equal(manifest.start_url, '/');
  assert.equal(manifest.scope, '/');
  assert.equal(manifest.display, 'standalone');
  assert.ok(manifest.short_name.length > 0 && manifest.short_name.length <= 12);
  assert.ok(manifest.icons.some((i) => i.sizes === '192x192' && i.purpose === 'any'));
  assert.ok(manifest.icons.some((i) => i.sizes === '512x512' && i.purpose === 'any'));
  assert.ok(manifest.icons.some((i) => i.sizes === '512x512' && i.purpose === 'maskable'));

  const iconPaths = [
    '/pwa-192x192.png',
    '/pwa-512x512.png',
    '/pwa-maskable-512x512.png',
    '/apple-touch-icon.png',
    '/icon.svg',
  ];
  for (const p of iconPaths) {
    const r = await fetch(`${BASE_URL}${p}`);
    assert.equal(r.status, 200, `${p} should return 200 OK`);
    const buf = await r.arrayBuffer();
    assert.ok(buf.byteLength > 500, `${p} should have non-empty body`);
  }
});

test('Static profile photo & resume PDF assets + download endpoints serve with 200 OK', async () => {
  const [imgRes, canonicalPdfRes, inlineApiRes, downloadApiRes] = await Promise.all([
    fetch(`${BASE_URL}/aditya-profile.jpg`),
    fetch(`${BASE_URL}/Aditya_Chouhan_Resume.pdf`),
    fetch(`${BASE_URL}/api/resume`),
    fetch(`${BASE_URL}/api/resume/download`),
  ]);

  assert.equal(imgRes.status, 200);
  assert.ok(imgRes.headers.get('content-type')?.includes('image/'));
  const imgBytes = await imgRes.arrayBuffer();
  assert.ok(imgBytes.byteLength > 1024);

  for (const r of [canonicalPdfRes, inlineApiRes, downloadApiRes]) {
    assert.equal(r.status, 200);
    assert.ok(r.headers.get('content-type')?.includes('pdf'));
    const bytes = await r.arrayBuffer();
    assert.ok(bytes.byteLength > 1024);
  }
  assert.ok(downloadApiRes.headers.get('content-disposition')?.includes('attachment'));
});

test('GET /api/health returns ok: true with no-store cache policy', async () => {
  const res = await fetch(`${BASE_URL}/api/health`);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('cache-control'), 'no-store');
  const data = (await res.json()) as { ok: boolean; timestamp: string };
  assert.equal(data.ok, true);
  assert.ok(!Number.isNaN(Date.parse(data.timestamp)));
});

test('POST /api/contact rejects invalid email, short/XSS-stripped message, malformed JSON, and oversized payload', async () => {
  const headers = {
    'Content-Type': 'application/json',
    'X-Forwarded-For': '198.51.100.11',
  };

  // 1. Invalid email & too-short message
  const badRes = await fetch(`${BASE_URL}/api/contact`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email: 'not-valid', message: 'hi' }),
  });
  assert.equal(badRes.status, 400);
  const badJson = (await badRes.json()) as { ok: boolean; errors: { email?: string; message?: string } };
  assert.equal(badJson.ok, false);
  assert.ok(badJson.errors.email);
  assert.ok(badJson.errors.message);

  // 2. Empty after HTML/XSS tag stripping
  const xssRes = await fetch(`${BASE_URL}/api/contact`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email: 'sec@example.com', message: '<script></script><img src=x>' }),
  });
  assert.equal(xssRes.status, 400);

  // 3. Malformed JSON syntax
  const malformedRes = await fetch(`${BASE_URL}/api/contact`, {
    method: 'POST',
    headers,
    body: '{"email": "broken@example.com",',
  });
  assert.equal(malformedRes.status, 400);
  const malformedBody = await malformedRes.text();
  assert.ok(!malformedBody.includes('SyntaxError:'));

  // 4. Oversized (>16KB) DoS payload rejection
  const hugePayload = JSON.stringify({
    email: 'flood@example.com',
    message: 'A'.repeat(24000),
  });
  const hugeRes = await fetch(`${BASE_URL}/api/contact`, {
    method: 'POST',
    headers,
    body: hugePayload,
  });
  assert.ok(hugeRes.status === 400 || hugeRes.status === 413);
});

test('POST /api/contact handles honeypot trap silently and valid inquiry end-to-end', async () => {
  // Honeypot bot request
  const botRes = await fetch(`${BASE_URL}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Forwarded-For': '198.51.100.22',
    },
    body: JSON.stringify({
      email: 'bot@spam.invalid',
      message: 'Buy cheap backlinks now!',
      website: 'https://spam.invalid',
    }),
  });
  assert.equal(botRes.status, 200);
  const botJson = (await botRes.json()) as { ok: boolean; inquiryId: string };
  assert.equal(botJson.ok, true);
  assert.equal(botJson.inquiryId, 'inq_accepted');

  // Legitimate human submission
  const okRes = await fetch(`${BASE_URL}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Forwarded-For': '198.51.100.23',
    },
    body: JSON.stringify({
      email: 'lead-engineer@company.com',
      topic: 'Backend Role',
      message: 'Hi Aditya, we reviewed FairCart and FixOra and would love to interview you.',
    }),
  });
  assert.equal(okRes.status, 200);
  const okJson = (await okRes.json()) as {
    ok: boolean;
    recipient: string;
    gmailComposeUrl: string;
    mailtoUrl: string;
  };
  assert.equal(okJson.ok, true);
  assert.equal(okJson.recipient, 'adityachouhan2446@gmail.com');
  assert.ok(okJson.gmailComposeUrl.includes('mail.google.com'));
  assert.ok(okJson.mailtoUrl.startsWith('mailto:adityachouhan2446@gmail.com'));
});

test('POST /api/contact enforces per-IP sliding-window rate limit (429 after 8 requests)', async () => {
  const spamIp = `198.51.100.${100 + Math.floor(Math.random() * 140)}`;
  let lastStatus = 200;

  for (let i = 0; i < 8; i++) {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': spamIp,
      },
      // Invalid message still triggers rate counter fast without hitting external relay
      body: JSON.stringify({ email: 'bad', message: 'x' }),
    });
    lastStatus = res.status;
    assert.equal(lastStatus, 400);
  }

  const limitedRes = await fetch(`${BASE_URL}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Forwarded-For': spamIp,
    },
    body: JSON.stringify({ email: 'recruiter@firm.com', message: 'Valid message blocked by limit' }),
  });
  assert.equal(limitedRes.status, 429);
  assert.equal(limitedRes.headers.get('retry-after'), '600');
});
