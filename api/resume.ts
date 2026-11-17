import type { IncomingMessage, ServerResponse } from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const reqUrl = new URL(req.url || '/api/resume', 'http://localhost');
  const isDownload =
    reqUrl.searchParams.get('download') === '1' || reqUrl.pathname.endsWith('/download');

  const candidates = [
    path.join(process.cwd(), 'public', 'Aditya_Chouhan_Resume.pdf'),
    path.join(process.cwd(), 'dist', 'Aditya_Chouhan_Resume.pdf'),
  ];

  for (const candidate of candidates) {
    try {
      const pdfBytes = await fs.readFile(candidate);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `${isDownload ? 'attachment' : 'inline'}; filename="Aditya_Chouhan_Resume.pdf"`,
      );
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.end(pdfBytes);
      return;
    } catch {
      // Try next location
    }
  }

  res.statusCode = 307;
  res.setHeader('Location', '/Aditya_Chouhan_Resume.pdf');
  res.end();
}
