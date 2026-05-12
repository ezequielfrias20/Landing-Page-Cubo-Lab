/* =========================================================
   CUBO LABS — Premium AI Agency Landing
   Interactivity: Lenis smooth scroll, GSAP reveals, counters,
   theme toggle, FAQ, animated demo loops, navbar blur,
   parallax, mouse glow.
   ========================================================= */

(function () {
  'use strict';

  const html = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- THEME TOGGLE ---------- */
  const themeToggle = document.getElementById('themeToggle');
  themeToggle?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* ---------- MOBILE MENU ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const menuClose = document.getElementById('menuClose');
  const mobileMenu = document.getElementById('mobileMenu');

  const openMenu  = () => mobileMenu?.classList.add('open');
  const closeMenu = () => mobileMenu?.classList.remove('open');

  menuToggle?.addEventListener('click', openMenu);
  menuClose?.addEventListener('click', closeMenu);
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* ---------- LENIS SMOOTH SCROLL ---------- */
  let lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  /* ---------- GSAP / SCROLLTRIGGER ---------- */
  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);

    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
    }

    // Reveal-on-scroll batch animation
    if (!reduceMotion) {
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 88%',
        once: true,
        onEnter: (els) => {
          gsap.to(els, {
            y: 0,
            opacity: 1,
            duration: 0.95,
            stagger: 0.08,
            ease: 'power3.out',
            overwrite: 'auto'
          });
        }
      });
    } else {
      gsap.set('[data-reveal]', { opacity: 1, y: 0 });
    }

    /* ---------- ANIMATED COUNTERS ---------- */
    document.querySelectorAll('[data-counter]').forEach((el) => {
      const target = parseFloat(el.dataset.counter);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const obj = { v: 0 };

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            v: target,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = prefix + Math.round(obj.v) + suffix;
            }
          });
        }
      });
    });

    /* ---------- HERO PARALLAX (mouse) ---------- */
    const heroVisual = document.getElementById('heroVisual');
    if (heroVisual && !reduceMotion) {
      const floatCards = heroVisual.querySelectorAll('.float-card, .float-chat');
      window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 24;
        const y = (e.clientY / window.innerHeight - 0.5) * 24;
        floatCards.forEach((card, i) => {
          const factor = (i + 1) * 0.6;
          gsap.to(card, {
            x: x * factor,
            y: y * factor,
            duration: 1.2,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        });
      });
    }

    /* ---------- DEMO 4 — Workflow nodes pulse ---------- */
    if (!reduceMotion) {
      gsap.utils.toArray('.workflow-node').forEach((node, i) => {
        gsap.to(node, {
          boxShadow: '0 0 24px rgba(99,102,241,0.5)',
          duration: 0.7,
          repeat: -1,
          yoyo: true,
          delay: i * 0.5,
          ease: 'sine.inOut'
        });
      });
    }
  } else {
    // GSAP missing fallback
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  /* ---------- NAVBAR SCROLL EFFECT ---------- */
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;
  function onScroll() {
    const y = window.scrollY;
    if (y > 50) navbar?.classList.add('scrolled');
    else navbar?.classList.remove('scrolled');
    lastScroll = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- BENTO MOUSE GLOW (cursor follow) ---------- */
  document.querySelectorAll('.bento-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', mx + '%');
      card.style.setProperty('--my', my + '%');
    });
  });

  /* ---------- DEMO TILT ON HOVER ---------- */
  if (!reduceMotion) {
    document.querySelectorAll('.tilt-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
          `perspective(1200px) rotateX(${-py * 5}deg) rotateY(${px * 5}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* =========================================================
     HERO CHAT LOOP
     ========================================================= */
  const heroChatStream = document.getElementById('chatStream');
  const heroScript = [
    { who: 'user', text: 'Hola, quiero información sobre el servicio.' },
    { who: 'ai-typing' },
    { who: 'ai', text: 'Claro 👋 Te ayudo en menos de 1 minuto. ¿Qué servicio buscás?' },
    { who: 'user', text: 'Necesito automatizar mi WhatsApp.' },
    { who: 'ai-typing' },
    { who: 'ai', text: '¡Excelente! Te agendo una demo de 15 min. ¿Mañana 10am o 16h?' }
  ];

  function buildBubble(item) {
    const wrap = document.createElement('div');
    if (item.who === 'user') {
      wrap.className = 'chat-bubble user';
      wrap.textContent = item.text;
    } else if (item.who === 'ai') {
      wrap.className = 'chat-bubble ai';
      wrap.textContent = item.text;
    } else if (item.who === 'ai-typing') {
      wrap.className = 'chat-bubble ai';
      wrap.style.padding = '0.55rem 0.85rem';
      wrap.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    }
    wrap.style.opacity = '0';
    wrap.style.transform = 'translateY(8px)';
    wrap.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    return wrap;
  }

  async function runChatLoop(container, script, opts = {}) {
    if (!container) return;
    const baseDelay = opts.baseDelay ?? 1100;
    const typingDelay = opts.typingDelay ?? 1000;
    const interLoop = opts.interLoop ?? 2400;
    while (true) {
      container.innerHTML = '';
      for (const item of script) {
        const bubble = buildBubble(item);
        container.appendChild(bubble);
        // animate in
        await wait(50);
        bubble.style.opacity = '1';
        bubble.style.transform = 'translateY(0)';
        if (item.who === 'ai-typing') {
          await wait(typingDelay);
          bubble.remove();
        } else {
          await wait(baseDelay);
        }
      }
      await wait(interLoop);
    }
  }

  function wait(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  runChatLoop(heroChatStream, heroScript);

  /* =========================================================
     DEMO 1 — Sales chat loop
     ========================================================= */
  const demoChatStream = document.getElementById('demoChatStream');
  const demoScript = [
    { who: 'user', text: '¿Cuánto cuesta el plan de automatización?' },
    { who: 'ai-typing' },
    { who: 'ai', text: 'Depende del flujo. Para WhatsApp + CRM va desde $480/mes. ¿Te paso una propuesta?' },
    { who: 'user', text: 'Sí, por favor.' },
    { who: 'ai-typing' },
    { who: 'ai', text: '¡Perfecto! Agendamos 15 min con un especialista. ¿Mañana 11am te sirve?' }
  ];
  runChatLoop(demoChatStream, demoScript, { baseDelay: 1300, typingDelay: 1100, interLoop: 2800 });

  /* =========================================================
     DEMO 2 — WhatsApp loop
     ========================================================= */
  const waMsgs = document.getElementById('waMsgs');
  const waScript = [
    { who: 'in',  text: 'Hola, quería reservar una mesa para 4 personas mañana.' },
    { who: 'out', text: '¡Hola! Tengo disponibilidad a las 20:30 y 21:30. ¿Cuál preferís?' },
    { who: 'in',  text: '21:30 está perfecto.' },
    { who: 'out', text: 'Listo ✅ Reserva confirmada para mañana 21:30.' },
    { who: 'out', text: 'Te enviaré recordatorio 1h antes 🍽️' }
  ];

  function buildWaMsg(item) {
    const m = document.createElement('div');
    m.className = 'wa-msg ' + item.who;
    m.textContent = item.text;
    m.style.opacity = '0';
    m.style.transform = 'translateY(6px)';
    m.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    return m;
  }

  async function runWaLoop() {
    if (!waMsgs) return;
    while (true) {
      waMsgs.innerHTML = '';
      for (const item of waScript) {
        const msg = buildWaMsg(item);
        waMsgs.appendChild(msg);
        await wait(60);
        msg.style.opacity = '1';
        msg.style.transform = 'translateY(0)';
        await wait(1300);
      }
      await wait(2500);
    }
  }
  runWaLoop();

  /* =========================================================
     FAQ smooth accordion
     ========================================================= */
  document.querySelectorAll('details.faq-item').forEach((det) => {
    const summary = det.querySelector('summary');
    const answer  = det.querySelector('.faq-answer');
    if (!summary || !answer) return;

    // Hide initial state
    answer.style.overflow = 'hidden';
    answer.style.maxHeight = '0px';
    answer.style.opacity = '0';
    answer.style.transition = 'max-height 0.5s cubic-bezier(0.2,0.8,0.2,1), opacity 0.4s ease, margin 0.4s ease';
    answer.style.marginTop = '0';

    summary.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = det.hasAttribute('open');
      if (isOpen) {
        // close
        answer.style.maxHeight = answer.scrollHeight + 'px';
        requestAnimationFrame(() => {
          answer.style.maxHeight = '0px';
          answer.style.opacity = '0';
          answer.style.marginTop = '0';
        });
        setTimeout(() => det.removeAttribute('open'), 400);
      } else {
        // open
        det.setAttribute('open', '');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.opacity = '1';
        answer.style.marginTop = '0.85rem';
        // unset max-height after transition for responsive resize
        setTimeout(() => {
          if (det.hasAttribute('open')) answer.style.maxHeight = 'none';
        }, 500);
      }
    });
  });

  /* =========================================================
     ANCHOR LINKS — Lenis smooth scroll
     ========================================================= */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -90, duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* =========================================================
     SUBTLE GRADIENT BLOB DRIFT (background)
     ========================================================= */
  if (window.gsap && !reduceMotion) {
    document.querySelectorAll('.gradient-blob').forEach((blob, i) => {
      gsap.to(blob, {
        x: (i % 2 === 0 ? 60 : -60),
        y: (i % 3 === 0 ? -40 : 40),
        duration: 14 + i * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });
  }
})();

/* Lead capture form */
(function () {
  const form = document.getElementById('lead-form');
  if (!form) return;
  const success = form.querySelector('.lead-form-success');
  const submit = form.querySelector('.lead-form-submit');
  const WEBHOOK_URL = 'https://cubo-projects-n8n.dvnnak.easypanel.host/webhook/dcaea6d0-465e-444e-be6d-7bf80078c211';
  const error = form.querySelector('.lead-form-error');
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const data = {
      companyName: form.company.value.trim(),
      email: form.email.value.trim(),
      employees: parseInt(form.employees.value, 10)
    };
    const originalText = submit.innerHTML;
    submit.disabled = true;
    submit.style.opacity = '0.6';
    submit.innerHTML = 'Enviando...';
    if (error) error.hidden = true;
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Network response was not ok');
      if (success) success.hidden = false;
      form.reset();
    } catch (err) {
      console.error('Error enviando lead:', err);
      if (error) error.hidden = false;
      submit.disabled = false;
      submit.style.opacity = '1';
    } finally {
      submit.innerHTML = originalText;
      if (!submit.disabled) return;
    }
  });
})();
