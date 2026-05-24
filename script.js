/* WaChat — Interactions v4
   ─────────────────────────────────────────────
   · Removed Lenis — CDN unreliability caused crashes on Vercel.
     Native scroll is smooth enough and has zero dependencies.
   · GSAP + ScrollTrigger only (cdnjs — highly reliable CDN).
   · Contact form: AJAX to FormSubmit.co (real email delivery).
   · FAQ: max-height cross-browser accordion.
   · Mobile menu: opacity + pointer-events (animates cleanly).
   · prefers-reduced-motion: all animations skipped.
   · All GSAP calls null-guarded.
   ─────────────────────────────────────────────── */

'use strict';

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const HAS_GSAP = typeof gsap !== 'undefined';

/* ── 1. Navigation ────────────────────────────── */
function initNav() {
  const nav = document.querySelector('.nav-wrap');
  if (!nav) return;

  const toggle  = nav.querySelector('.mobile-toggle');
  const overlay = nav.querySelector('.mobile-menu');

  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function openMenu() {
    nav.classList.add('menu-open');
    toggle?.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';
  }
  function closeMenu() {
    nav.classList.remove('menu-open');
    toggle?.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
  }

  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.addEventListener('click', e => {
    e.stopPropagation();
    nav.classList.contains('menu-open') ? closeMenu() : openMenu();
  });

  overlay?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  document.addEventListener('pointerdown', e => {
    if (nav.classList.contains('menu-open') && !nav.contains(e.target)) closeMenu();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('menu-open')) closeMenu();
  });

  const page = location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href').split('?')[0].split('#')[0];
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ── 2. GSAP Animations ───────────────────────── */
function initAnimations() {
  if (!HAS_GSAP) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => io.observe(el));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  function batchReveal(selector, fromVars, scrollStart = 'top 88%') {
    const els = gsap.utils.toArray(selector);
    if (!els.length) return;
    if (REDUCED) { gsap.set(els, { opacity: 1, x: 0, y: 0 }); return; }
    els.forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, ...fromVars },
        { opacity: 1, x: 0, y: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: scrollStart, once: true } }
      );
    });
  }

  const hero = document.querySelector('.hero');
  if (hero && !REDUCED) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    const q  = s => hero.querySelector(s);
    const eyebrow = q('.eyebrow'), h1 = q('h1'), lead = q('.hero-lead');
    const cta = q('.hero-cta'), trust = q('.hero-trust'), visual = q('.hero-visual');
    const toast = document.querySelector('.inbox-toast');

    if (eyebrow) tl.from(eyebrow, { opacity: 0, y: 14, duration: 0.5 });
    if (h1)      tl.from(h1,      { opacity: 0, y: 22, duration: 0.6 }, '-=0.22');
    if (lead)    tl.from(lead,    { opacity: 0, y: 14, duration: 0.5 }, '-=0.3');
    if (cta)     tl.from(cta,     { opacity: 0, y: 10, duration: 0.45 }, '-=0.3');
    if (trust)   tl.from(trust,   { opacity: 0, y: 8,  duration: 0.4 }, '-=0.3');
    if (visual)  tl.from(visual,  { opacity: 0, x: 24, duration: 0.65, ease: 'power2.out' }, '-=0.6');
    if (toast)   tl.from(toast,   { opacity: 0, y: 10, scale: 0.94, duration: 0.45, ease: 'back.out(1.5)' }, '-=0.15');
  } else if (hero && REDUCED) {
    gsap.set(['.hero .eyebrow', '.hero h1', '.hero-lead', '.hero-cta', '.hero-trust', '.hero-visual', '.inbox-toast'],
      { opacity: 1, x: 0, y: 0 });
  }

  batchReveal('.reveal',       { y: 22 });
  batchReveal('.reveal-left',  { x: -22 });
  batchReveal('.reveal-right', { x: 22 });

  document.querySelectorAll('.features-grid, .usecases-grid, .values-grid').forEach(grid => {
    const cards = gsap.utils.toArray('.feature-card, .usecase-card, .value-card', grid);
    if (!cards.length || REDUCED) { if (REDUCED) gsap.set(cards, { opacity: 1 }); return; }
    gsap.from(cards, {
      opacity: 0, y: 20, stagger: 0.07, duration: 0.55, ease: 'power2.out',
      scrollTrigger: { trigger: grid, start: 'top 86%', once: true },
    });
  });

  const pGrid = document.querySelector('.pricing-grid');
  if (pGrid && !REDUCED) {
    gsap.from(gsap.utils.toArray('.pricing-card', pGrid), {
      opacity: 0, y: 26, stagger: 0.1, duration: 0.6, ease: 'power3.out',
      scrollTrigger: { trigger: pGrid, start: 'top 85%', once: true },
    });
  }

  gsap.utils.toArray('.section-head').forEach(el => {
    if (REDUCED) { gsap.set(el, { opacity: 1 }); return; }
    gsap.from(el, {
      opacity: 0, y: 16, duration: 0.55, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    const target  = parseFloat(el.dataset.target);
    const suffix  = el.dataset.suffix  || '';
    const decimal = el.dataset.decimal === 'true';
    const obj     = { v: 0 };
    gsap.to(obj, {
      v: target, duration: REDUCED ? 0 : 1.6, ease: 'power2.out',
      onUpdate() { el.textContent = (decimal ? obj.v.toFixed(1) : Math.round(obj.v)) + suffix; },
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  const trustChecks = gsap.utils.toArray('.trust-check');
  if (trustChecks.length && !REDUCED) {
    gsap.from(trustChecks, {
      opacity: 0, x: -14, stagger: 0.09, duration: 0.5, ease: 'power2.out',
      scrollTrigger: { trigger: '.trust-band', start: 'top 82%', once: true },
    });
  }

  const ctaBand = document.querySelector('.cta-band');
  if (ctaBand && !REDUCED) {
    gsap.from(['.cta-band h2', '.cta-band .lead', '.cta-band-actions', '.cta-band-note'], {
      opacity: 0, y: 18, stagger: 0.1, duration: 0.55, ease: 'power2.out',
      scrollTrigger: { trigger: ctaBand, start: 'top 82%', once: true },
    });
  }
}

/* ── 3. FAQ Accordion ─────────────────────────────
   max-height: cross-browser, works in all Safari versions.
──────────────────────────────────────────────────── */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn    = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a-inner');
    if (!btn || !answer) return;

    if (item.classList.contains('open')) {
      answer.style.transition = 'none';
      answer.style.maxHeight  = answer.scrollHeight + 'px';
      answer.getBoundingClientRect();
      answer.style.transition = '';
    }

    btn.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(open => {
        open.classList.remove('open');
        open.querySelector('.faq-a-inner').style.maxHeight = '0';
        open.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ── 4. Pricing Toggle ────────────────────────── */
function initPricing() {
  const toggle = document.querySelector('.toggle-switch');
  if (!toggle) return;

  const monthlyEls   = document.querySelectorAll('[data-monthly]');
  const annualEls    = document.querySelectorAll('[data-annual]');
  const monthlyLabel = document.querySelector('.pricing-monthly-label');
  const annualLabel  = document.querySelector('.pricing-annual-label');
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

  monthlyEls.forEach(el => { el.hidden = false; });
  annualEls.forEach(el  => { el.hidden = true; });
  update();
}

/* ── 5. Smooth anchor scroll (native — no Lenis) ─ */
function initAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = document.querySelector('.nav-wrap')?.offsetHeight ?? 68;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top, behavior: REDUCED ? 'auto' : 'smooth' });
    });
  });
}

/* ── 6. Contact form → FormSubmit.co AJAX ──────── */
function initForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    if (!btn || btn.disabled) return;

    const original = btn.textContent;
    btn.disabled   = true;
    btn.textContent = 'Sending…';

    try {
      const data = new FormData(form);
      data.append('_subject',      'New enquiry — WaChat website');
      data.append('_template',     'table');
      data.append('_captcha',      'false');
      data.append('_autoresponse', 'Thanks for reaching out to WaChat. We will reply within the hour.');

      const res = await fetch('https://formsubmit.co/ajax/hello@wachat.serves.in', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });

      if (res.ok) {
        btn.textContent    = 'Sent ✓  We\'ll reply within the hour.';
        btn.style.background = 'var(--green-dark)';
        form.reset();
        setTimeout(() => {
          btn.textContent    = original;
          btn.disabled       = false;
          btn.style.background = '';
        }, 6000);
      } else {
        throw new Error('server');
      }
    } catch {
      btn.textContent    = 'Could not send — email us directly';
      btn.style.background = '#DC2626';
      btn.disabled       = false;
      btn.onclick        = () => {
        window.location.href =
          'mailto:hello@wachat.serves.in?subject=Demo%20Request&body=Hi%20WaChat%20team%2C';
      };
      setTimeout(() => {
        btn.textContent    = original;
        btn.style.background = '';
        btn.onclick        = null;
      }, 6000);
    }
  });
}

/* ── Boot ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initFAQ();
  initPricing();
  initAnchors();
  initForm();
});

window.addEventListener('load', () => {
  initAnimations();
});
