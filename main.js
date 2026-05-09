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

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initReveals();
    initNav();
    initFAQ();
    initForm();
  });
})();
