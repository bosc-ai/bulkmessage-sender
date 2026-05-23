/* WaChat — Interactions & Animations
   GSAP + ScrollTrigger + Lenis smooth scroll
   ──────────────────────────────────────────── */

// ── Lenis smooth scroll ─────────────────────

let lenis;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.85,
    touchMultiplier: 1.5,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Sync with GSAP ScrollTrigger
  if (typeof gsap !== 'undefined' && gsap.ticker) {
    gsap.ticker.add(time => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }
}

// ── Navigation ──────────────────────────────

const navWrap = document.querySelector('.nav-wrap');
const mobileToggle = document.querySelector('.mobile-toggle');

// Scroll-aware navbar
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (navWrap) {
    navWrap.classList.toggle('scrolled', scrollY > 20);
  }
  lastScrollY = scrollY;
}, { passive: true });

// Mobile menu toggle
if (mobileToggle && navWrap) {
  mobileToggle.addEventListener('click', () => {
    navWrap.classList.toggle('menu-open');
  });

  // Close menu on link click
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => navWrap.classList.remove('menu-open'));
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!navWrap.contains(e.target)) {
      navWrap.classList.remove('menu-open');
    }
  });
}

// ── GSAP Animations ─────────────────────────

if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance (page load)
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (document.querySelector('.eyebrow')) {
    heroTl
      .from('.hero .eyebrow', { opacity: 0, y: 18, duration: 0.55 })
      .from('.hero h1', { opacity: 0, y: 28, duration: 0.7 }, '-=0.3')
      .from('.hero-lead', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
      .from('.hero-cta', { opacity: 0, y: 16, duration: 0.5 }, '-=0.4')
      .from('.hero-trust', { opacity: 0, y: 10, duration: 0.45 }, '-=0.35')
      .from('.hero-visual', { opacity: 0, x: 32, duration: 0.75, ease: 'power2.out' }, '-=0.7')
      .from('.inbox-toast', { opacity: 0, y: 16, scale: 0.95, duration: 0.5, ease: 'back.out(1.4)' }, '-=0.2');
  }

  // Generic scroll-reveal: any element with .reveal class
  const revealEls = document.querySelectorAll('.reveal');
  revealEls.forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.65,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      }
    });
  });

  // Feature cards stagger
  const featureGrids = document.querySelectorAll('.features-grid, .usecases-grid');
  featureGrids.forEach(grid => {
    const cards = grid.querySelectorAll('.feature-card, .usecase-card');
    gsap.from(cards, {
      opacity: 0,
      y: 28,
      stagger: 0.08,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: grid,
        start: 'top 85%',
        once: true,
      }
    });
  });

  // Pricing cards stagger
  const pricingGrid = document.querySelector('.pricing-grid');
  if (pricingGrid) {
    gsap.from(pricingGrid.querySelectorAll('.pricing-card'), {
      opacity: 0,
      y: 32,
      scale: 0.97,
      stagger: 0.1,
      duration: 0.65,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: pricingGrid,
        start: 'top 85%',
        once: true,
      }
    });
  }

  // Section headings
  document.querySelectorAll('.section-head').forEach(el => {
    gsap.from(el, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      }
    });
  });

  // Trust band items
  const trustChecks = document.querySelectorAll('.trust-check');
  if (trustChecks.length) {
    gsap.from(trustChecks, {
      opacity: 0,
      x: -16,
      stagger: 0.1,
      duration: 0.55,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.trust-band',
        start: 'top 80%',
        once: true,
      }
    });
  }

  // Trust stat cards
  const trustStats = document.querySelectorAll('.trust-stat');
  if (trustStats.length) {
    gsap.from(trustStats, {
      opacity: 0,
      y: 16,
      scale: 0.95,
      stagger: 0.1,
      duration: 0.55,
      ease: 'back.out(1.2)',
      scrollTrigger: {
        trigger: '.trust-stats-row',
        start: 'top 85%',
        once: true,
      }
    });
  }

  // Stats strip counter animation
  document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const isDecimal = el.dataset.decimal === 'true';

    gsap.from({ val: 0 }, {
      val: target,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate() {
        const v = isDecimal ? this._targets[0].val.toFixed(1) : Math.round(this._targets[0].val);
        el.textContent = prefix + v + suffix;
      },
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      }
    });
  });

  // FAQ items
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length) {
    gsap.from(faqItems, {
      opacity: 0,
      y: 12,
      stagger: 0.05,
      duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.faq-list',
        start: 'top 85%',
        once: true,
      }
    });
  }

  // CTA band
  if (document.querySelector('.cta-band')) {
    gsap.from('.cta-band h2', {
      opacity: 0,
      y: 24,
      duration: 0.65,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.cta-band',
        start: 'top 80%',
        once: true,
      }
    });
    gsap.from(['.cta-band .lead', '.cta-band-actions', '.cta-band-note'], {
      opacity: 0,
      y: 16,
      stagger: 0.12,
      duration: 0.55,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.cta-band',
        start: 'top 80%',
        once: true,
      }
    });
  }
}

// Fallback for no-GSAP: IntersectionObserver reveal
if (typeof gsap === 'undefined') {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .feature-card, .pricing-card, .usecase-card').forEach(el => {
    el.classList.add('reveal');
    io.observe(el);
  });
}

// ── FAQ Accordion ────────────────────────────

document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
    });

    // Toggle clicked
    if (!isOpen) item.classList.add('open');
  });
});

// ── Pricing Toggle ───────────────────────────

const pricingToggle = document.querySelector('.toggle-switch');
if (pricingToggle) {
  const monthlyPrices = document.querySelectorAll('[data-monthly]');
  const annualPrices  = document.querySelectorAll('[data-annual]');
  const monthlyLabel  = document.querySelector('.pricing-monthly-label');
  const annualLabel   = document.querySelector('.pricing-annual-label');
  let isAnnual = false;

  pricingToggle.addEventListener('click', () => {
    isAnnual = !isAnnual;
    pricingToggle.classList.toggle('on', isAnnual);

    monthlyPrices.forEach(el => el.style.display = isAnnual ? 'none' : '');
    annualPrices.forEach(el => el.style.display  = isAnnual ? '' : 'none');
    if (monthlyLabel) monthlyLabel.classList.toggle('active', !isAnnual);
    if (annualLabel)  annualLabel.classList.toggle('active', isAnnual);
  });

  // Init
  monthlyPrices.forEach(el => el.style.display = '');
  annualPrices.forEach(el => el.style.display = 'none');
}

// ── Contact Form ─────────────────────────────

const contactForm = document.querySelector('[data-contact-form]');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    const original = btn.textContent;

    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Simulate async (replace with real endpoint)
    setTimeout(() => {
      btn.textContent = 'Message sent!';
      btn.style.background = 'var(--green-dark)';

      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    }, 1200);
  });
}

// ── Active nav link ──────────────────────────

const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ── Smooth anchor scroll (for same-page links) ─

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(target, { offset: -80, duration: 1.4 });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
