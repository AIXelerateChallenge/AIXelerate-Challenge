/**
 * Site-wide motion. One module, loaded on every page.
 *
 * Motion character for this direction is "cinematic": few moves, each
 * with weight and a long ease. Nothing loops forever, nothing competes
 * with reading.
 *
 * Everything here degrades rather than disappears under
 * prefers-reduced-motion — reveals land instantly, the nav still
 * changes state, and no content is withheld.
 */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ *
 * Nav: solidify past the fold, and drive the mobile drawer.
 * ------------------------------------------------------------------ */
function initNav() {
  const bar = document.querySelector('[data-nav]');
  if (!bar) return;

  const sync = () => bar.classList.toggle('is-scrolled', window.scrollY > 48);
  sync();
  window.addEventListener('scroll', sync, { passive: true });

  const toggle = bar.querySelector('[data-nav-toggle]');
  const drawer = bar.querySelector('[data-nav-drawer]');
  if (!toggle || !drawer) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    drawer.hidden = !open;
    // Lock the page behind the drawer so the background does not scroll.
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) drawer.querySelector('a')?.focus();
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Escape closes and returns focus to the control that opened it.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  // Following a link inside the drawer should close it.
  drawer.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });

  // Returning to desktop width must not leave the body scroll-locked.
  const desktop = window.matchMedia('(min-width: 900px)');
  desktop.addEventListener('change', (e) => { if (e.matches) setOpen(false); });
}

/* ------------------------------------------------------------------ *
 * Scroll reveal. Elements marked .reveal rise into place once.
 * data-reveal-delay staggers siblings without per-element CSS.
 * ------------------------------------------------------------------ */
function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const delay = Number(entry.target.dataset.revealDelay || 0);
        entry.target.style.transitionDelay = `${delay}ms`;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.1 }
  );

  targets.forEach((el) => io.observe(el));
}

/* ------------------------------------------------------------------ *
 * Line-masked headline reveal — the signature moment.
 *
 * Each [data-lines] child is wrapped in an overflow-hidden shell so the
 * line rises out from behind its own edge rather than fading in. Done in
 * JS so the markup stays semantic (an <h1> with <span> lines) and so a
 * no-JS render is simply a normal, fully visible headline.
 * ------------------------------------------------------------------ */
function initHeadlines() {
  document.querySelectorAll('[data-lines]').forEach((el) => {
    const lines = [...el.children];
    if (!lines.length) return;

    lines.forEach((line, i) => {
      const mask = document.createElement('span');
      mask.className = 'line-mask';
      line.parentNode.insertBefore(mask, line);
      mask.appendChild(line);
      line.classList.add('line-inner');
      line.style.transitionDelay = reduced ? '0ms' : `${90 + i * 110}ms`;
    });

    // Next frame, so the initial transform is painted before it animates.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.classList.add('is-revealed');
    }));
  });
}

/* ------------------------------------------------------------------ *
 * Rotating word. Replaces the old per-character stagger with a single
 * weighted swap — the point is the sentence, not the letters.
 * ------------------------------------------------------------------ */
function initRotator() {
  const el = document.querySelector('[data-rotate]');
  if (!el) return;

  let words;
  try {
    words = JSON.parse(el.dataset.rotate);
  } catch {
    return; // Malformed data must not take the headline down with it.
  }
  if (!Array.isArray(words) || words.length < 2) return;

  // Reserve the width of the longest word so the line never reflows.
  const probe = document.createElement('span');
  probe.style.cssText =
    'position:absolute;visibility:hidden;white-space:nowrap;font:inherit;letter-spacing:inherit';
  document.body.appendChild(probe);
  let widest = 0;
  words.forEach((w) => {
    probe.textContent = w;
    widest = Math.max(widest, probe.getBoundingClientRect().width);
  });
  probe.remove();
  el.style.minWidth = `${Math.ceil(widest)}px`;

  el.textContent = words[0];
  if (reduced) return; // A single honest word, no rotation.

  let i = 0;
  let timer;
  const tick = () => {
    el.classList.add('is-out');
    setTimeout(() => {
      i = (i + 1) % words.length;
      el.textContent = words[i];
      el.classList.remove('is-out');
    }, 260);
  };

  const start = () => { timer = setInterval(tick, 2400); };
  const stop = () => clearInterval(timer);

  // Do not burn frames on a word nobody is looking at.
  document.addEventListener('visibilitychange', () =>
    document.hidden ? stop() : start()
  );
  start();
}

/* ------------------------------------------------------------------ *
 * Accordion. grid-template-rows 0fr → 1fr animates to natural height
 * with no height measurement in JS.
 * ------------------------------------------------------------------ */
function initAccordions() {
  document.querySelectorAll('[data-accordion]').forEach((root) => {
    const items = root.querySelectorAll('[data-accordion-item]');

    items.forEach((item) => {
      const trigger = item.querySelector('[data-accordion-trigger]');
      const panel = item.querySelector('[data-accordion-panel]');
      if (!trigger || !panel) return;

      trigger.addEventListener('click', () => {
        const open = trigger.getAttribute('aria-expanded') === 'true';

        // Single-open behaviour: collapse siblings first.
        if (!open) {
          items.forEach((other) => {
            if (other === item) return;
            other
              .querySelector('[data-accordion-trigger]')
              ?.setAttribute('aria-expanded', 'false');
            other.classList.remove('is-open');
          });
        }

        trigger.setAttribute('aria-expanded', String(!open));
        item.classList.toggle('is-open', !open);
      });
    });

    // Open the first item so the page never presents as empty.
    const first = items[0]?.querySelector('[data-accordion-trigger]');
    if (first) {
      first.setAttribute('aria-expanded', 'true');
      items[0].classList.add('is-open');
    }
  });
}

/* ------------------------------------------------------------------ *
 * Boot.
 * ------------------------------------------------------------------ */
initNav();
initReveal();
initHeadlines();
initRotator();
initAccordions();
