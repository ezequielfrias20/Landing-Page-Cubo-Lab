/* ============================================================
   Cubo Labs — Motion system
   Apple / Linear / Stripe-inspired choreography
   ============================================================ */

(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Lenis smooth scroll ---------- */
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  /* ---------- GSAP setup ---------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => ScrollTrigger.update());
    gsap.ticker.lagSmoothing(0);
  }

  const EASE = 'power4.out';   // approximation of cubic-bezier(0.22, 1, 0.36, 1)
  const EASE_INOUT = 'power3.inOut';

  /* ---------- Reveal patterns ---------- */
  function fadeUp(el, delay = 0) {
    gsap.fromTo(el,
      { y: 24, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1.1, ease: EASE, delay,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      }
    );
  }

  function scaleSoft(el, delay = 0) {
    gsap.fromTo(el,
      { scale: 0.96, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 1.2, ease: EASE, delay,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      }
    );
  }

  function revealText(el, delay = 0) {
    if (!el.querySelector('.reveal-text-inner')) {
      const html = el.innerHTML;
      el.innerHTML = `<span class="reveal-text-inner" style="display:block;">${html}</span>`;
    }
    const inner = el.querySelector('.reveal-text-inner');
    gsap.set(el, { overflow: 'hidden' });
    gsap.fromTo(inner,
      { yPercent: 110 },
      {
        yPercent: 0, duration: 1.4, ease: EASE_INOUT, delay,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      }
    );
  }

  function staggerChildren(parent, gap = 0.08, delay = 0) {
    const items = parent.children;
    gsap.fromTo(items,
      { y: 24, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1.1, ease: EASE, stagger: gap, delay,
        scrollTrigger: { trigger: parent, start: 'top 85%', once: true },
      }
    );
  }

  /* ---------- Apply patterns to marked elements ---------- */
  function initReveals() {
    if (reduced) return;
    document.querySelectorAll('.js-fade-up').forEach((el) => fadeUp(el));
    document.querySelectorAll('.js-scale-soft').forEach((el) => scaleSoft(el));
    document.querySelectorAll('.js-reveal').forEach((el) => revealText(el));
    document.querySelectorAll('.js-stagger').forEach((el) => staggerChildren(el, 0.08));
  }

  /* ---------- Nav: hide on scroll-down, show on scroll-up ---------- */
  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    let lastY = window.scrollY;
    let ticking = false;

    function update() {
      const y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 80);
      if (y > 120 && y > lastY) {
        nav.classList.add('is-hidden');
      } else {
        nav.classList.remove('is-hidden');
      }
      lastY = y;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  /* ---------- FAQ smooth height transition ---------- */
  function initFAQ() {
    document.querySelectorAll('.faq__item').forEach((item) => {
      const summary = item.querySelector('summary');
      const answer = item.querySelector('.faq__a');
      if (!summary || !answer) return;

      summary.addEventListener('click', (e) => {
        e.preventDefault();
        if (item.open) {
          gsap.to(answer, {
            height: 0, opacity: 0, duration: 0.5, ease: EASE,
            onComplete: () => { item.open = false; gsap.set(answer, { clearProps: 'all' }); },
          });
        } else {
          item.open = true;
          gsap.set(answer, { height: 'auto', opacity: 1 });
          const h = answer.offsetHeight;
          gsap.fromTo(answer,
            { height: 0, opacity: 0 },
            { height: h, opacity: 1, duration: 0.5, ease: EASE,
              onComplete: () => gsap.set(answer, { clearProps: 'height' }) }
          );
        }
      });
    });
  }

  /* ---------- Form: async submit to Formspree + success state ---------- */
  function initForm() {
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    if (!form || !success) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending…';
      submitBtn.disabled = true;

      try {
        const data = new FormData(form);
        const res = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
        });

        if (res.ok) {
          form.classList.add('is-hidden');
          success.hidden = false;
          gsap.fromTo(success,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.1, ease: EASE }
          );
        } else {
          throw new Error('Network error');
        }
      } catch (err) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        alert('No pudimos enviar el formulario. Intentá nuevamente o escribinos a ezequieljfrias20@gmail.com');
      }
    });
  }

  /* ---------- Hero typewriter (vanilla, looping) ---------- */
  function initTypewriter() {
    const el = document.querySelector('.hero__typewriter');
    if (!el) return;
    const raw = el.dataset.words || '';
    const words = raw.split('|').map((w) => w.trim()).filter(Boolean);
    if (words.length < 2) return;

    if (reduced) return; // honour user preference

    let wordIndex = 0;
    let charIndex = words[0].length; // start fully typed (matches initial HTML)
    let mode = 'pause';
    let lastSwitch = performance.now();

    const TYPE_MS = 70;
    const ERASE_MS = 35;
    const HOLD_MS = 1400;
    const GAP_MS = 220;

    function tick(now) {
      const word = words[wordIndex];

      if (mode === 'typing') {
        if (now - lastSwitch >= TYPE_MS) {
          charIndex++;
          el.textContent = word.slice(0, charIndex);
          lastSwitch = now;
          if (charIndex >= word.length) {
            mode = 'hold';
            lastSwitch = now;
          }
        }
      } else if (mode === 'hold') {
        if (now - lastSwitch >= HOLD_MS) {
          mode = 'erasing';
          lastSwitch = now;
        }
      } else if (mode === 'erasing') {
        if (now - lastSwitch >= ERASE_MS) {
          charIndex--;
          el.textContent = word.slice(0, Math.max(0, charIndex));
          lastSwitch = now;
          if (charIndex <= 0) {
            mode = 'gap';
            lastSwitch = now;
            wordIndex = (wordIndex + 1) % words.length;
          }
        }
      } else if (mode === 'gap') {
        if (now - lastSwitch >= GAP_MS) {
          mode = 'typing';
          charIndex = 0;
          lastSwitch = now;
        }
      } else if (mode === 'pause') {
        if (now - lastSwitch >= HOLD_MS * 2) {
          mode = 'erasing';
          lastSwitch = now;
        }
      }

      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Hero canvas mouse trail (monochrome) ---------- */
  function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    const hero = document.getElementById('hero');
    if (!canvas || !hero) return;

    // Skip on touch devices and reduced motion
    if (reduced) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const CONFIG = {
      friction: 0.5,
      trails: 60,
      size: 50,
      dampening: 0.025,
      tension: 0.99,
    };

    const pos = { x: 0, y: 0 };
    let lines = [];
    let running = false;

    function size() {
      const r = hero.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(r.width * dpr);
      canvas.height = Math.floor(r.height * dpr);
      canvas.style.width = r.width + 'px';
      canvas.style.height = r.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function Node() { this.x = 0; this.y = 0; this.vx = 0; this.vy = 0; }

    function Line(spring) {
      this.spring = spring + 0.1 * Math.random() - 0.05;
      this.friction = CONFIG.friction + 0.01 * Math.random() - 0.005;
      this.nodes = [];
      for (let i = 0; i < CONFIG.size; i++) {
        const n = new Node();
        n.x = pos.x; n.y = pos.y;
        this.nodes.push(n);
      }
    }
    Line.prototype.update = function () {
      let s = this.spring;
      const head = this.nodes[0];
      head.vx += (pos.x - head.x) * s;
      head.vy += (pos.y - head.y) * s;
      let prev;
      for (let i = 0, len = this.nodes.length; i < len; i++) {
        const n = this.nodes[i];
        if (i > 0) {
          prev = this.nodes[i - 1];
          n.vx += (prev.x - n.x) * s;
          n.vy += (prev.y - n.y) * s;
          n.vx += prev.vx * CONFIG.dampening;
          n.vy += prev.vy * CONFIG.dampening;
        }
        n.vx *= this.friction;
        n.vy *= this.friction;
        n.x += n.vx;
        n.y += n.vy;
        s *= CONFIG.tension;
      }
    };
    Line.prototype.draw = function () {
      let x = this.nodes[0].x;
      let y = this.nodes[0].y;
      ctx.beginPath();
      ctx.moveTo(x, y);
      let i;
      for (i = 1; i < this.nodes.length - 2; i++) {
        const a = this.nodes[i];
        const b = this.nodes[i + 1];
        x = (a.x + b.x) * 0.5;
        y = (a.y + b.y) * 0.5;
        ctx.quadraticCurveTo(a.x, a.y, x, y);
      }
      const a = this.nodes[i];
      const b = this.nodes[i + 1];
      ctx.quadraticCurveTo(a.x, a.y, b.x, b.y);
      ctx.stroke();
      ctx.closePath();
    };

    function buildLines() {
      lines = [];
      for (let i = 0; i < CONFIG.trails; i++) {
        lines.push(new Line(0.45 + (i / CONFIG.trails) * 0.025));
      }
    }

    function render() {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(10, 10, 10, 0.04)';
      ctx.lineWidth = 6;
      for (let i = 0; i < CONFIG.trails; i++) {
        lines[i].update();
        lines[i].draw();
      }
      requestAnimationFrame(render);
    }

    function localizePoint(clientX, clientY) {
      const rect = hero.getBoundingClientRect();
      pos.x = clientX - rect.left;
      pos.y = clientY - rect.top;
    }

    function onMove(e) {
      let cx, cy;
      if (e.touches && e.touches[0]) {
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
      } else {
        cx = e.clientX;
        cy = e.clientY;
      }
      localizePoint(cx, cy);
    }

    function onEnter() { running = true; render(); }
    function onLeave() { running = false; }

    size();
    buildLines();
    // Seed pos at center of hero so lines don't snap from (0,0)
    const r0 = hero.getBoundingClientRect();
    pos.x = r0.width / 2;
    pos.y = r0.height / 2;

    hero.addEventListener('mouseenter', onEnter);
    hero.addEventListener('mouseleave', onLeave);
    hero.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('resize', () => { size(); buildLines(); }, { passive: true });
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initReveals();
    initNav();
    initFAQ();
    initForm();
    initTypewriter();
    initHeroCanvas();
  });
})();
