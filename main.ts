// main.ts — program entry: menyalin app/ + screenshots/ ke direktori output
// lalu menulis dossier.json di sana dengan buildDossier dari vendor.
// Node 22, stdlib saja. Jalankan: node main.ts
// (atau MAKEFUN_OUTPUT_DIR=out node main.ts untuk output ke folder lain).

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { buildDossier } from './vendor/makefun-frontend.ts';

// Direktori output: MAKEFUN_OUTPUT_DIR bila disetel, kalau tidak /output.
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR || '/output');
const repoRoot = resolve(import.meta.dirname);

// Batas yang sama seperti contoh kit: teks maks 163840 byte, maks 4
// screenshot @ 256 KiB, app maks 993 file / 16 MiB.
const CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

mkdirSync(join(outDir, 'app'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });

// Gagal cepat dengan pesan jelas bila app/ belum lengkap, sebelum
// buildDossier sempat menolak dengan pesan yang lebih samar.
if (!existsSync(join(repoRoot, 'app', 'index.html'))) {
  throw new Error('main.ts: app/index.html tidak ada — entry belum lengkap');
}
if (!existsSync(join(repoRoot, 'screenshots'))) {
  throw new Error('main.ts: screenshots/ tidak ada — ambil screenshot dulu');
}

// Salin isi app/ dan screenshots/ apa adanya (deterministik: urutan
// penyalinan tidak memengaruhi isi dossier, yang dihitung dari file).
cpSync(join(repoRoot, 'app'), join(outDir, 'app'), { recursive: true });
cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });

const dossier = buildDossier(outDir, CAPS);
writeFileSync(join(outDir, 'dossier.json'), dossier);
console.log('dossier written: ' + join(outDir, 'dossier.json') + ' (' + dossier.length + ' bytes)');
