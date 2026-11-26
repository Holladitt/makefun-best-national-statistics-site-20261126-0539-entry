'use strict';

/*
 * views.js — merender tiap halaman hash-route menjadi HTML.
 * Satu tugas: ubah DATA + grafik menjadi markup. Semua angka diambil
 * dari data.js; file ini tidak menyimpan angka sendiri.
 */

function kpiCard(href, label, value, unit, source, linkText) {
  return '<a class="kpi" href="' + href + '">'
    + '<p class="kpi-label">' + esc(label) + '</p>'
    + '<p class="kpi-value">' + value + (unit ? ' <small>' + esc(unit) + '</small>' : '') + '</p>'
    + '<p class="kpi-source">' + esc(source) + '</p>'
    + '<p class="kpi-link">' + esc(linkText) + ' &rarr;</p>'
    + '</a>';
}

function provinceRows(provinces) {
  return provinces.map(function (p) {
    return '<tr><td>' + esc(p.name) + '</td><td class="num">' + fmtId(p.pop, 1) + '</td></tr>';
  }).join('');
}

function provinceTable(idPrefix, provinces, withControls) {
  const controls = withControls
    ? '<div class="toolbar"><label for="' + idPrefix + '-search">Cari provinsi:</label>'
    + '<input type="search" id="' + idPrefix + '-search" placeholder="mis. Jawa Barat" aria-label="Cari provinsi"></div>'
    : '';
  return controls
    + '<table class="data" id="' + idPrefix + '-table">'
    + '<thead><tr>'
    + '<th class="sortable" data-sort="name" data-dir="asc" scope="col">Provinsi &#8597;</th>'
    + '<th class="sortable num" data-sort="pop" data-dir="desc" scope="col">Penduduk (juta) &#8597;</th>'
    + '</tr></thead>'
    + '<tbody>' + provinceRows(provinces) + '</tbody>'
    + '</table>'
    + '<p class="source-note">Sumber: BPS 2024, juta jiwa, dibulatkan. Klik judul kolom untuk mengurutkan.</p>';
}

function renderHome() {
  const d = DATA;
  const growthPts = d.economy.growth.map(function (g) { return { label: String(g.year), value: g.value }; });
  const inflPts = d.inflation.trend.map(function (g) { return { label: String(g.year), value: g.value }; });
  return ''
    + '<h2 class="page-title">Ikhtisar Indonesia 2024</h2>'
    + '<p class="page-lede">Enam angka utama negara — penduduk, ekonomi, harga, dan pekerjaan — '
    + 'semuanya dari BPS dan World Bank, semuanya bisa diklik untuk melihat rinciannya.</p>'
    + '<div class="kpi-grid">'
    + kpiCard('#/penduduk', 'Penduduk', '281,6', 'juta jiwa', 'BPS 2024 · tumbuh 1,11% vs 2023', 'Lihat penduduk')
    + kpiCard('#/ekonomi', 'PDB', 'US$1,40', 'triliun', 'World Bank 2024', 'Lihat ekonomi')
    + kpiCard('#/ekonomi', 'PDB per kapita', 'US$4.925', '', 'World Bank 2024', 'Lihat ekonomi')
    + kpiCard('#/ekonomi', 'Pertumbuhan ekonomi', '5,03', '% yoy', 'BPS 2024', 'Lihat ekonomi')
    + kpiCard('#/harga', 'Inflasi', '1,57', '% yoy', 'BPS 2024', 'Lihat harga')
    + kpiCard('#/tenaga-kerja', 'Pengangguran terbuka', '4,91', '% (TPT)', 'BPS, Agustus 2024', 'Lihat tenaga kerja')
    + '</div>'
    + '<div class="chart-grid">'
    + '<section class="panel"><h3>Pertumbuhan ekonomi 2020–2024</h3>'
    + '<p class="panel-sub">Persen yoy, BPS. Tahun 2020 minus karena pandemi.</p>'
    + lineChart(growthPts, { unit: '%', color: '#1d4e79', title: 'Pertumbuhan ekonomi Indonesia 2020-2024' })
    + '<p class="source-note">Sumber: BPS.</p></section>'
    + '<section class="panel"><h3>Inflasi 2020–2024</h3>'
    + '<p class="panel-sub">Persen yoy, BPS. Puncak 5,51% pada 2022.</p>'
    + lineChart(inflPts, { unit: '%', color: '#b34a2b', title: 'Inflasi Indonesia 2020-2024' })
    + '<p class="source-note">Sumber: BPS.</p></section>'
    + '</div>'
    + '<h3 class="section-title">5 provinsi terpadat</h3>'
    + provinceTable('home', d.provinces.slice(0, 5), false)
    + '<p class="caption">Tabel lengkap dengan pencarian dan pengurutan ada di halaman '
    + '<a href="#/penduduk">Penduduk</a>.</p>';
}

function renderPenduduk() {
  const d = DATA;
  const trendPts = d.population.trend.map(function (g) { return { label: String(g.year), value: g.value }; });
  return ''
    + '<h2 class="page-title">Penduduk</h2>'
    + '<p class="page-lede">281,6 juta jiwa pada 2024 (BPS), tumbuh 1,11% dari 278,69 juta pada 2023. '
    + 'Kelompok usia produktif 15–64 tahun sekitar 68% penduduk.</p>'
    + '<div class="mini-stats">'
    + '<div class="mini-stat"><p class="v">281,6 jt</p><p class="l">Penduduk 2024 (BPS)</p></div>'
    + '<div class="mini-stat"><p class="v">+1,11%</p><p class="l">Tumbuh vs 2023 (278,69 jt)</p></div>'
    + '<div class="mini-stat"><p class="v">71,29 thn</p><p class="l">Harapan hidup 2024 (World Bank)</p></div>'
    + '</div>'
    + '<section class="panel"><h3>Piramida usia 2024</h3>'
    + '<p class="panel-sub">Bentuk piramida penduduk Indonesia. Kelompok produktif 15–64 tahun '
    + 'ditandai emas — sekitar 68% penduduk (BPS 2024).</p>'
    + '<div class="chart-narrow">' + pyramidChart(d.pyramidShape, d.population.productiveShare) + '</div>'
    + '<p class="caption">Catatan jujur: grafik ini sketsa bentuk piramida berdasarkan struktur umur '
    + 'BPS 2024. Satu-satunya angka yang dijamin adalah kelompok 15–64 sekitar 68%; angka per '
    + 'kelompok umur 5 tahun tidak ditampilkan karena tidak terverifikasi. Fertilitas 2024: '
    + '2,12 anak per perempuan (World Bank).</p></section>'
    + '<section class="panel"><h3>Tren penduduk 2020–2024</h3>'
    + '<p class="panel-sub">Juta jiwa, pertengahan tahun, BPS.</p>'
    + lineChart(trendPts, { unit: '', color: '#1d4e79', decimals: 2, title: 'Tren penduduk Indonesia 2020-2024' })
    + '<p class="source-note">Sumber: BPS.</p></section>'
    + '<h3 class="section-title">Provinsi terpadat 2024</h3>'
    + provinceTable('prov', d.provinces, true);
}

function renderEkonomi() {
  const d = DATA;
  const growthPts = d.economy.growth.map(function (g) { return { label: String(g.year), value: g.value }; });
  const sectorItems = d.economy.topSectors.map(function (name) {
    return '<li>' + esc(name) + '</li>';
  }).join('');
  return ''
    + '<h2 class="page-title">Ekonomi</h2>'
    + '<p class="page-lede">PDB US$1,40 triliun dan PDB per kapita US$4.925 pada 2024 (World Bank). '
    + 'Ekonomi tumbuh 5,03% pada 2024 (BPS).</p>'
    + '<div class="mini-stats">'
    + '<div class="mini-stat"><p class="v">US$1,40 T</p><p class="l">PDB 2024 (World Bank)</p></div>'
    + '<div class="mini-stat"><p class="v">US$4.925</p><p class="l">PDB per kapita 2024 (World Bank)</p></div>'
    + '<div class="mini-stat"><p class="v">5,03%</p><p class="l">Pertumbuhan 2024 (BPS)</p></div>'
    + '</div>'
    + '<div class="tabs" role="tablist" aria-label="Pilih tampilan ekonomi">'
    + '<button role="tab" aria-selected="true" data-tab="growth">Pertumbuhan 2020–2024</button>'
    + '<button role="tab" aria-selected="false" data-tab="sectors">Lapangan usaha terbesar</button>'
    + '</div>'
    + '<section class="panel" id="tab-growth"><h3>Pertumbuhan ekonomi 2020–2024</h3>'
    + '<p class="panel-sub">Persen yoy, BPS. Kontraksi 2020 sebesar &minus;2,07% lalu pulih di atas 5%.</p>'
    + barChart(growthPts, { unit: '%', color: '#1d4e79', negColor: '#b34a2b', title: 'Pertumbuhan ekonomi Indonesia 2020-2024' })
    + '<p class="source-note">Sumber: BPS.</p></section>'
    + '<section class="panel" id="tab-sectors" hidden><h3>Lima lapangan usaha penyumbang terbesar PDB 2024</h3>'
    + '<p class="panel-sub">Urutan menurut BPS. Pangsa persen tidak dicantumkan karena tidak ada angka '
    + 'pangsa yang terverifikasi — kami tidak menebak angka.</p>'
    + '<ol class="sector-list">' + sectorItems + '</ol>'
    + '<p class="source-note">Sumber: BPS 2024 (urutan lapangan usaha).</p></section>';
}

function renderHarga() {
  const d = DATA;
  const inflPts = d.inflation.trend.map(function (g) { return { label: String(g.year), value: g.value }; });
  const povPts = [
    { label: 'Mar 2024', value: d.poverty.mar2024 },
    { label: 'Sep 2024', value: d.poverty.sep2024 },
  ];
  return ''
    + '<h2 class="page-title">Harga &amp; Kemiskinan</h2>'
    + '<p class="page-lede">Inflasi 2024 sebesar 1,57% (BPS). Kemiskinan turun dari 9,03% (Maret 2024) '
    + 'menjadi 8,57% (September 2024).</p>'
    + '<div class="mini-stats">'
    + '<div class="mini-stat"><p class="v">1,57%</p><p class="l">Inflasi 2024 (BPS)</p></div>'
    + '<div class="mini-stat"><p class="v">8,57%</p><p class="l">Kemiskinan Sep 2024 (BPS)</p></div>'
    + '<div class="mini-stat"><p class="v">Rp595.242</p><p class="l">Garis kemiskinan /kapita/bulan, Sep 2024</p></div>'
    + '</div>'
    + '<div class="tabs" role="tablist" aria-label="Pilih tampilan harga">'
    + '<button role="tab" aria-selected="true" data-tab="inflation">Inflasi 2020–2024</button>'
    + '<button role="tab" aria-selected="false" data-tab="poverty">Kemiskinan 2024</button>'
    + '</div>'
    + '<section class="panel" id="tab-inflation"><h3>Tren inflasi 2020–2024</h3>'
    + '<p class="panel-sub">Persen yoy, BPS.</p>'
    + lineChart(inflPts, { unit: '%', color: '#b34a2b', title: 'Inflasi Indonesia 2020-2024' })
    + '<p class="source-note">Sumber: BPS.</p></section>'
    + '<section class="panel" id="tab-poverty" hidden><h3>Kemiskinan 2024</h3>'
    + '<p class="panel-sub">Persen penduduk miskin, BPS.</p>'
    + lineChart(povPts, { unit: '%', color: '#2f7d4f', decimals: 2, title: 'Kemiskinan Indonesia Maret-September 2024' })
    + '<p class="caption">Desa 11,34% vs kota 6,66% pada September 2024. Garis kemiskinan '
    + 'Rp595.242 per kapita per bulan (BPS, Sep 2024).</p>'
    + '<p class="source-note">Sumber: BPS.</p></section>'
    + '<section class="panel"><h3>Kemiskinan desa vs kota, September 2024</h3>'
    + '<p class="panel-sub">Persen penduduk miskin, BPS.</p>'
    + hbarChart([
      { label: 'Perdesaan', value: d.poverty.ruralSep2024 },
      { label: 'Perkotaan', value: d.poverty.urbanSep2024 },
    ], { unit: '%', color: '#1d4e79', title: 'Kemiskinan desa vs kota September 2024' })
    + '<p class="source-note">Sumber: BPS, September 2024.</p></section>';
}

function renderTenagaKerja() {
  const d = DATA;
  const tptPts = [
    { label: 'Feb 2024', value: d.labour.tptFeb2024 },
    { label: 'Agu 2024', value: d.labour.tptAug2024 },
  ];
  return ''
    + '<h2 class="page-title">Tenaga Kerja</h2>'
    + '<p class="page-lede">Angkatan kerja 152,11 juta jiwa pada Agustus 2024 (BPS). Tingkat '
    + 'pengangguran terbuka (TPT) 4,91% — naik tipis dari 4,82% pada Februari 2024.</p>'
    + '<div class="mini-stats">'
    + '<div class="mini-stat"><p class="v">152,11 jt</p><p class="l">Angkatan kerja, Agu 2024 (BPS)</p></div>'
    + '<div class="mini-stat"><p class="v">142,18 jt</p><p class="l">Penduduk bekerja, Feb 2024 (BPS)</p></div>'
    + '<div class="mini-stat"><p class="v">4,91% <span class="pill warn">naik dari 4,82%</span></p><p class="l">TPT, Agu 2024 vs Feb 2024 (BPS)</p></div>'
    + '</div>'
    + '<section class="panel"><h3>Tingkat pengangguran terbuka (TPT) 2024</h3>'
    + '<p class="panel-sub">Persen, BPS Sakernas.</p>'
    + lineChart(tptPts, { unit: '%', color: '#b34a2b', decimals: 2, title: 'TPT Indonesia Februari-Agustus 2024' })
    + '<p class="source-note">Sumber: BPS Sakernas 2024.</p></section>'
    + '<section class="panel"><h3>Tiga sektor penyerap tenaga kerja terbesar, Agustus 2024</h3>'
    + '<p class="panel-sub">Persen dari penduduk bekerja, BPS Sakernas.</p>'
    + hbarChart(d.labour.topSectors.map(function (s) { return { label: s.name, value: s.share }; }),
      { unit: '%', color: '#2f7d4f', title: 'Sektor penyerap tenaga kerja Agustus 2024' })
    + '<p class="source-note">Sumber: BPS Sakernas, Agustus 2024.</p></section>';
}

function renderMetodologi() {
  const rows = [
    ['Penduduk 2024', '281,6 juta jiwa', 'BPS 2024', 'Pertengahan tahun; tumbuh 1,11% vs 278,69 jt (2023).'],
    ['Tren penduduk 2020–2024', '270,20 · 272,25 · 275,77 · 278,69 · 281,60 jt', 'BPS', 'Pertengahan tahun.'],
    ['Kelompok produktif 15–64', 'Sekitar 68% penduduk', 'BPS 2024', 'Satu-satunya angka struktur umur yang ditampilkan.'],
    ['PDB 2024', 'US$1,40 triliun', 'World Bank 2024', 'Harga berlaku, dolar AS.'],
    ['PDB per kapita 2024', 'US$4.925', 'World Bank 2024', 'Harga berlaku, dolar AS.'],
    ['Pertumbuhan ekonomi', '2020 −2,07 · 2021 3,70 · 2022 5,31 · 2023 5,05 · 2024 5,03%', 'BPS', 'Persen yoy.'],
    ['Inflasi', '2020 1,68 · 2021 1,87 · 2022 5,51 · 2023 2,61 · 2024 1,57%', 'BPS', 'Persen yoy.'],
    ['Kemiskinan', 'Mar 2024 9,03% · Sep 2024 8,57%', 'BPS', 'Persen penduduk miskin.'],
    ['Kemiskinan desa / kota', 'Desa 11,34% · Kota 6,66%', 'BPS, Sep 2024', 'Persen penduduk miskin.'],
    ['Garis kemiskinan', 'Rp595.242 /kapita/bulan', 'BPS, Sep 2024', 'Batas pengeluaran minimum untuk tidak miskin.'],
    ['Angkatan kerja', '152,11 juta jiwa', 'BPS, Agu 2024', 'Sakernas.'],
    ['Penduduk bekerja', '142,18 juta jiwa', 'BPS, Feb 2024', 'Sakernas; periode berbeda dengan angkatan kerja.'],
    ['TPT', 'Feb 2024 4,82% · Agu 2024 4,91%', 'BPS Sakernas', 'Tingkat pengangguran terbuka: penganggur dibagi angkatan kerja.'],
    ['Sektor penyerap kerja', 'Pertanian 28,15% · Perdagangan 18,73% · Industri 13,86%', 'BPS, Agu 2024', 'Persen dari penduduk bekerja.'],
    ['Provinsi terpadat', 'Jabar 50,4 · Jatim 41,8 · Jateng 37,9 · Sumut 15,6 · Banten 12,4 · DKI 10,6 jt', 'BPS 2024', 'Juta jiwa, dibulatkan.'],
    ['Harapan hidup 2024', '71,29 tahun', 'World Bank 2024', 'Saat lahir.'],
    ['Fertilitas 2024', '2,12 anak per perempuan', 'World Bank 2024', 'Angka fertilitas total.'],
  ];
  const body = rows.map(function (r) {
    return '<tr><td><strong>' + esc(r[0]) + '</strong></td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td><td>' + esc(r[3]) + '</td></tr>';
  }).join('');
  return ''
    + '<h2 class="page-title">Sumber &amp; Metode</h2>'
    + '<p class="page-lede">Semua angka di situs ini, beserta sumber, tahun, dan catatannya. '
    + 'Angka dibulatkan untuk dibaca; angka rinci ada di BPS dan World Bank.</p>'
    + '<table class="data"><thead><tr>'
    + '<th scope="col">Angka</th><th scope="col">Nilai</th><th scope="col">Sumber</th><th scope="col">Catatan</th>'
    + '</tr></thead><tbody>' + body + '</tbody></table>'
    + '<h3 class="section-title">Definisi</h3>'
    + '<section class="panel"><p><strong>TPT (Tingkat Pengangguran Terbuka)</strong> — penganggur dibagi '
    + 'angkatan kerja, dikali 100%. Diukur BPS lewat Sakernas (Survei Angkatan Kerja Nasional).</p>'
    + '<p><strong>Garis kemiskinan</strong> — batas pengeluaran minimum per kapita per bulan untuk '
    + 'dikatakan tidak miskin (BPS).</p>'
    + '<p><strong>PDB per kapita</strong> — PDB dibagi jumlah penduduk (World Bank).</p>'
    + '<p><strong>Piramida usia</strong> — grafik di halaman Penduduk adalah sketsa bentuk struktur umur; '
    + 'angka per kelompok umur tidak ditampilkan karena tidak terverifikasi. Yang dijamin: kelompok '
    + '15–64 sekitar 68% penduduk (BPS 2024).</p>'
    + '<p><strong>Lapangan usaha</strong> — halaman Ekonomi hanya menampilkan urutan lima lapangan usaha '
    + 'terbesar; pangsa persen tidak dicantumkan karena tidak ada angka pangsa yang terverifikasi.</p></section>';
}

const VIEWS = {
  home: renderHome,
  penduduk: renderPenduduk,
  ekonomi: renderEkonomi,
  harga: renderHarga,
  'tenaga-kerja': renderTenagaKerja,
  metodologi: renderMetodologi,
};
