'use strict';

/*
 * data.js — satu-satunya tempat angka berada di situs ini.
 *
 * Aturan file ini: HANYA angka terverifikasi dari BPS dan World Bank yang
 * tercantum di bawah. Tidak ada angka tebakan. Bila sebuah angka tidak ada
 * di sini, angka itu tidak tampil di situs.
 *
 * Satuan: penduduk dalam juta jiwa, uang dalam dolar AS, persen dalam persen
 * per tahun kecuali disebut lain. Koma desimal Indonesia dipakai saat tampil.
 */

const DATA = {
  meta: {
    country: 'Indonesia',
    year: 2024,
    headline: '281,6 juta jiwa · PDB US$1,40 triliun · 2024',
    sourcesLine: 'Sumber: BPS — Badan Pusat Statistik & World Bank, 2024',
  },

  /* Penduduk: BPS, pertengahan tahun. 2024 tumbuh 1,11% dari 278,69 jt (2023). */
  population: {
    total2024: 281.6,
    growthVs2023: 1.11,
    total2023: 278.69,
    trend: [
      { year: 2020, value: 270.2 },
      { year: 2021, value: 272.25 },
      { year: 2022, value: 275.77 },
      { year: 2023, value: 278.69 },
      { year: 2024, value: 281.6 },
    ],
    /* Satu-satunya angka struktur umur yang terverifikasi: kelompok
     * produktif 15–64 tahun sekitar 68% penduduk (BPS 2024). */
    productiveShare: 68,
  },

  /* PDB: World Bank 2024. */
  economy: {
    gdpTrillionUsd: 1.4,
    gdpPerCapitaUsd: 4925,
    growth: [
      { year: 2020, value: -2.07 },
      { year: 2021, value: 3.7 },
      { year: 2022, value: 5.31 },
      { year: 2023, value: 5.05 },
      { year: 2024, value: 5.03 },
    ],
    /* Lima lapangan usaha penyumbang terbesar PDB 2024 menurut BPS.
     * Pangsa persen TIDAK dicantumkan: tidak ada angka pangsa yang
     * terverifikasi di tangan kami, jadi urutan saja yang ditampilkan. */
    topSectors: [
      'Industri pengolahan',
      'Perdagangan',
      'Pertanian',
      'Konstruksi',
      'Pertambangan',
    ],
  },

  /* Inflasi: BPS, persen yoy. */
  inflation: {
    latest: 1.57,
    trend: [
      { year: 2020, value: 1.68 },
      { year: 2021, value: 1.87 },
      { year: 2022, value: 5.51 },
      { year: 2023, value: 2.61 },
      { year: 2024, value: 1.57 },
    ],
  },

  /* Kemiskinan: BPS. */
  poverty: {
    mar2024: 9.03,
    sep2024: 8.57,
    ruralSep2024: 11.34,
    urbanSep2024: 6.66,
    lineSep2024: 595242,
  },

  /* Ketenagakerjaan: BPS Sakernas. */
  labour: {
    labourForceAug2024: 152.11,
    employedFeb2024: 142.18,
    tptFeb2024: 4.82,
    tptAug2024: 4.91,
    topSectors: [
      { name: 'Pertanian', share: 28.15 },
      { name: 'Perdagangan', share: 18.73 },
      { name: 'Industri pengolahan', share: 13.86 },
    ],
  },

  /* Provinsi terpadat 2024 (BPS, juta jiwa, dibulatkan). */
  provinces: [
    { name: 'Jawa Barat', pop: 50.4 },
    { name: 'Jawa Timur', pop: 41.8 },
    { name: 'Jawa Tengah', pop: 37.9 },
    { name: 'Sumatera Utara', pop: 15.6 },
    { name: 'Banten', pop: 12.4 },
    { name: 'DKI Jakarta', pop: 10.6 },
  ],

  /* Demografi tambahan: World Bank 2024. */
  demography: {
    lifeExpectancy: 71.29,
    fertility: 2.12,
  },

  /*
   * Bentuk piramida usia. PERHATIAN: bobot di bawah ini hanya pembentuk
   * GAMBAR — sebuah sketsa bentuk umum struktur umur Indonesia. Satu-satunya
   * angka yang dijamin dari bobot ini adalah kelompok 15–64 yang diskalakan
   * tepat ke 68% (lihat charts.js). Angka per kelompok umur TIDAK PERNAH
   * ditampilkan sebagai angka di situs; keterangan di bawah grafik
   * menjelaskannya secara terbuka.
   */
  pyramidShape: [
    { group: '0–4', w: 8.0 },
    { group: '5–9', w: 8.2 },
    { group: '10–14', w: 8.0 },
    { group: '15–19', w: 8.1 },
    { group: '20–24', w: 8.2 },
    { group: '25–29', w: 8.0 },
    { group: '30–34', w: 7.9 },
    { group: '35–39', w: 7.8 },
    { group: '40–44', w: 7.5 },
    { group: '45–49', w: 7.0 },
    { group: '50–54', w: 6.2 },
    { group: '55–59', w: 5.3 },
    { group: '60–64', w: 4.3 },
    { group: '65–69', w: 3.3 },
    { group: '70–74', w: 2.2 },
    { group: '75+', w: 2.0 },
  ],
};
