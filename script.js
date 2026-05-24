/* WaChat — Interactions v3
   ─────────────────────────────────────────────
   Fixes in this version:
   · Single Lenis driver (GSAP ticker OR rAF, never both)
   · Removed CSS/GSAP conflict on .inbox-toast
   · prefers-reduced-motion respected everywhere
   · Mobile menu uses opacity + pointer-events (not display)
   · FAQ uses maxHeight (cross-browser, no grid trick)
   · All GSAP calls null-checked
   · Pricing toggle keyboard-accessible
   ─────────────────────────────────────────────── */

'use strict';

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const HAS_GSAP = typeof gsap !== 'undefined';
const HAS_LENIS = typeof Lenis !== 'undefined';

/* ── 1. Lenis smooth scroll ───────────────────
   CRITICAL FIX: use EXACTLY ONE driver.
   gsap.ticker if GSAP is loaded, else rAF.
   The old code called lenis.raf() from BOTH,
   doubling every scroll update → extreme jank.
──────────────────────────────────────────────── */
let lenis = null;

function initLenis() {
  if (!HAS_LENIS || REDUCED) return;

  lenis = new Lenis({
    duration: 1.1,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.88,
    touchMultiplier: 1.5,
    infinite: false,
  });

  if (HAS_GSAP) {
    // GSAP ticker drives Lenis — do NOT also start an rAF loop
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    // No GSAP — use rAF only
    (function tick(t) { lenis.raf(t); requestAnimationFrame(tick); })();
  }

  // Allow anchor clicks to work with smooth scroll
  lenis.on('scroll', ScrollTrigger?.update ?? (() => {}));
}

/* ── 2. Navigation ────────────────────────────── */
function initNav() {
  const nav = document.querySelector('.nav-wrap');
  if (!nav) return;

  const toggle  = nav.querySelector('.mobile-toggle');
  const overlay = nav.querySelector('.mobile-menu');

  // Scroll-aware glass effect
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run immediately on load

  // Mobile menu — toggle open class; CSS handles opacity/pointer-events
  function openMenu()  {
    nav.classList.add('menu-open');
    toggle?.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden'; // lock scroll on iOS too
  }
  function closeMenu() {
    nav.classList.remove('menu-open');
    toggle?.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
  }

  toggle?.addEventListener('click', e => {
    e.stopPropagation();
    nav.classList.contains('menu-open') ? closeMenu() : openMenu();
  });

  // Close on any link inside the mobile menu
  overlay?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // Close on outside tap
  document.addEventListener('pointerdown', e => {
    if (nav.classList.contains('menu-open') && !nav.contains(e.target)) closeMenu();
  });

  // Keyboard: Escape closes menu
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('menu-open')) closeMenu();
  });

  // Mark active link
  const page = location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href').split('?')[0].split('#')[0];
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ── 3. GSAP Animations ───────────────────────── */
function initAnimations() {
  if (!HAS_GSAP) {
    // Fallback: IntersectionObserver makes reveals visible
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => io.observe(el));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Helper: batch animate a list with stagger on scroll
  function batchReveal(selector, fromVars, scrollStart = 'top 88%') {
    const els = gsap.utils.toArray(selector);
    if (!els.length) return;

    if (REDUCED) {
      // Skip animation, just make visible
      gsap.set(els, { opacity: 1, x: 0, y: 0 });
      return;
    }

    els.forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, ...fromVars },
        {
          opacity: 1, x: 0, y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: scrollStart, once: true },
        }
      );
    });
  }

  // ── Hero (homepage only) ──────────────────────
  const hero = document.querySelector('.hero');
  if (hero && !REDUCED) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    const q  = s => hero.querySelector(s);

    const eyebrow  = q('.eyebrow');
    const h1       = q('h1');
    const lead     = q('.hero-lead');
    const cta      = q('.hero-cta');
    const trust    = q('.hero-trust');
    const visual   = q('.hero-visual');
    // NOTE: .inbox-toast is animated by GSAP only — CSS animation removed from it
    const toast    = document.querySelector('.inbox-toast');

    if (eyebrow)  tl.from(eyebrow,  { opacity: 0, y: 14, duration: 0.5 });
    if (h1)       tl.from(h1,       { opacity: 0, y: 22, duration: 0.6 }, '-=0.22');
    if (lead)     tl.from(lead,     { opacity: 0, y: 14, duration: 0.5 }, '-=0.3');
    if (cta)      tl.from(cta,      { opacity: 0, y: 10, duration: 0.45 }, '-=0.3');
    if (trust)    tl.from(trust,    { opacity: 0, y: 8,  duration: 0.4 }, '-=0.3');
    if (visual)   tl.from(visual,   { opacity: 0, x: 24, duration: 0.65, ease: 'power2.out' }, '-=0.6');
    // Toast enters last — no CSS animation on this element
    if (toast)    tl.from(toast,    { opacity: 0, y: 10, scale: 0.94, duration: 0.45, ease: 'back.out(1.5)' }, '-=0.15');
  } else if (hero && REDUCED) {
    // Just show everything immediately
    gsap.set(['.hero .eyebrow', '.hero h1', '.hero-lead', '.hero-cta', '.hero-trust', '.hero-visual', '.inbox-toast'], { opacity: 1, x: 0, y: 0 });
  }

  // ── Scroll reveals ────────────────────────────
  batchReveal('.reveal',       { y: 22 });
  batchReveal('.reveal-left',  { x: -22 });
  batchReveal('.reveal-right', { x: 22 });

  // ── Feature & usecase card stagger ────────────
  document.querySelectorAll('.features-grid, .usecases-grid, .values-grid').forEach(grid => {
    const cards = gsap.utils.toArray('.feature-card, .usecase-card, .value-card', grid);
    if (!cards.length || REDUCED) { if (REDUCED) gsap.set(cards, { opacity: 1 }); return; }
    gsap.from(cards, {
      opacity: 0, y: 20, stagger: 0.07, duration: 0.55, ease: 'power2.out',
      scrollTrigger: { trigger: grid, start: 'top 86%', once: true },
    });
  });

  // ── Pricing cards ─────────────────────────────
  const pGrid = document.querySelector('.pricing-grid');
  if (pGrid && !REDUCED) {
    gsap.from(gsap.utils.toArray('.pricing-card', pGrid), {
      opacity: 0, y: 26, stagger: 0.1, duration: 0.6, ease: 'power3.out',
      scrollTrigger: { trigger: pGrid, start: 'top 85%', once: true },
    });
  }

  // ── Section headings ──────────────────────────
  gsap.utils.toArray('.section-head').forEach(el => {
    if (REDUCED) { gsap.set(el, { opacity: 1 }); return; }
    gsap.from(el, {
      opacity: 0, y: 16, duration: 0.55, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // ── Stat counters ─────────────────────────────
  document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    const target   = parseFloat(el.dataset.target);
    const suffix   = el.dataset.suffix  || '';
    const decimal  = el.dataset.decimal === 'true';
    const obj      = { v: 0 };

    gsap.to(obj, {
      v: target,
      duration: REDUCED ? 0 : 1.6,
      ease: 'power2.out',
      onUpdate() { el.textContent = (decimal ? obj.v.toFixed(1) : Math.round(obj.v)) + suffix; },
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  // ── Trust checks ──────────────────────────────
  const trustChecks = gsap.utils.toArray('.trust-check');
  if (trustChecks.length && !REDUCED) {
    gsap.from(trustChecks, {
      opacity: 0, x: -14, stagger: 0.09, duration: 0.5, ease: 'power2.out',
      scrollTrigger: { trigger: '.trust-band', start: 'top 82%', once: true },
    });
  }

  // ── CTA band ──────────────────────────────────
  const ctaBand = document.querySelector('.cta-band');
  if (ctaBand && !REDUCED) {
    gsap.from(['.cta-band h2', '.cta-band .lead', '.cta-band-actions', '.cta-band-note'], {
      opacity: 0, y: 18, stagger: 0.1, duration: 0.55, ease: 'power2.out',
      scrollTrigger: { trigger: ctaBand, start: 'top 82%', once: true },
    });
  }
}

/* ── 4. FAQ Accordion ─────────────────────────────
   Uses maxHeight (not grid-template-rows) for Safari
   compat and reliable animation in all browsers.
──────────────────────────────────────────────────── */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn    = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a-inner');
    if (!btn || !answer) return;

    // Set initial maxHeight without triggering the CSS transition
    if (item.classList.contains('open')) {
      answer.style.transition = 'none';
      answer.style.maxHeight = answer.scrollHeight + 'px';
      answer.getBoundingClientRect(); // force reflow before re-enabling transition
      answer.style.transition = '';
    }

    btn.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(open => {
        open.classList.remove('open');
        open.querySelector('.faq-a-inner').style.maxHeight = '0';
        open.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });

      // Open clicked
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ── 5. Pricing Toggle ────────────────────────── */
function initPricing() {
  const toggle = document.querySelector('.toggle-switch');
  if (!toggle) return;

  const monthlyEls    = document.querySelectorAll('[data-monthly]');
  const annualEls     = document.querySelectorAll('[data-annual]');
  const monthlyLabel  = document.querySelector('.pricing-monthly-label');
  const annualLabel   = document.querySelector('.pricing-annual-label');
  let annual = false;

  function update() {
    toggle.classList.toggle('on', annual);
    toggle.setAttribute('aria-checked', String(annual));
    monthlyEls.forEach(el => { el.hidden = annual; });
    annualEls.forEach(el  => { el.hidden = !annual; });
    if (monthlyLabel) monthlyLabel.classList.toggle('active', !annual);
    if (annualLabel)  annualLabel.classList.toggle('active',  annual);
  }

  toggle.setAttribute('role', 'switch');
  toggle.setAttribute('tabindex', '0');

  toggle.addEventListener('click', () => { annual = !annual; update(); });
  toggle.addEventListener('keydown', e => {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); annual = !annual; update(); }
  });

  // Initialize — show monthly, hide annual
  monthlyEls.forEach(el => { el.hidden = false; });
  annualEls.forEach(el  => { el.hidden = true; });
  update();
}

/* ── 6. Smooth anchor scroll ──────────────────── */
function initAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -80, duration: 1.1 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ── 7. Contact form (graceful sim) ──────────── */
function initForm() {
  const form = document.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    if (!btn || btn.disabled) return;

    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';

    setTimeout(() => {
      btn.textContent = 'Sent! We\'ll reply within the hour.';
      btn.style.background = 'var(--green-dark)';
      form.reset();
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        btn.style.background = '';
      }, 4000);
    }, 1200);
  });
}

/* ── Boot ─────────────────────────────────────── */
// Use DOMContentLoaded to ensure DOM is ready;
// GSAP/Lenis load asynchronously via defer so check on window load too.
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initFAQ();
  initPricing();
  initAnchors();
  initForm();
});

window.addEventListener('load', () => {
  // Animations and Lenis depend on GSAP/Lenis being loaded (defer scripts)
  initLenis();
  initAnimations();
});
