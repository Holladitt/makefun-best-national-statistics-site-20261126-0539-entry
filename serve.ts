// serve.ts — server statis sederhana untuk cek lokal.
// Menayangkan app/ di http://localhost:8080/ . Node 22, stdlib saja.
// Jalankan: node serve.ts

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

const APP_DIR = resolve(import.meta.dirname, 'app');
const PORT = 8080;

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    let rel = decodeURIComponent(url.pathname);
    if (rel === '/favicon.ico') {
      res.writeHead(204);
      res.end();
      return;
    }
    if (rel === '/') rel = '/index.html';
    const file = resolve(join(APP_DIR, '.' + rel));
    if (!file.startsWith(APP_DIR)) {
      res.writeHead(403);
      res.end('forbidden');
      return;
    }
    const body = await readFile(file);
    res.writeHead(200, {
      'content-type': TYPES[extname(file)] || 'application/octet-stream',
      'cache-control': 'no-store',
    });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
});

server.listen(PORT, () => {
  console.log('serving app/ at http://localhost:' + PORT + '/');
});
