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

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initReveals();
  });
})();
