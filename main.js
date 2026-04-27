/* main.js — Cubo Lab Landing Page
   Stack: GSAP 3 + ScrollTrigger + Lenis smooth scroll
   Animation types per cubo-web skill:
   fade-up | scale-up | rotate-in | stagger-up | clip-reveal | blur-up
*/

document.addEventListener('DOMContentLoaded', () => {

  // ==================== LENIS SMOOTH SCROLL ====================
  const lenis = new Lenis({
    duration: 1.25,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // ==================== SCROLLTRIGGER REGISTER ====================
  gsap.registerPlugin(ScrollTrigger);

  // ==================== NAV BEHAVIOR ====================
  const nav = document.querySelector('.nav');
  let lastScrollY = 0;

  ScrollTrigger.create({
    start: 80,
    onUpdate: self => {
      const current = self.scroll();
      nav.classList.toggle('scrolled', current > 80);

      if (current > lastScrollY && current > 260) {
        nav.classList.add('hidden');
      } else {
        nav.classList.remove('hidden');
      }
      lastScrollY = current;
    },
  });

  // ==================== ANIMATION PRESETS ====================
  const ANIM = {
    'fade-up': (el, extra = {}) =>
      gsap.from(el, { y: 50, opacity: 0, duration: 0.9, ease: 'power3.out', ...extra }),

    'scale-up': (el, extra = {}) =>
      gsap.from(el, { y: 40, scale: 0.85, opacity: 0, duration: 1.0, ease: 'power2.out', ...extra }),

    'rotate-in': (el, extra = {}) =>
      gsap.from(el, { y: 40, rotation: 3, opacity: 0, duration: 0.9, ease: 'power3.out', ...extra }),

    'blur-up': (el, extra = {}) =>
      gsap.from(el, { y: 50, opacity: 0, filter: 'blur(8px)', duration: 1.0, ease: 'power3.out', ...extra }),

    'clip-reveal': (el, extra = {}) =>
      gsap.from(el, { clipPath: 'inset(100% 0 0 0)', opacity: 0, duration: 1.2, ease: 'power4.inOut', ...extra }),

    'stagger-up': (elements, stagger = 0.12, extra = {}) =>
      gsap.from(elements, { y: 60, opacity: 0, duration: 0.8, ease: 'power3.out', stagger, ...extra }),
  };

  // ==================== SINGLE ELEMENT ANIMATIONS ====================
  document.querySelectorAll('[data-animate]').forEach(el => {
    const type  = el.dataset.animate;
    const delay = parseFloat(el.dataset.delay || 0);
    const fn    = ANIM[type];
    if (!fn) return;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => fn(el, { delay }),
    });
  });

  // ==================== STAGGER CHILDREN ====================
  document.querySelectorAll('[data-animate-children]').forEach(parent => {
    const type    = parent.dataset.animateChildren;
    const stagger = parseFloat(parent.dataset.stagger || 0.12);
    const children = Array.from(parent.children);

    if (type === 'stagger-up') {
      ScrollTrigger.create({
        trigger: parent,
        start: 'top 85%',
        once: true,
        onEnter: () => ANIM['stagger-up'](children, stagger),
      });
      return;
    }

    if (type === 'scale-up') {
      ScrollTrigger.create({
        trigger: parent,
        start: 'top 85%',
        once: true,
        onEnter: () => ANIM['scale-up'](children, { stagger }),
      });
      return;
    }

    if (type === 'rotate-in') {
      ScrollTrigger.create({
        trigger: parent,
        start: 'top 85%',
        once: true,
        onEnter: () => children.forEach((child, i) => {
          ANIM['rotate-in'](child, { delay: i * stagger });
        }),
      });
    }
  });

  // ==================== FAQ ACCORDION ====================
  document.querySelectorAll('.faq__item').forEach(item => {
    const btn    = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all open items
      document.querySelectorAll('.faq__item.open').forEach(open => {
        open.classList.remove('open');
        open.querySelector('.faq__answer').style.maxHeight = '0';
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ==================== CONTACT FORM ====================
  const form        = document.getElementById('contactForm');
  const formWrap    = document.getElementById('formWrap');
  const successMsg  = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('.form__submit');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Enviando…';
      btn.disabled  = true;

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (res.ok) {
          formWrap.style.display  = 'none';
          successMsg.classList.add('visible');
        } else {
          btn.innerHTML = 'Error — intenta de nuevo';
          btn.disabled  = false;
          setTimeout(() => { btn.innerHTML = originalText; btn.disabled = false; }, 3000);
        }
      } catch {
        btn.innerHTML = 'Error — intenta de nuevo';
        btn.disabled  = false;
        setTimeout(() => { btn.innerHTML = originalText; btn.disabled = false; }, 3000);
      }
    });
  }

  // ==================== SMOOTH SCROLL FOR NAV LINKS ====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) lenis.scrollTo(target, { offset: -80 });
    });
  });

});
