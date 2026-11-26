'use strict';

/*
 * router.js — navigasi hash + kontrol interaktif.
 * Satu tugas: baca location.hash, render halaman yang cocok, lalu pasang
 * pengurutan tabel, pencarian, dan tab di halaman yang sedang tampil.
 */

const ROUTES = ['home', 'penduduk', 'ekonomi', 'harga', 'tenaga-kerja', 'metodologi'];

function currentRoute() {
  const hash = window.location.hash || '#/';
  const path = hash.replace(/^#\/?/, '').split('?')[0].split('/')[0];
  return ROUTES.indexOf(path) >= 0 ? path : 'home';
}

function markNav(route) {
  const links = document.querySelectorAll('.topnav a');
  links.forEach(function (a) {
    if (a.getAttribute('data-route') === route) a.classList.add('active');
    else a.classList.remove('active');
  });
}

/* ---- tabel provinsi: klik judul kolom mengurutkan, ketik memfilter ---- */

function sortProvinces(rows, key, dir) {
  const sorted = rows.slice();
  sorted.sort(function (a, b) {
    if (key === 'name') {
      return dir === 'asc' ? a.name.localeCompare(b.name, 'id') : b.name.localeCompare(a.name, 'id');
    }
    return dir === 'asc' ? a.pop - b.pop : b.pop - a.pop;
  });
  return sorted;
}

function wireProvinceTable(prefix, initialRows) {
  const table = document.getElementById(prefix + '-table');
  if (!table) return;
  const search = document.getElementById(prefix + '-search');
  const tbody = table.querySelector('tbody');
  const headers = table.querySelectorAll('th.sortable');
  let rows = initialRows.slice();
  let query = '';

  function paint() {
    const visible = rows.filter(function (p) {
      return p.name.toLowerCase().indexOf(query) >= 0;
    });
    tbody.innerHTML = visible.map(function (p) {
      return '<tr><td>' + esc(p.name) + '</td><td class="num">' + fmtId(p.pop, 1) + '</td></tr>';
    }).join('');
    if (visible.length === 0) {
      tbody.innerHTML = '<tr><td colspan="2">Tidak ada provinsi yang cocok dengan pencarian.</td></tr>';
    }
  }

  headers.forEach(function (th) {
    th.addEventListener('click', function () {
      const key = th.getAttribute('data-sort');
      const nextDir = th.getAttribute('data-dir') === 'asc' ? 'desc' : 'asc';
      headers.forEach(function (h) { h.setAttribute('data-dir', 'asc'); });
      th.setAttribute('data-dir', nextDir);
      rows = sortProvinces(initialRows, key, nextDir);
      paint();
    });
  });

  if (search) {
    search.addEventListener('input', function () {
      query = search.value.trim().toLowerCase();
      paint();
    });
  }
}

/* ---- tab: tombol data-tab menampilkan panel id="tab-<nama>" ---- */

function wireTabs() {
  const buttons = document.querySelectorAll('.tabs button[data-tab]');
  if (buttons.length === 0) return;
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const name = btn.getAttribute('data-tab');
      buttons.forEach(function (b) {
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      document.querySelectorAll('section.panel[id^="tab-"]').forEach(function (panel) {
        panel.hidden = panel.id !== 'tab-' + name;
      });
    });
  });
}

/* ---- render ---- */

function render() {
  const route = currentRoute();
  const app = document.getElementById('app');
  const view = VIEWS[route] || VIEWS.home;
  app.innerHTML = view();
  markNav(route);
  wireProvinceTable('home', DATA.provinces.slice(0, 5));
  wireProvinceTable('prov', DATA.provinces);
  wireTabs();
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
document.addEventListener('DOMContentLoaded', render);
