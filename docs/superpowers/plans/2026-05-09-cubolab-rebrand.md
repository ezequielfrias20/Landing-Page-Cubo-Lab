# Cubo Labs Rebrand — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the Cubo Labs landing page from a dark/yellow conversion-focused site to a monochromatic editorial luxury venture studio site, with Apple/Linear/Stripe-style motion.

**Architecture:** Single static page (HTML + CSS + GSAP/Lenis JS, no build step). Three files rewritten: `index.html`, `styles.css`, `main.js`. Light off-white theme with one inverted dark section. Fraunces (serif) + Inter Tight (sans) typography. Swiss grid layout with hairline rules.

**Tech Stack:** HTML5, CSS3 (custom properties), GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.13, Google Fonts (Fraunces + Inter Tight). Served via `python3 -m http.server 8080`.

**Reference spec:** [docs/superpowers/specs/2026-05-09-cubolab-rebrand-design.md](../specs/2026-05-09-cubolab-rebrand-design.md)

**Note on testing:** This is a static frontend project with no test framework. "Verification" steps mean: serve locally, open the URL in a browser, check the listed visual criteria. Each task ends with a commit.

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `styles.css` | Rewrite | Design tokens, typography, layout, components, all section styles. |
| `index.html` | Rewrite | Semantic markup for 7 new sections + nav + footer. |
| `main.js` | Rewrite | Lenis smooth scroll + GSAP motion patterns + ScrollTrigger choreography + micro-interactions + reduced-motion guard. |
| `assets/branding.png` | Unchanged | Used in nav + Foundation Cube + footer. |
| `perfil.PNG` | Unchanged | Used in The Engineer section, styled via CSS filter. |

---

## Pre-flight

- [ ] **Step 0: Verify local server works**

Run from project root:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080` — current dark site should load. Stop server (`Ctrl+C`) before editing. Re-launch as needed during implementation.

---

## Task 1: Foundation CSS — wipe and rebuild

**Files:**
- Rewrite: `styles.css`

- [ ] **Step 1: Replace `styles.css` entirely with the new foundation**

Replace ALL contents of `styles.css` with:

```css
/* ============================================================
   Cubo Labs — Foundation
   ============================================================ */

@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=Inter+Tight:wght@400;500;600&display=swap');

/* ---------- Tokens ---------- */
:root {
  --bg: #FAFAF7;
  --surface: #F2F1EC;
  --ink: #0A0A0A;
  --ink-soft: #1A1A1A;
  --muted: #6B6B6B;
  --rule: #D9D7CF;
  --inverse-bg: #0A0A0A;
  --inverse-ink: #FAFAF7;
  --inverse-muted: #888888;

  --serif: 'Fraunces', 'Times New Roman', serif;
  --sans: 'Inter Tight', system-ui, -apple-system, sans-serif;

  --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);

  --container: 1280px;
  --pad-x: clamp(1.5rem, 5vw, 4rem);
  --section-y: clamp(6rem, 12vw, 10rem);
}

/* ---------- Reset ---------- */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: auto; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
body {
  font-family: var(--sans);
  background: var(--bg);
  color: var(--ink);
  font-size: 1.0625rem;
  line-height: 1.6;
  font-weight: 400;
  overflow-x: hidden;
}
img, svg { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }
input, textarea { font: inherit; color: inherit; }
ul { list-style: none; }
hr { border: 0; border-top: 1px solid var(--rule); }

/* ---------- Typography ---------- */
h1, h2, h3 { font-family: var(--serif); font-weight: 500; line-height: 1.08; letter-spacing: -0.02em; }
h1 { font-size: clamp(2.75rem, 7vw, 6rem); }
h2 { font-size: clamp(2rem, 4vw, 3.5rem); }
h3 { font-size: clamp(1.25rem, 2vw, 1.5rem); font-weight: 500; letter-spacing: -0.01em; line-height: 1.2; }
p { color: var(--ink); }
em { font-style: italic; }

/* ---------- Layout ---------- */
.container { width: 100%; max-width: var(--container); margin: 0 auto; padding-inline: var(--pad-x); }
section { padding-block: var(--section-y); }

/* ---------- Eyebrow ---------- */
.eyebrow {
  display: inline-flex; align-items: baseline; gap: 0.6rem;
  font-family: var(--sans); font-size: 0.75rem; font-weight: 500;
  text-transform: uppercase; letter-spacing: 0.16em;
  color: var(--muted);
}
.eyebrow .num { font-family: var(--serif); font-style: italic; font-weight: 400; letter-spacing: 0; text-transform: none; font-size: 0.95rem; color: var(--muted); }

/* ---------- Buttons ---------- */
.btn {
  display: inline-flex; align-items: center; gap: 0.6rem;
  font-family: var(--sans); font-size: 0.9375rem; font-weight: 500; letter-spacing: 0.01em;
  padding: 0.875rem 1.75rem;
  border-radius: 2px;
  transition: background 0.4s var(--ease-out-quint), color 0.4s var(--ease-out-quint), border-color 0.4s var(--ease-out-quint);
}
.btn .arrow { display: inline-block; transition: transform 0.4s var(--ease-out-quint); }
.btn:hover .arrow { transform: translateX(4px); }
.btn-primary { background: var(--ink); color: var(--bg); }
.btn-primary:hover { background: var(--ink-soft); }
.btn-outline { background: transparent; color: var(--ink); border: 1px solid var(--ink); }
.btn-outline:hover { background: var(--ink); color: var(--bg); }

/* Inverse variants for dark section */
.is-inverse .btn-primary { background: var(--inverse-ink); color: var(--inverse-bg); }
.is-inverse .btn-primary:hover { background: #E8E6DF; }

/* ---------- Hairline rule ---------- */
.rule { border: 0; border-top: 1px solid var(--rule); margin: 0; }
.is-inverse .rule { border-top-color: rgba(255,255,255,0.15); }

/* ---------- Inline link ---------- */
.link {
  position: relative; display: inline-block; padding-bottom: 2px;
  background-image: linear-gradient(currentColor, currentColor);
  background-size: 0% 1px; background-repeat: no-repeat; background-position: 0 100%;
  transition: background-size 0.5s var(--ease-in-out-quart);
}
.link:hover { background-size: 100% 1px; }

/* ---------- Reduced motion ---------- */
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
```

- [ ] **Step 2: Verify CSS loads without syntax errors**

Run:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`. The current page will look broken (existing HTML still uses old classes), but verify in DevTools console that there are no CSS parse errors and that `--bg` resolves to `#FAFAF7` on `:root`.

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "refactor(styles): rebuild foundation with monochrome design tokens

Replace dark-theme tokens, Playfair/Sora fonts, and yellow accent with
light off-white system using Fraunces + Inter Tight, hairline rules,
and Apple/Linear-style easing curves. HTML still references old
classes; subsequent tasks replace section markup.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 2: Nav + Hero

**Files:**
- Modify: `index.html` (replace `<head>` font links + `<nav>` + `#hero` section)
- Append: `styles.css` (nav + hero styles + hero load keyframes)

- [ ] **Step 1: Replace fonts in `index.html` `<head>`**

Find the `<link rel="preconnect">` and `<link href="https://fonts.googleapis.com/css2?...">` block (currently loading Playfair + Sora) and replace with:

```html
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=Inter+Tight:wght@400;500;600&display=swap" rel="stylesheet" />
```

Also update the `<title>` and `<meta name="description">`:

```html
  <title>Cubo Labs — Independent venture studio for engineered AI systems</title>
  <meta name="description" content="Cubo Labs designs engineered AI systems for companies that refuse to scale by working harder. Apply for a Foundation session." />
```

And update Open Graph:

```html
  <meta property="og:title"       content="Cubo Labs — Independent venture studio" />
  <meta property="og:description" content="Engineered AI systems for companies that refuse to scale by working harder." />
  <meta property="og:type"        content="website" />
```

- [ ] **Step 2: Replace `<nav>` block in `index.html`**

Find the existing `<nav class="nav">...</nav>` block (lines ~38-52) and replace with:

```html
  <!-- ==================== NAV ==================== -->
  <header class="nav" id="nav" aria-label="Navegación principal">
    <div class="container nav__inner">
      <a class="nav__brand" href="#" aria-label="Cubo Labs inicio">
        <img src="assets/branding.png" alt="" class="nav__logo" />
        <span class="nav__wordmark">cubo labs.</span>
      </a>
      <a class="nav__cta link" href="#apply">Apply</a>
    </div>
  </header>
```

- [ ] **Step 3: Replace `<section id="hero">` in `index.html`**

Find the existing `<section id="hero">...</section>` block (lines ~55-106) and replace with:

```html
  <!-- ==================== HERO ==================== -->
  <section id="hero" class="hero" aria-label="Hero">
    <div class="container hero__inner">
      <span class="eyebrow hero__eyebrow"><span class="num">—</span> Cubo Labs · Independent venture studio</span>

      <h1 class="hero__title">
        <span class="reveal-line"><span>Sistemas de ingeniería</span></span>
        <span class="reveal-line"><span>para empresas que se niegan</span></span>
        <span class="reveal-line"><span>a crecer <em>trabajando más.</em></span></span>
      </h1>

      <p class="hero__sub">Diseñamos arquitecturas de IA, automatización y software a medida — sin herramientas innecesarias, sin promesas vacías.</p>

      <div class="hero__actions">
        <a href="#apply" class="btn btn-primary">
          Apply for a Foundation session
          <span class="arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </section>
```

- [ ] **Step 4: Append nav + hero styles to `styles.css`**

Add to the end of `styles.css`:

```css
/* ============================================================
   Nav
   ============================================================ */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 50;
  padding-block: 1.25rem;
  transition: background 0.5s var(--ease-in-out-quart), backdrop-filter 0.5s var(--ease-in-out-quart), transform 0.5s var(--ease-in-out-quart), border-color 0.5s var(--ease-in-out-quart);
  border-bottom: 1px solid transparent;
}
.nav.is-scrolled {
  background: rgba(250, 250, 247, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom-color: var(--rule);
}
.nav.is-hidden { transform: translateY(-100%); }
.nav__inner { display: flex; align-items: center; justify-content: space-between; gap: 2rem; }
.nav__brand { display: inline-flex; align-items: center; gap: 0.625rem; }
.nav__logo { width: 28px; height: 28px; object-fit: contain; }
.nav__wordmark { font-family: var(--sans); font-weight: 600; font-size: 0.95rem; letter-spacing: -0.01em; color: var(--ink); }
.nav__cta { font-family: var(--sans); font-weight: 500; font-size: 0.9375rem; color: var(--ink); }

/* ============================================================
   Hero
   ============================================================ */
.hero { min-height: 100vh; display: flex; align-items: center; padding-block: clamp(8rem, 14vw, 12rem); }
.hero__inner { display: flex; flex-direction: column; gap: 2rem; max-width: 1100px; }
.hero__eyebrow { opacity: 0; transform: translateY(16px); animation: heroFadeUp 1.1s var(--ease-out-quint) 0.1s forwards; }
.hero__title { font-weight: 500; font-size: clamp(2.5rem, 7vw, 5.75rem); }
.hero__title em { font-style: italic; font-weight: 400; }
.reveal-line { display: block; overflow: hidden; }
.reveal-line > span { display: block; transform: translateY(110%); }
.hero__title .reveal-line:nth-child(1) > span { animation: heroLine 1.4s var(--ease-in-out-quart) 0.3s forwards; }
.hero__title .reveal-line:nth-child(2) > span { animation: heroLine 1.4s var(--ease-in-out-quart) 0.45s forwards; }
.hero__title .reveal-line:nth-child(3) > span { animation: heroLine 1.4s var(--ease-in-out-quart) 0.6s forwards; }
.hero__sub { max-width: 640px; color: var(--muted); font-size: 1.125rem; opacity: 0; transform: translateY(16px); animation: heroFadeUp 1.1s var(--ease-out-quint) 0.95s forwards; }
.hero__actions { opacity: 0; transform: translateY(16px); animation: heroFadeUp 1.1s var(--ease-out-quint) 1.15s forwards; }

@keyframes heroFadeUp {
  to { opacity: 1; transform: translateY(0); }
}
@keyframes heroLine {
  to { transform: translateY(0); }
}
```

- [ ] **Step 5: Verify visually**

Run `python3 -m http.server 8080` and open `http://localhost:8080`. Verify:
- Hero takes full viewport, off-white background.
- Headline appears in Fraunces serif on 3 lines, with each line revealing from below in sequence on load.
- Eyebrow `— Cubo Labs · Independent venture studio` visible above headline in small uppercase muted Inter Tight.
- Single dark CTA button "Apply for a Foundation session →" below subtitle.
- Nav fixed at top with logo + wordmark on left, "Apply" link on right.
- Below hero, the OLD remaining sections will look broken (still using old classes). That's expected — next tasks replace them.

- [ ] **Step 6: Commit**

```bash
git add index.html styles.css
git commit -m "feat(hero): rewrite nav and hero with editorial monochrome style

Add Fraunces + Inter Tight font loading, semantic header with logo
wordmark, and hero with line-by-line reveal-text load animation. CSS
keyframes drive hero load (no ScrollTrigger per cubo-web anti-pattern).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 3: Manifesto / Filosofía section

**Files:**
- Modify: `index.html` (replace `#problema` + `#solucion` with single `#filosofia`)
- Append: `styles.css`

- [ ] **Step 1: Replace `#problema` and `#solucion` sections in `index.html`**

Find the existing `<section id="problema">...</section>` and `<section id="solucion">...</section>` blocks (lines ~108-183) and replace BOTH with this single section:

```html
  <!-- ==================== FILOSOFÍA ==================== -->
  <section id="filosofia" class="filosofia" aria-label="Filosofía">
    <div class="container filosofia__inner">

      <header class="filosofia__head">
        <span class="eyebrow"><span class="num">— 01</span> Manifesto</span>
        <h2 class="filosofia__title js-reveal">Menos herramientas.<br /><em>Más ingeniería.</em></h2>
      </header>

      <div class="filosofia__grid">
        <div class="filosofia__body js-fade-up">
          <p>La mayoría de los problemas de negocio no se resuelven con más software. Se resuelven con sistemas pensados para durar — donde cada decisión técnica responde a una intención clara.</p>
          <p>No vendemos herramientas, ni implementamos modas. Construimos arquitecturas digitales que se sostienen solas, que escalan sin sumar fricción y que generan resultados medibles.</p>
          <p>Si tu empresa todavía depende del esfuerzo, todavía no tiene un sistema.</p>
        </div>

        <ol class="filosofia__principles js-stagger">
          <li>
            <span class="num">01</span>
            <h3>Diseñar antes que implementar</h3>
            <p>Toda solución empieza con una arquitectura clara — no con un stack favorito.</p>
          </li>
          <li>
            <span class="num">02</span>
            <h3>Sistemas, no parches</h3>
            <p>Si no se sostiene sin nosotros, no es un sistema.</p>
          </li>
          <li>
            <span class="num">03</span>
            <h3>Medir el impacto, no el output</h3>
            <p>Lo que importa no es cuánto se entrega, sino cuánto cambia el negocio.</p>
          </li>
        </ol>
      </div>

    </div>
  </section>
```

- [ ] **Step 2: Append filosofia styles to `styles.css`**

Add to the end of `styles.css`:

```css
/* ============================================================
   Filosofía
   ============================================================ */
.filosofia__head { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.5rem; margin-bottom: clamp(3rem, 6vw, 5rem); }
.filosofia__title { max-width: 18ch; }
.filosofia__title em { font-style: italic; font-weight: 400; }

.filosofia__grid { display: grid; grid-template-columns: 1fr; gap: clamp(2.5rem, 5vw, 4rem); }
@media (min-width: 1024px) {
  .filosofia__grid { grid-template-columns: 1.1fr 1fr; gap: clamp(3rem, 6vw, 6rem); }
}
.filosofia__body p { color: var(--ink); font-size: 1.0625rem; line-height: 1.7; max-width: 52ch; }
.filosofia__body p + p { margin-top: 1.25rem; }

.filosofia__principles { display: flex; flex-direction: column; gap: 0; }
.filosofia__principles > li { display: grid; grid-template-columns: auto 1fr; column-gap: 1.5rem; row-gap: 0.5rem; padding-block: 1.5rem; border-top: 1px solid var(--rule); }
.filosofia__principles > li:last-child { border-bottom: 1px solid var(--rule); }
.filosofia__principles .num { font-family: var(--serif); font-style: italic; font-weight: 400; font-size: 1.1rem; color: var(--muted); padding-top: 0.4rem; min-width: 2.4ch; }
.filosofia__principles h3 { grid-column: 2; font-family: var(--sans); font-weight: 600; font-size: 1.0625rem; letter-spacing: -0.005em; }
.filosofia__principles p { grid-column: 2; color: var(--muted); font-size: 0.95rem; line-height: 1.55; }
```

- [ ] **Step 3: Verify visually**

Reload `http://localhost:8080`. Scroll past hero. Verify:
- New section "Manifesto" appears with eyebrow `— 01 Manifesto`, h2 "Menos herramientas. Más ingeniería." (italic on second line).
- Two-column layout (≥1024px): left has 3 paragraphs of body copy; right has numbered list `01/02/03` with hairline dividers.
- On mobile (<1024px), columns stack.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat(filosofia): merge problema+solucion into single manifesto section

Replace two old sections with a swiss-grid editorial manifesto: serif
headline + 2-column body (philosophy text left, numbered principles
right with hairline rules).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 4: Capabilities section

**Files:**
- Modify: `index.html` (replace `#servicios`)
- Append: `styles.css`

- [ ] **Step 1: Replace `#servicios` section in `index.html`**

Find the existing `<section id="servicios">...</section>` block (lines ~263-324) and replace with:

```html
  <!-- ==================== CAPABILITIES ==================== -->
  <section id="capacidades" class="caps" aria-label="Capabilities">
    <div class="container caps__inner">

      <header class="caps__head">
        <span class="eyebrow"><span class="num">— 02</span> Capabilities</span>
        <h2 class="caps__title js-reveal">Diseñamos sistemas,<br /><em>no soluciones aisladas.</em></h2>
      </header>

      <ol class="caps__list js-stagger">
        <li class="caps__row">
          <span class="caps__num">01</span>
          <h3 class="caps__name">Inteligencia Artificial Aplicada</h3>
          <p class="caps__desc">Agentes, decisiones automatizadas y modelos integrados en tu operación diaria.</p>
        </li>
        <li class="caps__row">
          <span class="caps__num">02</span>
          <h3 class="caps__name">Automatización de Procesos</h3>
          <p class="caps__desc">Eliminamos trabajo manual repetitivo y reducimos errores operativos.</p>
        </li>
        <li class="caps__row">
          <span class="caps__num">03</span>
          <h3 class="caps__name">Software a Medida</h3>
          <p class="caps__desc">Plataformas internas y aplicaciones construidas para tu operación específica.</p>
        </li>
        <li class="caps__row">
          <span class="caps__num">04</span>
          <h3 class="caps__name">CRM y ERP Inteligentes</h3>
          <p class="caps__desc">Centralizamos datos para decisiones en tiempo real, no para llenar dashboards.</p>
        </li>
        <li class="caps__row">
          <span class="caps__num">05</span>
          <h3 class="caps__name">Estrategia Digital</h3>
          <p class="caps__desc">Tecnología alineada con objetivos de negocio, con métricas claras de retorno.</p>
        </li>
        <li class="caps__row">
          <span class="caps__num">06</span>
          <h3 class="caps__name">Landing Pages de Alto Rendimiento</h3>
          <p class="caps__desc">Diseñadas para convertir visitantes en clientes, no solo para verse bien.</p>
        </li>
        <li class="caps__row">
          <span class="caps__num">07</span>
          <h3 class="caps__name">Consultoría Empresarial</h3>
          <p class="caps__desc">Diagnóstico y arquitectura — antes de tocar una sola línea de código.</p>
        </li>
        <li class="caps__row">
          <span class="caps__num">08</span>
          <h3 class="caps__name">Mantenimiento y Evolución</h3>
          <p class="caps__desc">Tu sistema no se queda estático: evoluciona junto con tu negocio.</p>
        </li>
      </ol>

    </div>
  </section>
```

- [ ] **Step 2: Append capabilities styles to `styles.css`**

Add to the end of `styles.css`:

```css
/* ============================================================
   Capabilities
   ============================================================ */
.caps__head { display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: clamp(3rem, 6vw, 5rem); }
.caps__title { max-width: 22ch; }
.caps__title em { font-style: italic; font-weight: 400; }

.caps__list { display: flex; flex-direction: column; }
.caps__row {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: clamp(1.5rem, 4vw, 3rem);
  row-gap: 0.4rem;
  padding-block: clamp(1.5rem, 3vw, 2.25rem);
  border-top: 1px solid var(--rule);
  align-items: baseline;
}
.caps__row:last-child { border-bottom: 1px solid var(--rule); }

.caps__num {
  grid-row: 1 / span 2;
  font-family: var(--serif);
  font-style: italic;
  font-weight: 400;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  line-height: 1;
  color: var(--ink);
  letter-spacing: -0.02em;
  align-self: start;
}
.caps__name {
  grid-column: 2;
  font-family: var(--sans);
  font-weight: 600;
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  letter-spacing: -0.01em;
  line-height: 1.2;
}
.caps__desc {
  grid-column: 2;
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.55;
  max-width: 60ch;
}

@media (min-width: 1024px) {
  .caps__row { grid-template-columns: auto minmax(20ch, 1fr) minmax(28ch, 1.4fr); align-items: baseline; }
  .caps__name { grid-column: 2; grid-row: 1; }
  .caps__desc { grid-column: 3; grid-row: 1; }
  .caps__num { grid-row: 1; }
}
```

- [ ] **Step 3: Verify visually**

Reload page. Scroll to capabilities. Verify:
- 8 rows, each with: italic serif number (left), bold sans title (middle), muted description (right) on desktop.
- Hairline rules between every row, plus top and bottom of the list.
- On mobile, description wraps below title, number stays on the left spanning both rows.
- No emojis, no cards, no boxes. Just numbered list.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat(caps): replace services grid with editorial numbered list

8 capabilities laid out as hairline-divided rows: italic serif numbers,
bold sans titles, muted descriptions. Eliminates emoji icons and card
treatment in favor of swiss editorial grid.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 5: The Foundation Cube section

**Files:**
- Modify: `index.html` (replace `#producto`)
- Append: `styles.css`

- [ ] **Step 1: Replace `#producto` section in `index.html`**

Find the existing `<section id="producto">...</section>` block (lines ~185-261) and replace with:

```html
  <!-- ==================== FOUNDATION ==================== -->
  <section id="foundation" class="foundation" aria-label="The Foundation Cube">
    <div class="container foundation__inner">

      <div class="foundation__visual js-scale-soft">
        <img src="assets/branding.png" alt="Cubo Labs" class="foundation__cube" />
      </div>

      <div class="foundation__content">
        <span class="eyebrow"><span class="num">— 03</span> The product</span>
        <h2 class="foundation__title js-reveal">The Foundation Cube.</h2>
        <p class="foundation__lead js-fade-up">Una sesión estratégica de 90 minutos donde diagnosticamos tu negocio y diseñamos la arquitectura de IA, automatización y software que necesitás para escalar — antes de implementar nada.</p>

        <ol class="foundation__deliverables js-stagger">
          <li>
            <span class="num">01</span>
            <span>Auditoría completa de procesos internos.</span>
          </li>
          <li>
            <span class="num">02</span>
            <span>Identificación de las automatizaciones de mayor retorno.</span>
          </li>
          <li>
            <span class="num">03</span>
            <span>Oportunidades de IA aplicadas a tu sector específico.</span>
          </li>
          <li>
            <span class="num">04</span>
            <span>Arquitectura tecnológica recomendada y stack justificado.</span>
          </li>
          <li>
            <span class="num">05</span>
            <span>Roadmap de implementación con prioridades claras.</span>
          </li>
        </ol>

        <p class="foundation__note js-fade-up">By application — limited to 3 sessions per month.</p>

        <a href="#apply" class="btn btn-primary foundation__cta js-fade-up">
          Apply
          <span class="arrow" aria-hidden="true">→</span>
        </a>
      </div>

    </div>
  </section>
```

- [ ] **Step 2: Append foundation styles to `styles.css`**

Add to the end of `styles.css`:

```css
/* ============================================================
   Foundation Cube
   ============================================================ */
.foundation__inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(3rem, 6vw, 5rem);
  align-items: start;
}
@media (min-width: 1024px) {
  .foundation__inner { grid-template-columns: 0.9fr 1.1fr; gap: clamp(4rem, 8vw, 8rem); }
}

.foundation__visual { display: flex; align-items: center; justify-content: center; padding: clamp(2rem, 4vw, 4rem) 0; }
.foundation__cube {
  width: clamp(180px, 24vw, 280px);
  height: auto;
  transition: transform 1s var(--ease-out-quint);
  will-change: transform;
}
@media (min-width: 1024px) {
  .foundation__cube:hover { transform: rotateY(6deg) rotateX(-2deg); }
}

.foundation__content { display: flex; flex-direction: column; gap: 1.5rem; }
.foundation__title { max-width: 14ch; }
.foundation__lead { color: var(--ink); font-size: 1.125rem; line-height: 1.6; max-width: 50ch; }

.foundation__deliverables { display: flex; flex-direction: column; margin-top: 1rem; }
.foundation__deliverables > li {
  display: grid; grid-template-columns: auto 1fr; column-gap: 1.5rem;
  padding-block: 1.1rem; border-top: 1px solid var(--rule);
  font-size: 1rem; color: var(--ink); align-items: baseline;
}
.foundation__deliverables > li:last-child { border-bottom: 1px solid var(--rule); }
.foundation__deliverables .num {
  font-family: var(--serif); font-style: italic; font-weight: 400; font-size: 1.05rem; color: var(--muted);
  min-width: 2.4ch;
}

.foundation__note { color: var(--muted); font-size: 0.9rem; letter-spacing: 0.01em; margin-top: 0.5rem; }
.foundation__cta { align-self: flex-start; margin-top: 0.5rem; }
```

- [ ] **Step 3: Verify visually**

Reload page. Scroll to Foundation. Verify:
- Two-column (≥1024px) layout: cube logo on left at ~280px wide, content on right.
- Eyebrow `— 03 The product`, h2 "The Foundation Cube.", lead paragraph below.
- 5 numbered deliverables with hairline dividers, italic serif numbers.
- Small muted note "By application — limited to 3 sessions per month." 
- Primary "Apply →" button at bottom of right column.
- On desktop hover, cube rotates subtly (rotateY 6deg).

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat(foundation): rebuild product section as editorial signature block

Replace dual-column promo card layout with asymmetric split: cube logo
focal on left, editorial content (title, lead, 5 hairline-divided
deliverables, application note, CTA) on right. Removes price card and
scarcity badges in favor of single 'by application' note.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 6: The Engineer (dark inverse section)

**Files:**
- Modify: `index.html` (replace `#lider` and remove `#resultados`)
- Append: `styles.css`

- [ ] **Step 1: Remove `#resultados` section and replace `#lider` in `index.html`**

Find and DELETE the entire `<section id="resultados">...</section>` block (lines ~370-400). It is being merged into the philosophy.

Find the existing `<section id="lider">...</section>` block (lines ~403-458) and replace with:

```html
  <!-- ==================== ENGINEER (DARK INVERSE) ==================== -->
  <section id="fundador" class="engineer is-inverse" aria-label="The Engineer">
    <div class="container engineer__inner">

      <div class="engineer__photo js-scale-soft">
        <img src="perfil.PNG" alt="Ezequiel Frías — Founder & Engineer" />
      </div>

      <div class="engineer__content">
        <span class="eyebrow"><span class="num">— 04</span> The Engineer</span>
        <h2 class="engineer__quote js-reveal">"Less tooling.<br /><em>More engineering."</em></h2>

        <div class="engineer__bio js-stagger">
          <p>Diseño arquitecturas tecnológicas que resuelven problemas reales de negocio. No creo en soluciones genéricas ni en implementaciones que parecen modernas pero no generan resultados.</p>
          <p>Cada sistema que construyo está pensado para escalar, adaptarse y generar impacto medible desde el primer mes. No hay magia — hay ingeniería bien aplicada.</p>
          <p>Trabajo directamente con cada cliente para asegurar que la tecnología no solo funcione, sino que transforme su forma de operar.</p>
        </div>

        <div class="engineer__sig js-fade-up">
          <p class="engineer__name">Ezequiel Frías</p>
          <p class="engineer__title">Founder & Engineer · Telecom Engineer · AI Specialist</p>
        </div>
      </div>

    </div>
  </section>
```

- [ ] **Step 2: Append engineer styles to `styles.css`**

Add to the end of `styles.css`:

```css
/* ============================================================
   Engineer (dark inverse)
   ============================================================ */
.engineer.is-inverse {
  background: var(--inverse-bg);
  color: var(--inverse-ink);
}
.engineer.is-inverse h1, .engineer.is-inverse h2, .engineer.is-inverse h3, .engineer.is-inverse p { color: var(--inverse-ink); }
.engineer.is-inverse .eyebrow,
.engineer.is-inverse .eyebrow .num { color: var(--inverse-muted); }

.engineer__inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(2.5rem, 5vw, 4rem);
  align-items: start;
}
@media (min-width: 1024px) {
  .engineer__inner { grid-template-columns: 0.9fr 1.1fr; gap: clamp(4rem, 8vw, 6rem); }
}

.engineer__photo {
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.engineer__photo img {
  width: 100%; height: 100%; object-fit: cover;
  filter: grayscale(1) contrast(1.05) brightness(0.95);
}

.engineer__content { display: flex; flex-direction: column; gap: 1.75rem; }
.engineer__quote { max-width: 14ch; font-weight: 400; }
.engineer__quote em { font-style: italic; font-weight: 400; }
.engineer__bio p { color: rgba(250, 250, 247, 0.85); font-size: 1.0625rem; line-height: 1.7; max-width: 56ch; }
.engineer__bio p + p { margin-top: 1.1rem; }

.engineer__sig { padding-top: 1.5rem; border-top: 1px solid rgba(255, 255, 255, 0.15); }
.engineer__name { font-family: var(--serif); font-weight: 500; font-size: 1.25rem; letter-spacing: -0.01em; }
.engineer__title { color: var(--inverse-muted); font-size: 0.9rem; margin-top: 0.4rem; letter-spacing: 0.005em; }
```

- [ ] **Step 3: Verify visually**

Reload page. Scroll past Foundation. Verify:
- Section flips to a deep black background, off-white text.
- Two columns (≥1024px): grayscale headshot on left in 4:5 aspect with thin border, content on right.
- Eyebrow `— 04 The Engineer`, h2 quote in serif italic.
- Three bio paragraphs, slightly muted text.
- Signature block at bottom with hairline rule above: name in serif, title in muted sans.
- The OLD `#resultados` section should no longer appear in the page flow.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat(engineer): rebuild leader section as single dark inverse block

Replace dark-photo-with-yellow-frame layout with editorial split: B&W
grayscale portrait on left, serif quote + bio + hairline-separated
signature on right. Section is the only inverted dark block in the
page, providing rhythmic break between two light sections. Also
removes the now-redundant resultados section.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 7: FAQ section

**Files:**
- Modify: `index.html` (replace `#faq`)
- Append: `styles.css`

- [ ] **Step 1: Replace `#faq` section in `index.html`**

Find the existing `<section id="faq">...</section>` block (lines ~461-559) and replace with:

```html
  <!-- ==================== FAQ ==================== -->
  <section id="faq" class="faq" aria-label="Preguntas frecuentes">
    <div class="container faq__inner">

      <header class="faq__head">
        <span class="eyebrow"><span class="num">— 05</span> Frequently Asked</span>
        <h2 class="faq__title js-reveal">Preguntas frecuentes.</h2>
      </header>

      <div class="faq__list js-stagger">
        <details class="faq__item">
          <summary>
            <span class="faq__q">¿La sesión Foundation es realmente gratis?</span>
            <span class="faq__plus" aria-hidden="true">+</span>
          </summary>
          <div class="faq__a">Sí. La sesión inicial vale USD 500 y la ofrecemos sin costo a nuevos clientes. Después de 90 minutos juntos queda claro si tiene sentido seguir trabajando — sin venta de por medio.</div>
        </details>

        <details class="faq__item">
          <summary>
            <span class="faq__q">¿Cuánto tarda una implementación completa?</span>
            <span class="faq__plus" aria-hidden="true">+</span>
          </summary>
          <div class="faq__a">Depende del alcance. La mayoría de los sistemas iniciales se implementan entre 2 y 6 semanas. En la sesión Foundation definimos tiempos realistas para tu caso específico.</div>
        </details>

        <details class="faq__item">
          <summary>
            <span class="faq__q">¿Trabajan con empresas pequeñas o solo con grandes?</span>
            <span class="faq__plus" aria-hidden="true">+</span>
          </summary>
          <div class="faq__a">Trabajamos con empresas que quieran crecer con sistemas, sin importar tamaño. Las PYMES suelen ver el mayor impacto porque liberan recursos atrapados en procesos manuales.</div>
        </details>

        <details class="faq__item">
          <summary>
            <span class="faq__q">¿Qué pasa con las herramientas que ya estoy usando?</span>
            <span class="faq__plus" aria-hidden="true">+</span>
          </summary>
          <div class="faq__a">Las integramos, optimizamos o reemplazamos según corresponda. Nunca partimos de cero sin evaluar lo que ya existe.</div>
        </details>

        <details class="faq__item">
          <summary>
            <span class="faq__q">¿Necesito conocimientos técnicos para empezar?</span>
            <span class="faq__plus" aria-hidden="true">+</span>
          </summary>
          <div class="faq__a">Cero. Vos describís los objetivos del negocio; nosotros traducimos eso en sistemas que funcionan. La tecnología es nuestra responsabilidad.</div>
        </details>
      </div>

    </div>
  </section>
```

- [ ] **Step 2: Append FAQ styles to `styles.css`**

Add to the end of `styles.css`:

```css
/* ============================================================
   FAQ
   ============================================================ */
.faq__head { display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: clamp(2.5rem, 5vw, 4rem); }
.faq__title { max-width: 18ch; }

.faq__list { display: flex; flex-direction: column; }
.faq__item { border-top: 1px solid var(--rule); }
.faq__item:last-child { border-bottom: 1px solid var(--rule); }
.faq__item summary {
  list-style: none;
  display: flex; align-items: center; justify-content: space-between; gap: 1.5rem;
  padding-block: clamp(1.25rem, 2.5vw, 1.75rem);
  cursor: pointer;
}
.faq__item summary::-webkit-details-marker { display: none; }
.faq__q {
  font-family: var(--serif); font-weight: 500; font-size: clamp(1.1rem, 2vw, 1.4rem);
  letter-spacing: -0.01em; color: var(--ink); line-height: 1.3;
}
.faq__plus {
  font-family: var(--sans); font-weight: 400; font-size: 1.5rem; line-height: 1; color: var(--muted);
  flex-shrink: 0;
  transition: transform 0.4s var(--ease-out-quint), color 0.4s var(--ease-out-quint);
}
.faq__item[open] .faq__plus { transform: rotate(45deg); color: var(--ink); }
.faq__a {
  color: var(--muted); font-size: 1rem; line-height: 1.65;
  max-width: 60ch;
  padding-block: 0 clamp(1.25rem, 2.5vw, 1.75rem);
}

/* Smooth open/close — animate via grid trick for height auto */
.faq__item:not([open]) .faq__a { display: none; }
```

- [ ] **Step 3: Verify visually**

Reload page. Scroll to FAQ. Verify:
- Eyebrow `— 05 Frequently Asked`, h2 "Preguntas frecuentes."
- 5 questions in `<details>` elements.
- Each question: serif h-style text + `+` indicator on the right, hairline rules above and below each item.
- Click a question → opens to show muted answer; the `+` rotates 45° to look like `×`.
- Click again → closes.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat(faq): replace 6-question accordion with 5-question native details

Use semantic <details> + <summary> with hairline rules and rotating '+'
indicator. Serif questions, muted sans answers. Reduces from 6 to 5
questions, drops first redundant 'is it really free' phrasing.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 8: Apply (form) section

**Files:**
- Modify: `index.html` (replace `#contacto` AND remove `#escasez`)
- Append: `styles.css`

- [ ] **Step 1: Remove `#escasez` section from `index.html`**

Find and DELETE the entire `<section id="escasez">...</section>` block (lines ~562-599). The "by application" framing now lives in the Foundation section.

- [ ] **Step 2: Replace `#contacto` section in `index.html`**

Find the existing `<section id="contacto">...</section>` block (lines ~602-710) and replace with:

```html
  <!-- ==================== APPLY ==================== -->
  <section id="apply" class="apply" aria-label="Apply">
    <div class="container apply__inner">

      <header class="apply__head">
        <span class="eyebrow"><span class="num">— 06</span> Apply</span>
        <h2 class="apply__title js-reveal">Apply for a<br /><em>Foundation session.</em></h2>
        <p class="apply__sub js-fade-up">Completá los campos y te contactamos en menos de 24 horas hábiles.</p>
      </header>

      <form
        id="contactForm"
        class="apply__form js-stagger"
        action="https://formspree.io/f/ENDPOINT"
        method="POST"
        novalidate
      >
        <div class="field">
          <label class="field__label" for="nombre">Nombre</label>
          <input class="field__input" type="text" id="nombre" name="nombre" required />
        </div>

        <div class="field">
          <label class="field__label" for="email">Email</label>
          <input class="field__input" type="email" id="email" name="email" required />
        </div>

        <div class="field">
          <label class="field__label" for="empresa">Empresa <span class="field__hint">(opcional)</span></label>
          <input class="field__input" type="text" id="empresa" name="empresa" />
        </div>

        <div class="field">
          <label class="field__label" for="mensaje">¿Cuál es el principal desafío que querés resolver?</label>
          <textarea class="field__input field__textarea" id="mensaje" name="mensaje" rows="4" required></textarea>
        </div>

        <div class="apply__submit">
          <button type="submit" class="btn btn-primary">
            Submit application
            <span class="arrow" aria-hidden="true">→</span>
          </button>
          <p class="apply__legal">Tu información está segura. Nunca enviamos spam.</p>
        </div>
      </form>

      <div class="apply__success" id="formSuccess" hidden>
        <h3>Recibido.</h3>
        <p>En las próximas 24 horas hábiles te contactamos para coordinar la sesión.</p>
      </div>

    </div>
  </section>
```

- [ ] **Step 3: Append apply styles to `styles.css`**

Add to the end of `styles.css`:

```css
/* ============================================================
   Apply (form)
   ============================================================ */
.apply__inner { display: grid; grid-template-columns: 1fr; gap: clamp(3rem, 6vw, 5rem); max-width: 960px; margin-inline: auto; }
.apply__head { display: flex; flex-direction: column; gap: 1.25rem; }
.apply__title { max-width: 14ch; }
.apply__title em { font-style: italic; font-weight: 400; }
.apply__sub { color: var(--muted); max-width: 50ch; }

.apply__form { display: flex; flex-direction: column; gap: 1.75rem; }

.field { display: flex; flex-direction: column; gap: 0.5rem; }
.field__label {
  font-family: var(--sans); font-size: 0.75rem; font-weight: 500;
  text-transform: uppercase; letter-spacing: 0.16em;
  color: var(--muted);
  transition: color 0.5s var(--ease-in-out-quart);
}
.field__hint { text-transform: none; letter-spacing: 0.04em; font-weight: 400; opacity: 0.7; }
.field__input {
  width: 100%;
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--rule);
  padding: 0.875rem 0;
  font-size: 1.0625rem;
  color: var(--ink);
  font-family: var(--sans);
  border-radius: 0;
  transition: border-color 0.5s var(--ease-in-out-quart);
  outline: none;
}
.field__input:focus { border-bottom-color: var(--ink); }
.field__input:focus ~ .field__label,
.field:focus-within .field__label { color: var(--ink); }
.field__textarea { resize: vertical; min-height: 6rem; line-height: 1.55; }

.apply__submit {
  display: flex; flex-direction: column; gap: 0.875rem;
  padding-top: 1rem;
  align-items: flex-start;
}
.apply__submit .btn { align-self: flex-start; }
.apply__legal { color: var(--muted); font-size: 0.85rem; }

.apply__success { padding: 2.5rem 0; text-align: left; max-width: 50ch; }
.apply__success h3 { font-family: var(--serif); font-weight: 500; font-size: clamp(1.5rem, 3vw, 2rem); margin-bottom: 0.75rem; }
.apply__success p { color: var(--muted); }
.apply__form.is-hidden { display: none; }
```

- [ ] **Step 4: Verify visually**

Reload page. Scroll to apply. Verify:
- Eyebrow `— 06 Apply`, h2 "Apply for a Foundation session." (italic on second line).
- Form with 4 underlined inputs (no boxes, no fills) — Nombre, Email, Empresa (opcional), Mensaje (textarea).
- Labels above inputs in muted uppercase eyebrow style.
- On focus, label turns black and underline turns black, both with smooth easing.
- Submit button "Submit application →" left-aligned, with legal note below.
- The OLD `#escasez` section should no longer exist in the page.

- [ ] **Step 5: Commit**

```bash
git add index.html styles.css
git commit -m "feat(apply): rebuild contact form as minimal underline form

Replace boxed form layout with editorial single-column form: labels in
eyebrow style, inputs as plain border-bottom hairlines that animate to
black on focus. Drops the explicit features list (now redundant with
Foundation section). Also removes escasez section.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 9: Footer

**Files:**
- Modify: `index.html` (replace `<footer>`)
- Append: `styles.css`

- [ ] **Step 1: Replace `<footer>` block in `index.html`**

Find the existing `<footer role="contentinfo">...</footer>` block (lines ~713-727) and replace with:

```html
  <!-- ==================== FOOTER ==================== -->
  <footer class="footer" role="contentinfo">
    <div class="container footer__inner">
      <a class="footer__brand" href="#" aria-label="Cubo Labs inicio">
        <img src="assets/branding.png" alt="" class="footer__logo" />
        <span>cubo labs.</span>
      </a>
      <p class="footer__meta">© 2026 Cubo Labs. All rights reserved.</p>
      <a class="footer__top link" href="#">Back to top ↑</a>
    </div>
  </footer>
```

- [ ] **Step 2: Append footer styles to `styles.css`**

Add to the end of `styles.css`:

```css
/* ============================================================
   Footer
   ============================================================ */
.footer { border-top: 1px solid var(--rule); padding-block: clamp(2rem, 4vw, 3.5rem); }
.footer__inner { display: flex; flex-direction: column; gap: 1.25rem; align-items: flex-start; justify-content: space-between; }
@media (min-width: 768px) {
  .footer__inner { flex-direction: row; align-items: center; }
}
.footer__brand { display: inline-flex; align-items: center; gap: 0.625rem; font-family: var(--sans); font-weight: 600; font-size: 0.95rem; }
.footer__logo { width: 24px; height: 24px; object-fit: contain; }
.footer__meta { color: var(--muted); font-size: 0.875rem; }
.footer__top { color: var(--ink); font-size: 0.9375rem; font-weight: 500; }
```

- [ ] **Step 3: Verify visually**

Reload page. Scroll to bottom. Verify:
- Single-row footer (≥768px): logo + wordmark left, copy meta center, "Back to top ↑" link right.
- Hairline rule above the footer.
- On mobile, items stack vertically aligned to the left.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat(footer): rebuild as single-row hairline footer

Logo, copyright, back-to-top link in one row separated by a top
hairline. Replaces the old 3-line footer.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 10: Motion system — Lenis + GSAP base

**Files:**
- Rewrite: `main.js`

- [ ] **Step 1: Replace `main.js` entirely**

Replace ALL contents of `main.js` with:

```js
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
    // Wrap inner content for clip animation if not already wrapped.
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
```

- [ ] **Step 2: Verify motion works on scroll**

Reload page. Scroll slowly through sections. Verify:
- Smooth scroll feels buttery (Lenis).
- Each section's content animates in once as it enters viewport (~88% from top): headlines clip-reveal vertically, body fades up, lists stagger row by row.
- No section animates twice (`once: true`).
- DevTools console clean of errors.

- [ ] **Step 3: Commit**

```bash
git add main.js
git commit -m "feat(motion): rewrite main.js with editorial motion system

New system: Lenis smooth scroll (duration 1.2, exponential ease) +
GSAP ScrollTrigger reveal patterns (fade-up, scale-soft, reveal-text
with clipPath, stagger-children). Picks up .js-* class selectors and
respects prefers-reduced-motion. Removes old fade-up/scale-up/rotate-
in/blur-up animation router.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 11: Micro-interactions + nav behavior + form submit

**Files:**
- Modify: `main.js` (append micro-interactions block before closing IIFE)

- [ ] **Step 1: Append micro-interactions to `main.js`**

Open `main.js`. Find the line `document.addEventListener('DOMContentLoaded', () => {` and INSIDE that listener, REPLACE the body with:

```js
  document.addEventListener('DOMContentLoaded', () => {
    initReveals();
    initNav();
    initFAQ();
    initForm();
  });
```

Then, just BEFORE the closing `})();` of the IIFE (the very last line of the file), insert these new functions:

```js

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
          // Close
          gsap.to(answer, {
            height: 0, opacity: 0, duration: 0.5, ease: EASE,
            onComplete: () => { item.open = false; gsap.set(answer, { clearProps: 'all' }); },
          });
        } else {
          // Open
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

```

- [ ] **Step 2: Override the FAQ CSS rule that hides closed answers**

Open `styles.css`. Find this rule from Task 7:

```css
.faq__item:not([open]) .faq__a { display: none; }
```

Replace it with:

```css
.faq__item:not([open]) .faq__a { height: 0; overflow: hidden; opacity: 0; padding-block: 0; }
.faq__item .faq__a { overflow: hidden; transition: padding-block 0.5s var(--ease-out-quint); will-change: height; }
```

This lets GSAP animate the height instead of relying on `display:none`.

- [ ] **Step 3: Verify behavior**

Reload page. Verify:
- **Nav:** scroll down past 80px → nav gets a translucent off-white background with backdrop blur. Scroll past 120px and continue scrolling down → nav slides up out of view. Scroll up → nav slides back in.
- **FAQ:** click a question → height + opacity animate open smoothly with the `+` rotating to `×`. Click again → closes smoothly.
- **Form:** Don't submit yet (placeholder ENDPOINT will fail) — just verify clicking the submit button shows "Sending…" briefly and then alerts an error. This confirms the async handler works.

- [ ] **Step 4: Commit**

```bash
git add main.js styles.css
git commit -m "feat(motion): add nav hide-on-scroll, FAQ smooth height, async form

Three micro-interactions: nav hides on scroll-down + reveals on
scroll-up with backdrop-blur background past 80px; FAQ items animate
height + opacity with GSAP instead of display:none; form submits
asynchronously to Formspree and reveals success state. Updates closed-
FAQ CSS to use height:0 instead of display:none so GSAP can drive it.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 12: Asset path correction + final QA pass

**Files:**
- Modify: `index.html` (correct any remaining asset paths)
- Modify: `styles.css` if any responsive bugs found
- Modify: `main.js` if any animation bugs found

- [ ] **Step 1: Verify branding.png path is consistent**

Search `index.html` for `branding.png`:

```bash
grep -n "branding.png" index.html
```

Every occurrence should be `assets/branding.png` (matches `assets/` directory). If any read just `branding.png` (legacy path from before the assets folder), update them to `assets/branding.png`.

Also verify the favicon link in `<head>`:

```html
<link rel="icon" type="image/png" href="assets/branding.png" />
```

If it reads `href="branding.png"`, update to `href="assets/branding.png"`.

- [ ] **Step 2: QA across breakpoints**

Run `python3 -m http.server 8080`. Open `http://localhost:8080`. In DevTools, test each breakpoint:

**Mobile (375px):**
- Hero: headline legible, no horizontal scroll.
- Nav: logo + Apply link, both visible without overlap.
- Filosofía: columns stack vertically.
- Capabilities: number stays left, title + description stack vertically right of it.
- Foundation: cube on top, content below.
- Engineer: photo on top, content below — dark bg fills full width.
- FAQ: items stack, `+` visible.
- Form: full-width inputs.
- Footer: items stack.

**Tablet (768px):**
- Footer becomes single row (logo / meta / back-to-top).
- Capabilities still stacks within rows.
- Other sections still stack.

**Desktop (1280px):**
- Filosofía: 2-column body+principles.
- Capabilities: 3-column rows (number / name / description).
- Foundation: cube left + content right.
- Engineer: photo left + content right.

For any visible bugs (overflow, broken layout, animations not firing), fix in the appropriate file.

- [ ] **Step 3: Verify smooth performance**

Open DevTools Performance tab. Record 5 seconds of scrolling through the page. Verify:
- No long tasks > 50ms during scroll.
- No layout shifts (CLS).
- ScrollTrigger reveals don't cause jank.

If frame drops appear during heavy scroll, check `will-change` is set on animating elements and remove on animation end.

- [ ] **Step 4: Verify reduced-motion respect**

In DevTools → Rendering panel → Emulate CSS media feature `prefers-reduced-motion: reduce`. Reload page. Verify:
- Hero loads instantly (no entrance animation).
- Sections appear immediately on scroll, no fade-up / clip-reveal.
- FAQ open/close still functional (CSS-driven fallback acceptable).

- [ ] **Step 5: Final commit**

If any fixes were needed:

```bash
git add -A
git commit -m "fix: responsive + path corrections after rebrand QA pass

Minor fixes from cross-breakpoint QA: corrected asset paths to
assets/branding.png, [list any responsive fixes if applied].

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

If no fixes were needed, skip this commit and move to Step 6.

- [ ] **Step 6: Smoke test the rebrand end-to-end**

One last manual pass at desktop 1280px. Walk top to bottom and confirm:

1. Hero loads with line-by-line reveal animation.
2. Eyebrow / serif h1 / sub / Apply CTA visible.
3. Scroll → Filosofía: title clip-reveals, body fades up, principles stagger in.
4. Scroll → Capabilities: 8 numbered rows, hairlines visible.
5. Scroll → Foundation: cube visible left, deliverables stagger.
6. Scroll → Engineer: page flips to dark, portrait grayscale, quote in serif italic.
7. Scroll → FAQ: 5 questions, click opens smoothly.
8. Scroll → Apply: form with underline inputs only.
9. Footer: single-row, copyright, back-to-top.
10. No yellow color anywhere. No emojis. All headlines in Fraunces serif. All body in Inter Tight sans.

This is the rebrand complete. The site is ready for the user to provide a real Formspree endpoint and deploy.

---

## Implementation Notes

- **Scope discipline:** Do not add any new CTAs, sections, or features not in the spec. The rebrand is purely visual + copy + motion. Form endpoint, deploy, domain, Calendly are out of scope.
- **Commits per task:** Each task ends with one commit. Commit messages follow the existing convention (`feat:`, `refactor:`, `fix:`).
- **No emojis in source:** Verify no `🤖`, `⚡`, `📈`, etc. remain in `index.html` after any task. They are explicitly removed from the design.
- **Yellow check:** Every task that touches CSS should preserve full monochrome — no `#F5C400`, no `var(--accent)`. If grep finds any after Task 12, remove them.
- **CDN reliance:** GSAP and Lenis are loaded from CDN. Must be served via HTTP (`python3 -m http.server`), not `file://`, or scripts won't load.
- **Per cubo-web skill anti-patterns:**
  - Hero animations are CSS keyframes only, NOT ScrollTrigger at progress 0.
  - No `slide-left`/`slide-right` — all entrances on y-axis.
  - No `gsap.from` with `textContent: 0` patterns (no counters in this design).

---

## Self-review checklist (run before declaring complete)

```bash
grep -i "f5c400\|fbbf24\|yellow" styles.css index.html main.js   # → no matches
grep -E "🤖|⚡|💻|📈|🎯|🚀|🔭|🔄|🛠️|⚙️|📊|🔒|⚠|✅|✦" index.html   # → no matches
grep -c "Playfair\|Sora" styles.css index.html                    # → 0 matches
grep -c "Fraunces\|Inter Tight" styles.css index.html             # → multiple matches
```

All four checks must pass before considering the rebrand complete.
