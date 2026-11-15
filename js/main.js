/* ==========================================================================
   SMART Document Expiry Tracker - page script
   1. Phone menu (open / close)
   2. Highlights the nav link for the section on screen
   3. Builds the Integrations section from the CMS data file
      (js/integrations-data.js), as cards or as a CMS table
   Nothing here sends data anywhere. The email and approvals are simulated.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- 1. Phone menu ---------- */
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  function setMenu(open) {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }

  if (header && toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (header.classList.contains('is-open') && !header.contains(e.target)) setMenu(false);
    });
    var wide = window.matchMedia('(min-width: 900px)');
    var onWide = function (e) { if (e.matches) setMenu(false); };
    if (wide.addEventListener) wide.addEventListener('change', onWide);
    else if (wide.addListener) wide.addListener(onWide);
  }

  /* ---------- 2. Active nav link ---------- */
  var links = nav ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]')) : [];
  if ('IntersectionObserver' in window && links.length) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
        var link = byId[entry.target.id];
        if (link) { link.classList.add('is-active'); link.setAttribute('aria-current', 'true'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  /* ---------- 3. Integrations from the CMS data ---------- */
  var cms = window.SDET_CMS && window.SDET_CMS.integrations;
  var cardsMount = document.getElementById('int-cards');
  var tableMount = document.getElementById('int-table');
  if (!cms || !cardsMount || !tableMount) return;

  // Straight apostrophes in the data become curly ones on the page.
  function tidy(text) { return String(text).replace(/'/g, '’'); }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = tidy(text);
    return node;
  }

  // Status value -> label style. Unknown values fall back to a neutral tag.
  function statusKind(status) {
    if (/^simulated/i.test(status)) return 'sim';
    if (/outside|not connected/i.test(status)) return 'out';
    if (/^real|connected/i.test(status)) return 'real';
    return 'out';
  }

  function statusTag(status) {
    return el('span', 'tag tag--' + statusKind(status), status);
  }

  var fields = cms.fields;
  var items = cms.items;
  var total = items.length;

  // Collection summary line
  var meta = document.getElementById('cms-meta');
  if (meta) {
    meta.textContent = '';
    meta.appendChild(document.createTextNode('CMS collection '));
    meta.appendChild(el('code', null, cms.collection));
    meta.appendChild(document.createTextNode(' · ' + fields.length + ' fields · ' + total + ' items'));
  }

  // Cards: one card per CMS item, fields in collection order
  items.forEach(function (item, i) {
    var card = el('article', 'int-card int-card--' + statusKind(item.status));
    var head = el('header');
    head.appendChild(el('p', 'item-no', 'CMS item ' + (i + 1) + ' of ' + total));
    head.appendChild(el('h3', null, item.systemName));
    card.appendChild(head);

    var dl = el('dl');
    fields.forEach(function (field) {
      if (field.key === 'systemName') return; // already the card title
      var row = el('div');
      row.appendChild(el('dt', null, field.label));
      var dd = el('dd');
      if (field.key === 'status') dd.appendChild(statusTag(item.status));
      else dd.textContent = tidy(item[field.key]);
      row.appendChild(dd);
      dl.appendChild(row);
    });
    card.appendChild(dl);
    cardsMount.appendChild(card);
  });

  // Table: the same collection seen as a spreadsheet (collection = table,
  // field = column, item = row)
  var table = el('table', 'cms');
  table.appendChild(el('caption', null, cms.collection + ' collection: each row is one CMS item, each column is one field.'));
  var thead = el('thead');
  var headRow = el('tr');
  fields.forEach(function (field) {
    var th = el('th', null, field.label);
    th.setAttribute('scope', 'col');
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);
  var tbody = el('tbody');
  items.forEach(function (item) {
    var tr = el('tr');
    fields.forEach(function (field) {
      var td = el('td');
      if (field.key === 'status') td.appendChild(statusTag(item.status));
      else td.textContent = tidy(item[field.key]);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  tableMount.appendChild(table);

  // Cards / CMS table switch
  var buttons = Array.prototype.slice.call(document.querySelectorAll('.view-toggle button'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-view-panel]'));
  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      var view = button.getAttribute('data-view');
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === button)); });
      panels.forEach(function (panel) { panel.hidden = panel.getAttribute('data-view-panel') !== view; });
    });
  });
})();
