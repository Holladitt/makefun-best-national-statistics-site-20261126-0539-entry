# Indonesia dalam Angka

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/Holladitt/makefun-best-national-statistics-site-20261126-0539-entry/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/Holladitt/makefun-best-national-statistics-site-20261126-0539-entry/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

Situs statistik nasional Indonesia — **281,6 juta jiwa · PDB US$1,40 triliun · tumbuh 5,03% (2024)** —
dengan angka nyata dari **BPS (Badan Pusat Statistik)** dan **World Bank**. Situs statis tanpa
jaringan: buka `app/index.html` di peramban, semua halaman, grafik, dan tabel bekerja secara lokal.

## Isi

- **Beranda** — 6 kartu KPI (penduduk, PDB, PDB per kapita, pertumbuhan, inflasi, pengangguran),
  grafik pertumbuhan ekonomi dan inflasi 2020–2024, tabel 5 provinsi terpadat.
- **Penduduk** — piramida usia, tren penduduk 2020–2024, tabel provinsi yang bisa diurutkan dan dicari.
- **Ekonomi** — pertumbuhan 2020–2024, PDB dan PDB per kapita 2024, lima lapangan usaha terbesar.
- **Harga & Kemiskinan** — tren inflasi, tren kemiskinan, garis kemiskinan, desa vs kota.
- **Tenaga Kerja** — angkatan kerja, tingkat pengangguran terbuka, tiga sektor penyerap terbesar.
- **Sumber & Metode** — daftar semua angka beserta sumber, tahun, dan definisinya.

## Menjalankan lokal

```sh
node serve.ts
# lalu buka http://localhost:8080/
```

Tanpa build step, tanpa dependensi, tanpa font atau CDN eksternal. Grafik digambar sebagai SVG
oleh JavaScript dari data di `app/data.js`.

## Sumber data

- BPS — Badan Pusat Statistik (penduduk, pertumbuhan, inflasi, kemiskinan, ketenagakerjaan)
- World Bank (PDB, PDB per kapita, harapan hidup, fertilitas)

Semua angka tercantum beserta sumber dan tahunnya di halaman **Sumber & Metode**. Situs ini
bukan situs resmi BPS.

## Struktur

```text
app/
  index.html   kerangka halaman + navigasi
  style.css    tampilan (navy + emas, tipografi sistem)
  data.js      semua angka + sumber (satu-satunya tempat angka berada)
  charts.js    fungsi gambar grafik SVG
  views.js     render tiap halaman (hash route)
  router.js    navigasi hash, sorting, pencarian, tab
main.ts        menyalin app/ + screenshots/ ke output dan menulis dossier.json
serve.ts       server statis lokal (port 8080)
screenshots/   4 tangkapan layar asli dari kode situs ini
```

## Lisensi

MIT — lihat [LICENSE](LICENSE).
