'use strict';

/*
 * charts.js — menggambar grafik sebagai SVG inline, tanpa library.
 * Satu tugas: terima angka, kembalikan string SVG. Tidak membaca DOM,
 * tidak menyentuh jaringan.
 */

const CHART = {
  navy: '#0e2a47',
  navy2: '#1d4e79',
  gold: '#e9a319',
  teal: '#2f7d4f',
  rust: '#b34a2b',
  grid: '#e3e8ed',
  axis: '#8a99a8',
  text: '#42536a',
};

/** Angka gaya Indonesia: koma desimal, titik ribuan. */
function fmtId(n, decimals) {
  const dec = decimals === undefined ? 2 : decimals;
  const fixed = Number(n).toFixed(dec);
  const parts = fixed.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return dec === 0 ? parts[0] : parts[0] + ',' + parts[1];
}

/** Loloskan teks untuk disisipkan ke SVG/HTML. */
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Skala linear: nilai -> piksel pada sumbu dengan batas lo..hi. */
function makeScale(lo, hi, px0, px1) {
  const span = hi - lo === 0 ? 1 : hi - lo;
  return function (v) {
    return px0 + ((v - lo) / span) * (px1 - px0);
  };
}

/*
 * Grafik garis. points: [{label, value}]. opts: width, height, unit
 * (mis. '%'), color, decimals, ymin, ymax, title (untuk <title> SVG).
 */
function lineChart(points, opts) {
  const o = opts || {};
  const w = o.width || 480;
  const h = o.height || 260;
  const padL = 52;
  const padR = 18;
  const padT = 22;
  const padB = 34;
  const vals = points.map(function (p) { return p.value; });
  let lo = o.ymin !== undefined ? o.ymin : Math.min.apply(null, vals);
  let hi = o.ymax !== undefined ? o.ymax : Math.max.apply(null, vals);
  if (lo === hi) { lo -= 1; hi += 1; }
  const pad = (hi - lo) * 0.12;
  lo -= pad;
  hi += pad;
  const x = makeScale(0, points.length - 1, padL, w - padR);
  const y = makeScale(lo, hi, h - padB, padT);
  const dec = o.decimals === undefined ? 2 : o.decimals;
  const color = o.color || CHART.navy2;

  let s = '<svg class="chart" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(o.title || 'Grafik garis') + '">';
  s += '<title>' + esc(o.title || 'Grafik garis') + '</title>';
  const ticks = 4;
  for (let t = 0; t <= ticks; t++) {
    const v = lo + ((hi - lo) * t) / ticks;
    const yy = y(v);
    s += '<line x1="' + padL + '" y1="' + yy.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + yy.toFixed(1) + '" stroke="' + CHART.grid + '" stroke-width="1"/>';
    s += '<text x="' + (padL - 8) + '" y="' + (yy + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="' + CHART.text + '">' + fmtId(v, dec) + (o.unit || '') + '</text>';
  }
  const linePts = points.map(function (p, i) { return x(i).toFixed(1) + ',' + y(p.value).toFixed(1); }).join(' ');
  s += '<polyline points="' + linePts + '" fill="none" stroke="' + color + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>';
  points.forEach(function (p, i) {
    const cx = x(i);
    const cy = y(p.value);
    s += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="4.5" fill="#fff" stroke="' + color + '" stroke-width="2.5"/>';
    s += '<text x="' + cx.toFixed(1) + '" y="' + (cy - 11).toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="700" fill="' + CHART.navy + '">' + fmtId(p.value, dec) + (o.unit || '') + '</text>';
    s += '<text x="' + cx.toFixed(1) + '" y="' + (h - 10) + '" text-anchor="middle" font-size="11.5" fill="' + CHART.text + '">' + esc(p.label) + '</text>';
  });
  s += '</svg>';
  return s;
}

/*
 * Grafik batang tegak, bisa memuat nilai negatif (garis nol digambar).
 * points: [{label, value}]. opts: width, height, unit, color, decimals.
 */
function barChart(points, opts) {
  const o = opts || {};
  const w = o.width || 480;
  const h = o.height || 260;
  const padL = 52;
  const padR = 14;
  const padT = 24;
  const padB = 34;
  const vals = points.map(function (p) { return p.value; });
  let lo = Math.min(0, Math.min.apply(null, vals));
  let hi = Math.max.apply(null, vals);
  if (hi === lo) hi = lo + 1;
  const pad = (hi - lo) * 0.1;
  hi += pad;
  if (lo < 0) lo -= pad;
  const y = makeScale(lo, hi, h - padB, padT);
  const dec = o.decimals === undefined ? 2 : o.decimals;
  const color = o.color || CHART.navy2;
  const negColor = o.negColor || CHART.rust;
  const slot = (w - padL - padR) / points.length;
  const barW = Math.min(46, slot * 0.62);
  const zeroY = y(0);

  let s = '<svg class="chart" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(o.title || 'Grafik batang') + '">';
  s += '<title>' + esc(o.title || 'Grafik batang') + '</title>';
  const ticks = 4;
  for (let t = 0; t <= ticks; t++) {
    const v = lo + ((hi - lo) * t) / ticks;
    const yy = y(v);
    s += '<line x1="' + padL + '" y1="' + yy.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + yy.toFixed(1) + '" stroke="' + CHART.grid + '" stroke-width="1"/>';
    s += '<text x="' + (padL - 8) + '" y="' + (yy + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="' + CHART.text + '">' + fmtId(v, dec) + (o.unit || '') + '</text>';
  }
  s += '<line x1="' + padL + '" y1="' + zeroY.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + zeroY.toFixed(1) + '" stroke="' + CHART.axis + '" stroke-width="1.5"/>';
  points.forEach(function (p, i) {
    const cx = padL + slot * i + slot / 2;
    const yv = y(p.value);
    const top = Math.min(yv, zeroY);
    const bh = Math.max(1, Math.abs(zeroY - yv));
    const fill = p.value < 0 ? negColor : color;
    s += '<rect x="' + (cx - barW / 2).toFixed(1) + '" y="' + top.toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + bh.toFixed(1) + '" rx="3" fill="' + fill + '"/>';
    const labelY = p.value < 0 ? yv + 16 : yv - 8;
    s += '<text x="' + cx.toFixed(1) + '" y="' + labelY.toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="700" fill="' + CHART.navy + '">' + fmtId(p.value, dec) + (o.unit || '') + '</text>';
    s += '<text x="' + cx.toFixed(1) + '" y="' + (h - 10) + '" text-anchor="middle" font-size="11.5" fill="' + CHART.text + '">' + esc(p.label) + '</text>';
  });
  s += '</svg>';
  return s;
}

/*
 * Grafik batang horizontal. items: [{label, value}]. opts: width, height,
 * unit, color, decimals, max (batas sumbu; default nilai terbesar).
 */
function hbarChart(items, opts) {
  const o = opts || {};
  const w = o.width || 480;
  const rowH = o.rowHeight || 44;
  const padL = 8;
  const padR = 64;
  const labelH = 20;
  const h = items.length * rowH + 16;
  const max = o.max !== undefined ? o.max : Math.max.apply(null, items.map(function (d) { return d.value; }));
  const dec = o.decimals === undefined ? 2 : o.decimals;
  const color = o.color || CHART.navy2;

  let s = '<svg class="chart" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(o.title || 'Grafik batang horizontal') + '">';
  s += '<title>' + esc(o.title || 'Grafik batang horizontal') + '</title>';
  items.forEach(function (d, i) {
    const yTop = 8 + i * rowH;
    const bw = Math.max(2, ((w - padL - padR) * d.value) / max);
    s += '<text x="' + padL + '" y="' + (yTop + 13) + '" font-size="12.5" font-weight="700" fill="' + CHART.navy + '">' + esc(d.label) + '</text>';
    s += '<rect x="' + padL + '" y="' + (yTop + labelH) + '" width="' + bw.toFixed(1) + '" height="14" rx="3" fill="' + color + '"/>';
    s += '<text x="' + (padL + bw + 8).toFixed(1) + '" y="' + (yTop + labelH + 12) + '" font-size="12.5" font-weight="700" fill="' + CHART.navy + '">' + fmtId(d.value, dec) + (o.unit || '') + '</text>';
  });
  s += '</svg>';
  return s;
}

/*
 * Piramida usia dua sisi (cermin). groups: [{group, w}] bobot bentuk dari
 * data.js; productiveShare: persen kelompok 15–64 yang terverifikasi (68).
 * Bobot diskalakan supaya blok 15–64 tepat = productiveShare dan sisanya
 * tepat = 100 - productiveShare. TIDAK ADA angka per kelompok yang
 * ditampilkan: batang tidak berlabel angka; keterangan kejujuran ditulis
 * oleh views.js di bawah grafik.
 */
function pyramidChart(groups, productiveShare) {
  const w = 520;
  const rowH = 19;
  const h = groups.length * rowH + 30;
  const midLabelW = 58;
  const cx = w / 2;
  const maxHalf = cx - midLabelW / 2 - 14;

  function isProductive(g) {
    const start = parseInt(g, 10);
    return start >= 15 && start < 65;
  }
  let prodSum = 0;
  let restSum = 0;
  groups.forEach(function (g) {
    if (isProductive(g.group)) prodSum += g.w;
    else restSum += g.w;
  });
  const prodScale = productiveShare / prodSum;
  const restScale = (100 - productiveShare) / restSum;
  const scaled = groups.map(function (g) {
    return { group: g.group, v: g.w * (isProductive(g.group) ? prodScale : restScale) };
  });
  const maxV = Math.max.apply(null, scaled.map(function (g) { return g.v; }));
  const pxPerUnit = maxHalf / maxV;

  let s = '<svg class="chart" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Piramida usia penduduk Indonesia 2024 (bentuk ilustratif)">';
  s += '<title>Piramida usia penduduk Indonesia 2024 (bentuk ilustratif)</title>';
  s += '<text x="' + cx + '" y="14" text-anchor="middle" font-size="11.5" fill="' + CHART.text + '">Usia muda di atas &middot; usia tua di bawah</text>';
  scaled.forEach(function (g, i) {
    const yTop = 22 + i * rowH;
    const bw = Math.max(2, g.v * pxPerUnit);
    const fill = isProductive(g.group) ? CHART.gold : CHART.navy2;
    const gapHalf = midLabelW / 2;
    s += '<rect x="' + (cx - gapHalf - bw).toFixed(1) + '" y="' + yTop + '" width="' + bw.toFixed(1) + '" height="14" rx="2" fill="' + fill + '"/>';
    s += '<rect x="' + (cx + gapHalf).toFixed(1) + '" y="' + yTop + '" width="' + bw.toFixed(1) + '" height="14" rx="2" fill="' + fill + '"/>';
    s += '<text x="' + cx + '" y="' + (yTop + 11) + '" text-anchor="middle" font-size="11" fill="' + CHART.navy + '" font-weight="700">' + esc(g.group) + '</text>';
  });
  s += '<line x1="' + cx + '" y1="20" x2="' + cx + '" y2="' + (h - 8) + '" stroke="' + CHART.axis + '" stroke-width="1"/>';
  s += '</svg>';
  return s;
}
