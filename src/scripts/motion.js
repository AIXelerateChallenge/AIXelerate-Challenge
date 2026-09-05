/**
 * Site-wide motion. One module, loaded on every page.
 *
 * Motion character: Volta-like spatial staging, disciplined for production.
 * The hero responds gently to a pointer; reading and controls stay fast.
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
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
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
 * Hero collage: each photograph has its own depth, idle drift, and
 * cursor-repulsion field. This mirrors the reference interaction instead
 * of moving the collage as one flat object.
 * ------------------------------------------------------------------ */
function initHeroCollage() {
  const hero = document.querySelector('[data-hero]');
  const stack = hero?.querySelector('[data-hero-stack]');
  if (!hero || !stack || reduced || !window.matchMedia('(pointer:fine)').matches) return;

  const tiles = [...stack.querySelectorAll('.hero__tile')];
  const state = tiles.map((tile, i) => ({
    tile,
    phase: i * 0.83,
    x: 0,
    y: 0,
    rotation: 0,
  }));
  let targetX = 0;
  let targetY = 0;
  let smoothX = 0;
  let smoothY = 0;
  let inside = false;
  let visible = true;

  hero.addEventListener('pointermove', (event) => {
    const box = hero.getBoundingClientRect();
    targetX = ((event.clientX - box.left) / box.width) * 2 - 1;
    targetY = ((event.clientY - box.top) / box.height) * 2 - 1;
    hero.style.setProperty('--pointer-x', `${event.clientX - box.left}px`);
    hero.style.setProperty('--pointer-y', `${event.clientY - box.top}px`);
    inside = true;
  }, { passive:true });
  hero.addEventListener('pointerleave', () => {
    targetX = 0;
    targetY = 0;
    hero.style.setProperty('--pointer-x', '50%');
    hero.style.setProperty('--pointer-y', '50%');
    inside = false;
  });

  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin:'160px' }).observe(hero);

  const tick = (now) => {
    if (visible) {
      smoothX += (targetX - smoothX) * .065;
      smoothY += (targetY - smoothY) * .065;
      stack.style.transform = `translate(-50%,-50%) rotateX(${smoothY * -3.8}deg) rotateY(${smoothX * 5.5}deg)`;

      const box = stack.getBoundingClientRect();
      const pointerX = box.width * (.5 + smoothX * .5);
      const pointerY = box.height * (.5 + smoothY * .5);
      const time = now / 1000;

      state.forEach((item, i) => {
        const tile = item.tile;
        const cx = tile.offsetLeft + tile.offsetWidth / 2;
        const cy = tile.offsetTop + tile.offsetHeight / 2;
        const dx = cx - pointerX;
        const dy = cy - pointerY;
        const distance = Math.hypot(dx, dy) || 1;
        const force = inside ? Math.max(0, 1 - distance / Math.max(240, box.width * .62)) : 0;
        const depth = .45 + i / Math.max(1, tiles.length - 1) * .65;
        const push = force * force * 58 * depth;
        const idleX = Math.sin(time * .42 + item.phase) * 3.4 * depth;
        const idleY = Math.cos(time * .35 + item.phase * 1.3) * 4.2 * depth;
        const nextX = (dx / distance) * push + smoothX * -13 * depth + idleX;
        const nextY = (dy / distance) * push + smoothY * -13 * depth + idleY;
        const nextRotation = (dx / distance) * force * 4.5 * depth;
        item.x += (nextX - item.x) * .075;
        item.y += (nextY - item.y) * .075;
        item.rotation += (nextRotation - item.rotation) * .075;
        tile.style.setProperty('--mx', `${item.x.toFixed(2)}px`);
        tile.style.setProperty('--my', `${item.y.toFixed(2)}px`);
        tile.style.setProperty('--mr', `${item.rotation.toFixed(2)}deg`);
      });
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* The complete hero stage recedes, dims, and softens as the next scene
 * takes over. Keeping this on the stage avoids fighting the tile transforms. */
function initHeroExit() {
  const hero = document.querySelector('[data-hero]');
  const stage = hero?.querySelector('[data-hero-stage]');
  if (!hero || !stage || reduced) return;

  let queued = false;
  const render = () => {
    queued = false;
    const rect = hero.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, -rect.top / window.innerHeight));
    stage.style.transform = `translate3d(0,${(progress * -58).toFixed(1)}px,0) scale(${(1 - progress * .11).toFixed(4)})`;
    stage.style.opacity = String(1 - progress * .9);
    stage.style.filter = `blur(${(progress * 5).toFixed(2)}px)`;
  };
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(render);
  };
  render();
  window.addEventListener('scroll', queue, { passive:true });
  window.addEventListener('resize', queue, { passive:true });
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
initHeroCollage();
initHeroExit();
initReveal();
initHeadlines();
initAccordions();
