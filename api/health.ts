import type { IncomingMessage, ServerResponse } from 'node:http';

type ServerlessRes = ServerResponse & {
  status?: (code: number) => ServerlessRes;
  json?: (data: unknown) => void;
};

export default function handler(_req: IncomingMessage, res: ServerResponse): void {
  const payload = {
    ok: true,
    runtime: 'vercel',
    resendConfigured: Boolean((process.env.RESEND_API_KEY || '').trim()),
    timestamp: new Date().toISOString(),
  };

  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.statusCode = 200;
  res.end(JSON.stringify(payload));
}
