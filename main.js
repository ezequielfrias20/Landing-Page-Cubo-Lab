/* =========================================================
   Cubo Labs · main.js
   ========================================================= */
(function () {
  'use strict';

  /* ---------- tiny DOM helper ---------- */
  function h(tag, attrs) {
    var e = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        var v = attrs[k];
        if (v == null) continue;
        if (k === 'class') e.className = v;
        else if (k === 'style') e.style.cssText = v;
        else if (k === 'html') e.innerHTML = v;
        else if (k.indexOf('on') === 0 && typeof v === 'function') e.addEventListener(k.slice(2).toLowerCase(), v);
        else e.setAttribute(k, v);
      }
    }
    for (var i = 2; i < arguments.length; i++) append(e, arguments[i]);
    return e;
  }
  function append(parent, kid) {
    if (kid == null || kid === false) return;
    if (Array.isArray(kid)) { kid.forEach(function (c) { append(parent, c); }); return; }
    parent.appendChild(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }

  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =====================================================
     NAV — burger + hide on scroll
     ===================================================== */
  (function () {
    var nav = document.getElementById('nav');
    var burger = document.getElementById('navBurger');
    var links = document.getElementById('navLinks');
    if (burger && links) {
      burger.addEventListener('click', function () {
        var open = links.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      });
      links.addEventListener('click', function (e) {
        if (e.target.closest('a')) {
          links.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
        }
      });
    }
    var last = 0;
    window.addEventListener('scroll', function () {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if (y > last && y > 220) nav.classList.add('is-hidden');
      else nav.classList.remove('is-hidden');
      last = y;
    }, { passive: true });
  })();

  /* =====================================================
     SCROLL REVEAL
     ===================================================== */
  (function () {
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
    if (prefersReduced || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    // stagger siblings sharing a parent
    var groups = new Map();
    els.forEach(function (el) {
      var p = el.parentElement;
      if (!groups.has(p)) groups.set(p, []);
      groups.get(p).push(el);
    });
    groups.forEach(function (list) {
      list.forEach(function (el, i) { el.style.transitionDelay = Math.min(i, 8) * 70 + 'ms'; });
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* =====================================================
     WHATSAPP CHAT ANIMATION (looping)
     ===================================================== */
  (function () {
    var feed = document.getElementById('waFeed');
    if (!feed) return;
    var script = [
      { type: 'msg', from: 'in', text: 'Hola 👋 Necesito cotizar 30 uniformes de enfermería', t: '9:41' },
      { type: 'typing' },
      { type: 'msg', from: 'out', text: '¡Hola! Soy el asistente de FR Medic Group 🤖\nCon gusto te ayudo. ¿Qué tallas necesitas?', t: '9:41' },
      { type: 'msg', from: 'in', text: '15 talla M y 15 talla L, en azul', t: '9:42' },
      { type: 'typing' },
      { type: 'msg', from: 'out', text: '¡Perfecto! ✅ Preparo tu cotización y canalizo el pedido con el equipo.', t: '9:42' },
      { type: 'msg', from: 'out', kind: 'order', text: '📋 Pedido #1042 registrado · Equipo notificado', t: '9:42' },
      { type: 'pause' }
    ];
    var timers = [];
    var typingEl = null;

    function bubble(m) {
      var out = m.from === 'out';
      var isOrder = m.kind === 'order';
      var cls = 'wa__bubble ' + (isOrder ? 'wa__bubble--order' : out ? 'wa__bubble--out' : 'wa__bubble--in');
      return h('div', { class: 'wa__row ' + (out ? 'wa__row--out' : 'wa__row--in') },
        h('div', { class: cls }, m.text,
          h('div', { class: 'wa__time' }, (m.t || '') + (out ? '  ✓✓' : ''))
        )
      );
    }
    function showTyping() {
      typingEl = h('div', { class: 'wa__row wa__row--in' },
        h('div', { class: 'wa__typing' }, h('span'), h('span'), h('span')));
      feed.appendChild(typingEl);
    }
    function hideTyping() { if (typingEl) { typingEl.remove(); typingEl = null; } }

    function play(i) {
      if (i >= script.length) {
        timers.push(setTimeout(function () { feed.innerHTML = ''; play(0); }, 280));
        return;
      }
      var step = script[i];
      if (step.type === 'typing') {
        showTyping();
        timers.push(setTimeout(function () { hideTyping(); play(i + 1); }, 1200));
      } else if (step.type === 'pause') {
        timers.push(setTimeout(function () { play(i + 1); }, 2600));
      } else {
        feed.appendChild(bubble(step));
        timers.push(setTimeout(function () { play(i + 1); }, 1150));
      }
    }
    if (prefersReduced) {
      // show the full conversation statically
      script.forEach(function (s) { if (s.type === 'msg') feed.appendChild(bubble(s)); });
    } else {
      play(0);
    }
  })();

  /* =====================================================
     ERP INTERACTIVE DEMO
     ===================================================== */
  (function () {
    var mount = document.getElementById('erp');
    if (!mount) return;

    var A = '#16A6E8';
    var C = {
      green: { bg: '#E4F7EC', fg: '#1B9C5B' }, amber: { bg: '#FEF3DD', fg: '#C98A12' },
      red: { bg: '#FBE6E6', fg: '#D14343' }, blue: { bg: '#E4F2FB', fg: A }, gray: { bg: '#EEF2F6', fg: '#5A6B7B' }
    };
    var modules = [
      { key: 'dashboard', label: 'Dashboard', icon: '▦' },
      { key: 'ventas', label: 'Ventas', icon: '🛒' },
      { key: 'inventario', label: 'Inventario', icon: '📦' },
      { key: 'productos', label: 'Productos', icon: '🏷️' },
      { key: 'reportes', label: 'Reportes', icon: '📈' },
      { key: 'caja', label: 'Caja', icon: '💵' },
      { key: 'facturacion', label: 'Facturación', icon: '🧾' },
      { key: 'usuarios', label: 'Usuarios', icon: '👥' }
    ];
    var state = { view: 'dashboard', cur: 'USD', auto: true };
    var autoInt, resumeTo;

    function fmt(usd) {
      if (state.cur === 'Bs') return 'Bs ' + (usd * 40.5).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return '$' + usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    function usd(n) { return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
    function bs(n) { return 'Bs ' + (n * 40.5).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

    function badge(t, c) { return h('span', { class: 'erp-badge', style: 'color:' + c.fg + ';background:' + c.bg }, t); }
    function card(children, extra) { return h('div', { class: 'erp-card' + (extra ? ' ' + extra : '') }, children); }
    function stat(label, val, sub, sc) {
      return card([
        h('div', { class: 'lbl' }, label),
        h('div', { class: 'val' }, val),
        sub ? h('div', { class: 'sub', style: 'color:' + (sc || '#1B9C5B') }, sub) : null
      ], 'erp-stat');
    }
    function bars(vals, labels, peak, tall, mul) {
      return h('div', { class: 'erp-bars' + (tall ? ' erp-bars--tall' : '') },
        vals.map(function (v, i) {
          return h('div', { class: 'erp-bar-col' },
            h('div', { class: 'erp-bar' + (i === peak ? ' is-peak' : ''), style: 'height:' + (v * mul) + 'px' }),
            h('div', { class: 'erp-bar-d' }, labels[i]));
        }));
    }
    function progRow(name, pct, color, last) {
      return h('div', { class: 'erp-prog-row' },
        h('div', { class: 'erp-prog-head' }, h('span', null, name), h('span', { class: 'pct' }, pct + '%')),
        h('div', { class: 'erp-prog' }, h('i', { style: 'width:' + pct + '%;background:' + color })));
    }
    function table(cols, rows) {
      var tmpl = cols.map(function (c) { return c.w; }).join(' ');
      var head = h('div', { class: 'erp-thead', style: 'grid-template-columns:' + tmpl },
        cols.map(function (c) { return h('div', { class: 'erp-th' + (c.a === 'right' ? ' erp-a-right' : c.a === 'center' ? ' erp-a-center' : '') }, c.t); }));
      var body = rows.map(function (r) {
        return h('div', { class: 'erp-trow', style: 'grid-template-columns:' + tmpl },
          r.map(function (cell, ci) {
            var cls = 'erp-td' + (ci === 0 ? ' k' : '') + (cols[ci].a === 'right' ? ' erp-a-right' : cols[ci].a === 'center' ? ' erp-a-center' : '');
            return h('div', { class: cls }, cell);
          }));
      });
      return h('div', { class: 'erp-table-wrap' }, h('div', { class: 'erp-table' }, head, body));
    }

    function body() {
      var v = state.view, f = fmt;
      if (v === 'dashboard') {
        var vals = [54, 72, 48, 82, 63, 90, 68], days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
        var tops = [['Uniforme quirúrgico azul', 100], ['Bata clínica blanca', 79], ['Estetoscopio doble', 52], ['Guantes nitrilo', 41]];
        return h('div', { class: 'erp-grid' },
          h('div', { class: 'erp-stats' },
            stat('Ventas de hoy', f(4820), '▲ 12% vs ayer'),
            stat('Pedidos', '37', '▲ 5 nuevos'),
            stat('Ticket promedio', f(130.27), '▲ 3%'),
            stat('Stock crítico', '8', 'requiere atención', '#D14343')),
          h('div', { class: 'erp-row-16' },
            card([h('div', { class: 'erp-ctitle' }, 'Ventas últimos 7 días'), bars(vals, days, 5, false, 0.92)]),
            card([h('div', { class: 'erp-ctitle' }, 'Más vendidos'),
              tops.map(function (p) { return progRow(p[0], p[1], A); })])));
      }
      if (v === 'ventas') {
        return h('div', null,
          h('div', { class: 'erp-bar-head' },
            h('div', { class: 'erp-ctitle', style: 'margin-bottom:0' }, 'Ventas recientes'),
            h('div', { style: 'display:flex;gap:8px' },
              h('span', { class: 'erp-btn-ghost' }, 'Filtrar'),
              h('span', { class: 'erp-btn-solid' }, '+ Nueva venta'))),
          table(
            [{ t: 'Factura', w: '1fr' }, { t: 'Cliente', w: '1.7fr' }, { t: 'Items', w: '0.7fr', a: 'center' }, { t: 'Total', w: '1fr', a: 'right' }, { t: 'Estado', w: '0.9fr', a: 'right' }],
            [
              ['WM-1058', 'Clínica San Rafael', '12', f(1450), badge('Pagado', C.green)],
              ['WM-1057', 'Dr. Pérez · consultorio', '3', f(210.5), badge('Pagado', C.green)],
              ['WM-1056', 'Hospital Centro Médico', '40', f(5200), badge('Pendiente', C.amber)],
              ['WM-1055', 'Farmacia Vida', '8', f(640), badge('Pagado', C.green)],
              ['WM-1054', 'Clínica Luz', '5', f(380), badge('Anulada', C.red)],
              ['WM-1053', 'Uniformes Ya C.A.', '20', f(1800), badge('Pagado', C.green)]
            ]));
      }
      if (v === 'inventario') {
        var inv = [['Uniforme quirúrgico azul', 'Uniformes', 124, C.green, 'OK', 100], ['Bata clínica blanca', 'Uniformes', 18, C.amber, 'Bajo', 26], ['Guantes nitrilo (caja)', 'Insumos', 6, C.red, 'Crítico', 8], ['Estetoscopio doble', 'Equipos', 42, C.green, 'OK', 60], ['Tensiómetro digital', 'Equipos', 9, C.amber, 'Bajo', 14], ['Mascarilla N95 (caja)', 'Insumos', 210, C.green, 'OK', 100]];
        function stockCell(qty, c, pct) {
          return h('div', { class: 'erp-stockcell' },
            h('span', { class: 'q' }, qty),
            h('div', { class: 'erp-prog', style: 'flex:1' }, h('i', { style: 'width:' + pct + '%;background:' + c.fg })));
        }
        return table(
          [{ t: 'Producto', w: '1.7fr' }, { t: 'Categoría', w: '1fr' }, { t: 'Stock', w: '1.5fr' }, { t: 'Estado', w: '0.9fr', a: 'right' }],
          inv.map(function (r) { return [r[0], r[1], stockCell(r[2], r[3], r[5]), badge(r[4], r[3])]; }));
      }
      if (v === 'productos') {
        var prods = [['Uniforme quirúrgico azul', 'Uniformes', 24.5, 124], ['Bata clínica blanca', 'Uniformes', 18, 18], ['Estetoscopio doble', 'Equipos', 45, 42], ['Tensiómetro digital', 'Equipos', 60, 9], ['Guantes nitrilo (caja)', 'Insumos', 12, 6], ['Mascarilla N95 (caja)', 'Insumos', 22, 210]];
        return h('div', { class: 'erp-prod' },
          prods.map(function (p) {
            var low = p[3] <= 10;
            return card([
              h('div', { class: 'img' }),
              h('div', { class: 'n' }, p[0]),
              h('div', { class: 'c' }, p[1]),
              h('div', { class: 'r' },
                h('span', { class: 'price' }, f(p[2])),
                h('span', { class: 'uds', style: low ? 'color:#D14343;background:#FBE6E6' : 'color:#5A6B7B;background:#EEF2F6' }, p[3] + ' uds'))
            ], 'erp-prodcard');
          }));
      }
      if (v === 'reportes') {
        var months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'], mv = [58, 64, 52, 70, 80, 92];
        var cats = [['Uniformes', 52, A], ['Equipos médicos', 33, '#0E7CB8'], ['Insumos', 15, '#7FC9ED']];
        return h('div', { class: 'erp-row-15' },
          card([h('div', { class: 'erp-ctitle' }, 'Ingresos mensuales'), bars(mv, months, 5, true, 1.4)]),
          h('div', { class: 'erp-grid' },
            h('div', { class: 'erp-2', style: 'grid-template-columns:1fr 1fr' },
              stat('Ingresos del mes', f(58420), '▲ 18%'),
              stat('Margen bruto', '34%', '▲ 2pts')),
            card([h('div', { class: 'erp-ctitle', style: 'margin-bottom:12px' }, 'Ventas por categoría'),
              cats.map(function (c) { return progRow(c[0], c[1], c[2]); })])));
      }
      if (v === 'caja') {
        var movs = [['Venta WM-1058', 'Ingreso', 1450, 1], ['Compra de insumos', 'Egreso', 620, -1], ['Venta WM-1057', 'Ingreso', 210.5, 1], ['Retiro de caja', 'Egreso', 300, -1], ['Venta WM-1056', 'Ingreso', 5200, 1]];
        return h('div', { class: 'erp-grid' },
          h('div', { class: 'erp-2', style: 'grid-template-columns:1fr 1fr' },
            card([h('div', { class: 'lbl' }, 'SALDO EN CAJA · USD'), h('div', { class: 'val' }, usd(12480))], 'erp-stat'),
            card([h('div', { class: 'lbl' }, 'SALDO EN CAJA · BS'), h('div', { class: 'val', style: 'color:' + A }, bs(12480))], 'erp-stat')),
          card([h('div', { class: 'erp-ctitle', style: 'margin-bottom:6px' }, 'Movimientos de hoy'),
            movs.map(function (m) {
              var pos = m[3] > 0;
              return h('div', { class: 'erp-mov' },
                h('div', { class: 'ic', style: pos ? 'background:#E4F7EC;color:#1B9C5B' : 'background:#FBE6E6;color:#D14343' }, pos ? '↓' : '↑'),
                h('div', { class: 'mid' }, h('div', { class: 't' }, m[0]), h('div', { class: 's' }, m[1])),
                h('div', { class: 'amt', style: 'color:' + (pos ? '#1B9C5B' : '#D14343') }, (pos ? '+' : '−') + fmt(m[2])));
            })]));
      }
      if (v === 'facturacion') {
        var inv2 = [['WM-1058', 'Clínica San Rafael', 1450, C.green, 'Pagado'], ['WM-1056', 'Hospital Centro Médico', 5200, C.amber, 'Pendiente'], ['WM-1053', 'Uniformes Ya C.A.', 1800, C.green, 'Pagado'], ['WM-1051', 'Farmacia Vida', 640, C.green, 'Pagado'], ['WM-1049', 'Clínica Luz', 380, C.red, 'Anulada']];
        return h('div', null,
          h('div', { class: 'erp-note' },
            h('span', { style: 'padding:4px 10px;background:#E4F2FB;color:' + A + ';border-radius:20px;font-family:\'JetBrains Mono\',monospace;font-size:11px;font-weight:700' }, 'Tasa BCV · Bs 40,50 / USD'),
            h('span', { style: 'color:#9FB0C0;font-weight:600;font-size:11.5px' }, 'Facturación en doble moneda')),
          table(
            [{ t: 'Factura', w: '1fr' }, { t: 'Cliente', w: '1.7fr' }, { t: 'Monto USD', w: '1.1fr', a: 'right' }, { t: 'Monto Bs', w: '1.3fr', a: 'right' }, { t: 'Estado', w: '0.9fr', a: 'right' }],
            inv2.map(function (r) { return [r[0], r[1], usd(r[2]), bs(r[2]), badge(r[4], r[3])]; })));
      }
      // usuarios
      var us = [['Ezequiel Frías', 'Administrador', 'Hoy, 09:14', C.green, 'Activo'], ['María López', 'Ventas', 'Hoy, 08:50', C.green, 'Activo'], ['Carlos Ruiz', 'Almacén', 'Ayer, 17:32', C.green, 'Activo'], ['Ana Gómez', 'Caja', 'Hoy, 09:02', C.green, 'Activo'], ['Luis Pérez', 'Reportes', 'Hace 3 días', C.gray, 'Inactivo']];
      return table(
        [{ t: 'Usuario', w: '1.4fr' }, { t: 'Rol', w: '1fr' }, { t: 'Último acceso', w: '1.2fr' }, { t: 'Estado', w: '0.8fr', a: 'right' }],
        us.map(function (r) {
          var initials = r[0].split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2);
          return [
            h('div', { class: 'erp-ucell' }, h('div', { class: 'erp-uava' }, initials), h('span', { style: 'font-weight:700' }, r[0])),
            r[1], r[2], badge(r[4], r[3])
          ];
        }));
    }

    function go(key) { state.view = key; state.auto = false; poke(); render(); }
    function setCur(c) { state.cur = c; state.auto = false; poke(); render(); }
    function poke() { clearTimeout(resumeTo); resumeTo = setTimeout(function () { state.auto = true; render(); }, 9000); }

    function render() {
      var view = state.view;
      var pageTitle = (modules.filter(function (m) { return m.key === view; })[0] || {}).label;

      var sidebar = h('div', { class: 'erp__sidebar' },
        h('div', { class: 'erp__brand' },
          h('div', { class: 'erp__brand-logo' }, h('img', { src: 'assets/world-medics-mark.png', alt: '' })),
          h('div', null, h('div', { class: 'erp__brand-name' }, "World Medic's"), h('div', { class: 'erp__brand-tag' }, 'ERP'))),
        h('div', { class: 'erp__nav' },
          modules.map(function (m) {
            return h('button', { class: m.key === view ? 'is-active' : '', onclick: function () { go(m.key); } },
              h('span', { class: 'ico' }, m.icon), h('span', null, m.label));
          })),
        h('div', { class: 'erp__sidefoot' },
          h('div', { class: 'erp__avatar' }, 'EF'),
          h('div', { style: 'min-width:0' }, h('div', { class: 'erp__sidefoot-name' }, 'Ezequiel Frías'), h('div', { class: 'erp__sidefoot-role' }, 'Administrador'))));

      var topbar = h('div', { class: 'erp__topbar' },
        h('div', { class: 'erp__title' }, pageTitle),
        h('div', { class: 'erp__spacer' }),
        h('div', { class: 'erp__search' }, h('span', null, '🔍'), h('span', null, 'Buscar…')),
        h('div', { class: 'erp__cur' },
          h('button', { class: state.cur === 'USD' ? 'is-active' : '', onclick: function () { setCur('USD'); } }, 'USD'),
          h('button', { class: state.cur === 'Bs' ? 'is-active' : '', onclick: function () { setCur('Bs'); } }, 'Bs')),
        h('div', { class: 'erp__userpill' }, 'EF'));

      var paginator = h('div', { class: 'erp__paginator' },
        modules.map(function (m) { return h('i', { class: m.key === view ? 'is-active' : '', onclick: function () { go(m.key); } }); }),
        h('span', { class: 'lab' }, state.auto ? '▶ auto' : '❙❙ pausado'));

      var main = h('div', { class: 'erp__main' },
        topbar,
        h('div', { class: 'erp__content' }, h('div', { class: 'erp__panel', key: view }, body())),
        paginator);

      var chrome = h('div', { class: 'erp__chrome' },
        h('div', { class: 'erp__dots' },
          h('i', { style: 'background:#FF5F57' }), h('i', { style: 'background:#FEBC2E' }), h('i', { style: 'background:#28C840' })),
        h('div', { class: 'erp__url' }, h('span', null, 'erp.worldmedics.com/' + view)));

      mount.innerHTML = '';
      mount.appendChild(chrome);
      mount.appendChild(h('div', { class: 'erp__body' }, sidebar, main));
    }

    render();
    if (!prefersReduced) {
      autoInt = setInterval(function () {
        if (!state.auto) return;
        var keys = modules.map(function (m) { return m.key; });
        var i = keys.indexOf(state.view);
        state.view = keys[(i + 1) % keys.length];
        render();
      }, 3600);
    }
  })();

  /* =====================================================
     CASE CAROUSEL
     ===================================================== */
  (function () {
    var track = document.getElementById('caseTrack');
    var dotsWrap = document.getElementById('caseDots');
    var prev = document.getElementById('casePrev');
    var next = document.getElementById('caseNext');
    if (!track) return;
    var slide = 0, auto = true, total = 2, resumeTo;

    var dots = [];
    for (var i = 0; i < total; i++) {
      (function (idx) {
        var b = document.createElement('button');
        b.setAttribute('aria-label', 'Caso ' + (idx + 1));
        b.addEventListener('click', function () { go(idx); });
        dotsWrap.appendChild(b);
        dots.push(b);
      })(i);
    }

    function render() {
      track.style.transform = 'translateX(-' + (slide * 50) + '%)';
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === slide); });
      // make sure the active slide's reveal elements are visible
      var slides = track.children;
      if (slides[slide]) {
        Array.prototype.forEach.call(slides[slide].querySelectorAll('[data-reveal]'), function (el) { el.classList.add('is-in'); });
      }
    }
    function go(i) { slide = ((i % total) + total) % total; auto = false; clearTimeout(resumeTo); resumeTo = setTimeout(function () { auto = true; }, 12000); render(); }

    if (prev) prev.addEventListener('click', function () { go(slide + 1); });
    if (next) next.addEventListener('click', function () { go(slide + 1); });
    render();
    if (!prefersReduced) {
      setInterval(function () { if (auto) { slide = (slide + 1) % total; render(); } }, 7000);
    }
  })();

  /* =====================================================
     CASE MODAL
     ===================================================== */
  (function () {
    var modal = document.getElementById('casoModal');
    if (!modal) return;
    var casos = [
      {
        name: 'FR Medic Group', sector: 'Uniformes y equipo médico',
        titulo: 'Un chatbot de WhatsApp que atiende y canaliza pedidos',
        desc: 'Construimos un chatbot de IA sobre WhatsApp que atiende a cientos de clientes al mismo tiempo, responde dudas de productos, arma cotizaciones y canaliza cada pedido de uniformes y equipos médicos directo al equipo correcto — las 24 horas, sin que nadie viva pegado al teléfono.',
        resultado: '24/7', resultadoLabel: 'atención automática a cientos de clientes a la vez',
        logo: 'assets/fr-medic-group.jpg', mark: 'assets/fr-medic-group.jpg',
        imgBg: 'linear-gradient(160deg,#15151A,#070709)', imgLabel: 'Chatbot de WhatsApp · FR Medic Group'
      },
      {
        name: "World Medic's", sector: 'Uniformes y equipo médico',
        titulo: 'Un ERP completo a la medida, con doble moneda USD / Bs',
        desc: 'Desarrollamos un ERP integral con módulos de dashboard, ventas, inventario, productos, reportes, caja, usuarios y facturación — con manejo de doble moneda en dólares y bolívares para Venezuela. Toda la operación de uniformes y equipos médicos en un solo sistema.',
        resultado: '8', resultadoLabel: 'módulos integrados en un solo sistema',
        logo: 'assets/world-medics-mark.png', mark: 'assets/world-medics-mark.png',
        imgBg: '#FFFFFF', imgLabel: "ERP a medida · World Medic's"
      }
    ];

    var hero = document.getElementById('modalHero');
    var fields = {
      mark: document.getElementById('modalMark'), name: document.getElementById('modalName'),
      sector: document.getElementById('modalSector'), title: document.getElementById('modalTitle'),
      desc: document.getElementById('modalDesc'), result: document.getElementById('modalResult'),
      resultLabel: document.getElementById('modalResultLabel')
    };

    function open(i) {
      var c = casos[i];
      hero.style.background = c.imgBg;
      hero.innerHTML = '';
      hero.appendChild(h('img', { src: c.logo, alt: c.name }));
      hero.appendChild(h('span', { class: 'modal__hero-label' }, c.imgLabel));
      fields.mark.innerHTML = '';
      fields.mark.appendChild(h('img', { src: c.mark, alt: c.name }));
      fields.name.textContent = c.name;
      fields.sector.textContent = c.sector;
      fields.title.textContent = c.titulo;
      fields.desc.textContent = c.desc;
      fields.result.textContent = c.resultado;
      fields.resultLabel.textContent = c.resultadoLabel;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
    }
    function close() { modal.hidden = true; document.body.style.overflow = ''; }

    Array.prototype.forEach.call(document.querySelectorAll('[data-caso]'), function (btn) {
      btn.addEventListener('click', function () { open(parseInt(btn.getAttribute('data-caso'), 10)); });
    });
    modal.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) close(); });
  })();

  /* =====================================================
     CONTACT FORM
     ===================================================== */
  (function () {
    var form = document.getElementById('ctaForm');
    var done = document.getElementById('ctaDone');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      window.open('https://cal.com/ezequiel-frias-pes36u/diagnostico-de-automatizacion-con-ia', '_blank', 'noopener');
      form.hidden = true;
      if (done) done.hidden = false;
    });
  })();

})();
