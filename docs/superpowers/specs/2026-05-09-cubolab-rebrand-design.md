# Cubo Labs — Rebrand Design Spec

**Date:** 2026-05-09
**Author:** Ezequiel Frías + Claude
**Status:** Approved — pending implementation plan

## Brief

Rebrand de la landing page actual (dark, accent amarillo, copy de conversión denso, 11 secciones, emojis en cada card) hacia una identidad **monocromática editorial luxury**: minimal, Apple-inspired, swiss grid, premium venture studio. Asset de referencia: `assets/branding.png` (cubo isométrico + wordmark "cubo labs.").

## Decisiones aprobadas

1. **Tema base:** Light (off-white cálido, no blanco puro).
2. **Alcance:** Rebrand completo — visual + copy.
3. **Acento:** Eliminado. Full monochrome (negro / off-white / grises cálidos).
4. **Tipografía:** Editorial serif (Fraunces) + neo-grotesk (Inter Tight).
5. **Estructura:** Condensar a 7 secciones.

## 1. Sistema de diseño

### Paleta

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#FAFAF7` | Fondo base (off-white cálido) |
| `--surface` | `#F2F1EC` | Cards, formulario, divisores suaves |
| `--ink` | `#0A0A0A` | Texto primario, headlines, botón primario |
| `--ink-soft` | `#1A1A1A` | Hover de botón primario |
| `--muted` | `#6B6B6B` | Texto secundario, captions, eyebrows |
| `--rule` | `#D9D7CF` | Hairlines, bordes, dividers |
| `--inverse-bg` | `#0A0A0A` | Sección "The Engineer" (única inversión) |
| `--inverse-ink` | `#FAFAF7` | Texto sobre inverse |
| `--inverse-muted` | `#888` | Muted sobre inverse |

### Tipografía

- **Fraunces** — serif. Pesos 400/500/600/700. Italic disponible para énfasis editorial. Uso: headlines (h1, h2), eyebrows numéricos ("— 02"), números grandes en capabilities.
- **Inter Tight** — neo-grotesk sans. Pesos 400/500/600. Uso: body, UI, labels, botones, FAQ, footer.

Escala fluida:
- Hero h1: `clamp(2.75rem, 7vw, 6rem)` — Fraunces 500, line-height 1.05, letter-spacing -0.02em
- Section h2: `clamp(2rem, 4vw, 3.5rem)` — Fraunces 500, line-height 1.1
- Capability number: `clamp(2.5rem, 6vw, 5rem)` — Fraunces 400, italic disponible
- Body: `1.0625rem` (17px) — Inter Tight 400, line-height 1.6
- Eyebrow: `0.75rem` — Inter Tight 500, uppercase, letter-spacing 0.16em
- Button: `0.9375rem` — Inter Tight 500, letter-spacing 0.01em

### Spacing & grid

- Container: `max-width: 1280px`, padding inline `clamp(1.5rem, 5vw, 4rem)`.
- Sección padding vertical: `clamp(6rem, 12vw, 10rem)`.
- Grid base: 12 columnas, gap `clamp(1.25rem, 2vw, 2rem)`.
- Asimetrías editoriales: eyebrow en columnas 1-3, contenido en 5-12; o headline col 1-7, body col 8-12.

## 2. Estructura nueva (7 secciones)

| # | Sección | Anchor | Contenido y dirección de copy |
|---|---|---|---|
| 01 | Hero — Manifesto | `#hero` | Eyebrow: "Cubo Labs · Independent venture studio". H1 serif a 3 líneas: "Engineered systems for companies that refuse to scale by working harder." (en ES: "Sistemas de ingeniería para empresas que se niegan a crecer trabajando más.") Subtítulo body 1 línea. Single CTA "Apply for a Foundation session →". Sin badges, sin scarcity en hero. |
| 02 | Manifesto / Filosofía | `#filosofia` | Reemplaza Problema + Solución. Layout 2 columnas: izq texto editorial largo serif (3 párrafos breves sobre la filosofía "menos herramientas, más ingeniería"), der lista numerada `01 / 02 / 03` de tres principios cortos. |
| 03 | Capabilities | `#capacidades` | Reemplaza Servicios. Lista numerada `01 — 08` tipo índice editorial. Sin cards. Cada fila: número serif gigante (col 1) + título sans bold (col 2-6) + descripción 1 línea muted (col 7-12) + hairline divider entre filas. Sin emojis. |
| 04 | The Foundation Cube | `#foundation` | Producto signature. Split asimétrico: izq el `branding.png` cubo grande (~280px) con whitespace generoso, der eyebrow "— The product" + h2 + 5 deliverables como lista numerada hairline-divided + CTA "Apply →". Sin tarjeta de precio ni "$500 → GRATIS"; en su lugar, hairline note: "By application — limited to 3 sessions per month." |
| 05 | The Engineer | `#fundador` | **Única sección dark (inverse).** Layout split: izq foto B/N (`perfil.PNG` con `filter: grayscale(1) contrast(1.05)`), der quote serif large "Less tooling. More engineering." + 3 párrafos bio reescritos en tono editorial + firma ("Ezequiel Frías — Engineer & Founder"). |
| 06 | FAQ | `#faq` | 5 preguntas (reducidas de 6) en `<details>` nativos para a11y. Hairline divider entre cada una. Pregunta serif, respuesta sans muted. Indicador: rotación 45° de un signo `+` minimal, sin íconos rellenos. |
| 07 | Apply | `#apply` | Reemplaza "Contacto". H2: "Apply for a Foundation session." Form minimal: inputs sin caja, solo underline hairline `--rule` que se vuelve `--ink` en focus. Labels arriba en eyebrow style. Single submit "Submit application →". Mantiene Formspree con placeholder `ENDPOINT`. |

**Nav:** Sticky transparente que se vuelve sólido bg-cálido al scroll. Logo a la izq (28px) + 1 link minimal "Apply" a la derecha (sin botón sólido).

**Footer:** 1 fila — logo wordmark + año + email contacto + back to top. Hairline superior.

## 3. Componentes clave

- **Botón primario:** `background: var(--ink)`, `color: var(--bg)`, padding `0.875rem 1.75rem`, border-radius `2px`, transición a `--ink-soft` en hover. Sin sombras. Flecha SVG inline `→`.
- **Botón outline (variante):** `border: 1px solid var(--ink)`, `background: transparent`, `color: var(--ink)`. Hover invierte.
- **Eyebrow:** `<span class="eyebrow">— 02 &nbsp; Capabilities</span>`, donde el número usa Fraunces italic y la palabra Inter Tight uppercase.
- **Hairline rule:** `<hr class="rule">` o `border-top: 1px solid var(--rule)`. Usado entre filas de capabilities, FAQ, y dentro del Foundation Cube.
- **Number marker:** `<span class="num">04</span>` en Fraunces para etiquetas de pasos / deliverables.
- **Cube logo (nav):** `branding.png` height 28px.
- **Cube logo (Foundation focal):** `branding.png` width ~280px, sin contenedor.
- **Foto líder:** `<img>` con `filter: grayscale(1) contrast(1.05)`, dentro de div con aspect-ratio 4/5 y border 1px hairline.
- **Form input:** sin `background`, sin border, solo `border-bottom: 1px solid var(--rule)`. Padding vertical `0.875rem`. Focus `border-bottom-color: var(--ink)`.

**Sin emojis** en ninguna parte. Todos los íconos del sitio actual se eliminan.

## 4. Sistema de motion

Motion en toda la landing siguiendo el lenguaje de **Apple HIG + Linear + Framer + Stripe**:
**lento, suave, preciso, con easing elegante, sin rebotes, sin efectos "startup genérica"**.

**Stack:** GSAP + ScrollTrigger + Lenis (ya cargados via CDN).

### 4.1 Principios

1. **Lento e intencional.** Duraciones entre `0.9s` y `1.6s` para entradas. Nunca `0.3s` snappy de "framework default".
2. **Easing curado, sin bounce.** Una sola curva primaria + una secundaria. Cero `back.out`, cero `elastic`, cero overshoot.
3. **Movimiento corto.** Translaciones máximas `24-32px`. Escalas máximas `0.96 → 1`. Nada de sliding 100vw ni rotaciones grandes.
4. **Una animación por unidad.** Cada elemento tiene una sola transformación primaria. Si algo necesita 3 propiedades, las animamos juntas con un único easing y duración.
5. **Stagger sutil.** Entre `60ms` y `120ms` entre items consecutivos. Nunca `0.3s+` que se siente "cascada".
6. **El scroll es el motor.** Lenis con `duration: 1.2`, easing exponencial. Da el "buttery smooth" tipo Linear / Apple Newsroom.
7. **Sin parallax decorativo, sin floating icons, sin gradientes en movimiento, sin loaders animados.** Si la animación no es funcional o expresiva, no existe.
8. **Respeta `prefers-reduced-motion`** — desactivar todo excepto `opacity`.

### 4.2 Easing curves

```css
--ease-out-quint:  cubic-bezier(0.22, 1, 0.36, 1);   /* primary  — Apple/Linear */
--ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1); /* secondary — para pinned scrub */
```

GSAP equivalentes: `CustomEase.create("primary","M0,0 C0.22,1 0.36,1 1,1")` o usar `power4.out` (aproximación aceptable sin CustomEase plugin).

### 4.3 Patterns globales

| Pattern | Transform | Duración | Ease | Uso |
|---|---|---|---|---|
| `reveal-text` | `clipPath: inset(100% 0 0 0)` → `inset(0)` + `y: 16 → 0` | `1.4s` | `ease-in-out-quart` | h1, h2 — headlines serif. |
| `fade-up` | `y: 24 → 0`, `opacity: 0 → 1` | `1.1s` | `ease-out-quint` | Body copy, eyebrows, párrafos. |
| `fade-in` | `opacity: 0 → 1` | `0.9s` | `ease-out-quint` | Imágenes, cards, divisores. |
| `scale-soft` | `scale: 0.96 → 1`, `opacity: 0 → 1` | `1.2s` | `ease-out-quint` | Foto líder, cubo Foundation. |
| `stagger-rows` | hijos con `fade-up` desfasados `80ms` | `1.1s` cada uno | `ease-out-quint` | Capabilities, deliverables, FAQ items, form fields. |

### 4.4 Animaciones por sección

| Sección | Animación al entrar |
|---|---|
| **Hero** | Carga inmediata vía CSS `@keyframes`. Secuencia: eyebrow `fade-up` (delay 0.1s) → h1 `reveal-text` (delay 0.3s) → subtítulo `fade-up` (delay 0.9s) → CTA `fade-up` (delay 1.15s). **Sin ScrollTrigger** (per cubo-web anti-pattern). |
| **Manifesto** | h2 `reveal-text` + body `fade-up` + 3 principios `stagger-rows` (80ms entre cada uno). |
| **Capabilities** | Eyebrow + h2 `reveal-text`. Lista `01-08` `stagger-rows` (60ms apart — más rápido por ser 8 items). |
| **Foundation Cube** | h2 `reveal-text`. Cubo `scale-soft`. 5 deliverables `stagger-rows` (100ms). CTA `fade-up`. |
| **The Engineer** (dark) | Foto `scale-soft` (lado izq, delay 0). Quote `reveal-text` (delay 0.2s). Bio párrafos `stagger-rows` (delay 0.5s, 100ms apart). Firma `fade-up`. |
| **FAQ** | Eyebrow + h2 `reveal-text`. Items `stagger-rows` (80ms). Apertura: animación nativa CSS sobre `<details>` con `interpolate-size: allow-keywords` + `transition: height` para height auto, easing `ease-out-quint`, duración `0.5s`. |
| **Apply** | h2 `reveal-text`. Subtítulo `fade-up`. Form fields `stagger-rows` (70ms). Botón submit `fade-up` final. |

### 4.5 Micro-interacciones (siempre activas, sin scroll)

- **Botón primario hover:** `background: var(--ink) → var(--ink-soft)`, transición `0.4s ease-out-quint`. Flecha `→` se desplaza `4px` a la derecha.
- **Link / nav hover:** `text-decoration` simulado con `border-bottom` que crece de `0% → 100%` en `0.5s ease-in-out-quart`. (Stripe-style underline reveal.)
- **Form input focus:** `border-bottom-color: --rule → --ink`, transición `0.5s ease-in-out-quart`. Label asociada cambia `color: --muted → --ink` con misma curva.
- **Nav sticky:** Hide-on-scroll-down / show-on-scroll-up estilo Linear. Translación `y: 0 → -100%` en `0.5s ease-in-out-quart`. Background `transparent → rgba(250,250,247,0.85)` con `backdrop-filter: blur(12px)` cuando scroll > 80px.
- **Cursor sobre cubo Foundation:** rotación CSS sutil `rotateY: 0 → 6deg` en `1s ease-out-quint`. Solo desktop, no mobile.
- **FAQ `+` indicator:** rotación `0deg → 45deg` en `0.4s ease-out-quint` cuando se abre.

### 4.6 Lenis config

```js
new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential out
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1.5,
});
```

### 4.7 Anti-patterns explícitos (qué evitar)

- Bounces, springs visibles, rotaciones grandes, escalas `> 1`.
- Parallax decorativo de imágenes / gradientes.
- Loaders / skeletons animados (no aplica — todo es estático).
- Animación de números (counters subiendo de 0 a N).
- Hovers que cambian de color saturado a otro saturado.
- Cualquier animación de hero con ScrollTrigger en `progress: 0` (anti-pattern documentado en cubo-web skill).
- Confetti, partículas, blob morphing, gradientes animados.
- Múltiples elementos compitiendo en una misma sección con animaciones simultáneas distintas.

### 4.8 Performance

- `will-change` solo en elementos animándose en ese momento, removido al terminar.
- Transformaciones siempre `transform` + `opacity` (compositor-only).
- ScrollTrigger con `once: true` para entradas — no re-animar al volver a entrar.

## 5. Archivos afectados

| Archivo | Acción |
|---|---|
| `index.html` | Reescritura completa: nueva estructura, nuevo copy, sin emojis, sin clases acent. |
| `styles.css` | Reescritura completa: nuevos tokens, nueva tipografía, swiss grid, hairlines. |
| `main.js` | Simplificación: solo `fade-up` + `clip-reveal`, conservar Lenis + FAQ accordion + Formspree async. |
| `assets/branding.png` | Sin cambios. |
| `perfil.PNG` | Sin cambios. Tratamiento via CSS filter. |
| `.gitignore` | Sin cambios. |

## 6. Tensions resueltos por defecto

- **Sección Engineer dark:** Confirmada como única inversión.
- **Idioma del copy:** Core en español (consistente con audiencia), pero eyebrows y micro-labels pueden mezclar inglés editorial ("— 02 Capabilities", "Apply for a Foundation session") al estilo venture studio internacional.
- **Foundation deliverables:** Mantener 5 (alineado con brief original del producto).

## 7. Out of scope

- Endpoint Formspree real (queda placeholder `ENDPOINT`).
- Dominio / deploy.
- Calendly / WhatsApp en CTAs (todos apuntan a `#apply`).
- Versión en inglés completa del sitio.
- Animaciones complejas tipo canvas / video sequence.

## 8. Success criteria

- Sitio cargado vía `python3 -m http.server 8080` se ve coherente desktop + mobile (breakpoints 640/1024/1280).
- Cero emojis en el render final.
- Cero color amarillo en el render final.
- Headlines en serif Fraunces, body en Inter Tight.
- Sección "The Engineer" inverte a fondo negro; el resto en off-white.
- Animaciones lentas, suaves, precisas — lenguaje Apple/Linear/Stripe. Cero bounces, cero efectos genéricos. Cada sección anima al entrar; micro-interacciones consistentes en links, botones, form e indicador FAQ.
- `prefers-reduced-motion` desactiva todo excepto opacidad.
- Form envía a Formspree (con ENDPOINT placeholder) y muestra estado de éxito.
