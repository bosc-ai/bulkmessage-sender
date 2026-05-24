/* =========================================================
   WaChat — landing page interactions
   Pure CSS animations only — no GSAP, no Lenis.
   ========================================================= */
(function () {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Marquee: duplicate logos for seamless loop ----------
  const mq = document.getElementById('marquee');
  if (mq) {
    mq.innerHTML = mq.innerHTML + mq.innerHTML;
  }

  // ---------- Phone-mockup tilt (the inbox frame) ----------
  const inboxFrame = document.getElementById('inboxFrame');
  const inboxWrap = document.getElementById('inboxWrap');
  if (inboxFrame && inboxWrap && !reduced) {
    let raf = null;
    let target = { x: -4, y: 2 };
    let cur = { x: -4, y: 2 };
    function loop() {
      cur.x += (target.x - cur.x) * 0.08;
      cur.y += (target.y - cur.y) * 0.08;
      inboxFrame.style.transform = `perspective(1400px) rotateY(${cur.x}deg) rotateX(${cur.y}deg)`;
      raf = requestAnimationFrame(loop);
    }
    inboxWrap.addEventListener('mousemove', (e) => {
      const rect = inboxWrap.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      target.x = -4 + cx * 6;
      target.y = 2 - cy * 5;
    });
    inboxWrap.addEventListener('mouseleave', () => {
      target.x = -4; target.y = 2;
    });
    loop();
  }

  // ---------- Hero chat: typing animation ----------
  const stream = document.getElementById('chatStream');
  const script = [
    { who: 'in',  text: 'Hi 👋 quick question about my order' },
    { who: 'out', text: 'Hi Priya! I see order #12847 — how can I help?', meta: '11:41 · ✓✓' },
    { who: 'in',  text: 'Awesome! When will it arrive?' },
    { who: 'out', text: 'Tomorrow by 6 PM. Tracking link → wc.in/t/12847', meta: '11:42 · ✓✓' },
  ];
  function makeBubble(role, text, meta) {
    const b = document.createElement('div');
    b.className = 'bubble ' + role;
    b.textContent = text;
    if (meta) {
      const m = document.createElement('div');
      m.className = 'meta';
      const parts = meta.split('·');
      m.innerHTML = '<span>' + parts[0].trim() + '</span>' + (parts[1] ? '<span class="read">' + parts[1].trim() + '</span>' : '');
      b.appendChild(m);
    }
    return b;
  }
  function makeTyping() {
    const t = document.createElement('div');
    t.className = 'typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    return t;
  }
  async function runChat() {
    if (!stream) return;
    while (true) {
      stream.innerHTML = '';
      await wait(400);
      for (let i = 0; i < script.length; i++) {
        const step = script[i];
        if (step.who === 'out') {
          const t = makeTyping();
          stream.appendChild(t);
          await wait(900);
          t.remove();
        }
        stream.appendChild(makeBubble(step.who, step.text, step.meta));
        await wait(step.who === 'in' ? 1100 : 1300);
      }
      await wait(2400);
    }
  }
  function wait(ms) { return new Promise(r => setTimeout(r, reduced ? 200 : ms)); }
  runChat();

  // ---------- Stats: count-up on intersect ----------
  function animateNumber(el, to, decimals, suffix) {
    const dur = 1400;
    const t0 = performance.now();
    function step(now) {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = to * eased;
      el.textContent = formatNum(val, to, decimals);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = formatNum(to, to, decimals);
    }
    requestAnimationFrame(step);
  }
  function formatNum(v, to, decimals) {
    if (decimals) return v.toFixed(decimals);
    if (to >= 1000) return Math.round(v).toLocaleString('en-IN');
    if (Number.isInteger(to)) return Math.round(v).toString();
    return v.toFixed(1);
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        const el = en.target;
        const to = parseFloat(el.dataset.to);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const suffix = el.dataset.suffix || '';
        if (suffix && !el.parentElement.querySelector('.suffix')) {
          const s = document.createElement('span');
          s.className = 'suffix';
          s.textContent = suffix;
          el.parentElement.appendChild(s);
        }
        animateNumber(el, to, decimals, suffix);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.counter').forEach((el) => io.observe(el));

  // ---------- Feature tabs ----------
  const tabs = document.querySelectorAll('#featTabs .feat-tab');
  const panels = document.querySelectorAll('#featStage .feat-panel');
  let activeIdx = 0;
  let cycleTimer = null;
  function setTab(idx) {
    activeIdx = idx;
    tabs.forEach((t, i) => {
      t.classList.toggle('active', i === idx);
      t.setAttribute('aria-selected', i === idx ? 'true' : 'false');
    });
    panels.forEach((p, i) => p.classList.toggle('show', i === idx));
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      setTab(i);
      restartCycle();
    });
  });
  function cycle() {
    setTab((activeIdx + 1) % tabs.length);
  }
  function restartCycle() {
    if (cycleTimer) clearInterval(cycleTimer);
    if (!reduced) cycleTimer = setInterval(cycle, 5500);
  }
  const featSec = document.querySelector('.features');
  if (featSec) {
    const featIo = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          restartCycle();
        } else if (cycleTimer) {
          clearInterval(cycleTimer);
          cycleTimer = null;
        }
      });
    }, { threshold: 0.25 });
    featIo.observe(featSec);
  }
  const featStage = document.getElementById('featStage');
  if (featStage) {
    featStage.addEventListener('mouseenter', () => { if (cycleTimer) clearInterval(cycleTimer); });
    featStage.addEventListener('mouseleave', restartCycle);
  }

  // ---------- Pricing toggle ----------
  const billBtns = document.querySelectorAll('#billToggle button');
  billBtns.forEach((b) => {
    b.addEventListener('click', () => {
      billBtns.forEach((x) => x.classList.remove('on'));
      b.classList.add('on');
      const mode = b.dataset.billing;
      document.querySelectorAll('.plan .price').forEach((p) => {
        const v = mode === 'annual' ? p.dataset.annual : p.dataset.monthly;
        p.textContent = Number(v).toLocaleString('en-IN');
      });
      document.querySelectorAll('.plan-price .per').forEach((per) => {
        per.textContent = mode === 'annual' ? '/mo · billed annually' : '/mo · billed monthly';
      });
    });
  });

  // ---------- FAQ accordion ----------
  document.querySelectorAll('#faqList .faq-item').forEach((item) => {
    const btn = item.querySelector('.faq-q');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('#faqList .faq-item').forEach((x) => x.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ---------- Scroll reveal: subtle fade-up on sections ----------
  const revealIo = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.style.opacity = '1';
        en.target.style.transform = 'translateY(0)';
        revealIo.unobserve(en.target);
      }
    });
  }, { threshold: 0.08 });
  if (!reduced) {
    document.querySelectorAll('.section-head, .stats-head, .trust-inner, .pricing-head, .faq-layout > div:first-child, .final-cta-inner').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity .55s cubic-bezier(.22,1,.36,1), transform .55s cubic-bezier(.22,1,.36,1)';
      revealIo.observe(el);
    });
  }

  // ---------- Inner page: TOC scrollspy ----------
  const tocLinks = document.querySelectorAll('.toc a');
  if (tocLinks.length) {
    const sections = [...tocLinks].map(a => document.querySelector(a.getAttribute('href')));
    function onScroll() {
      const y = window.scrollY + 120;
      let active = sections[0];
      sections.forEach(s => { if (s && s.offsetTop <= y) active = s; });
      tocLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + (active && active.id)));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------- Inner page: signup plan pre-select ----------
  const planSel = document.getElementById('planSel');
  if (planSel) {
    const params = new URLSearchParams(location.search);
    const planParam = params.get('plan');
    if (planParam && [...planSel.options].some(o => o.value === planParam)) {
      planSel.value = planParam;
    }
  }

  // ---------- Inner page: signup mock submit ----------
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = e.target.checkValidity();
      if (!ok) { e.target.reportValidity(); return; }
      const success = document.getElementById('signupSuccess');
      if (success) success.classList.add('show');
      e.target.style.opacity = '.4';
      e.target.style.pointerEvents = 'none';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Inner page: contact form ----------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = e.target.checkValidity();
      if (!ok) { e.target.reportValidity(); return; }
      const success = document.getElementById('contactSuccess');
      if (success) success.classList.add('show');
      e.target.style.opacity = '.4';
      e.target.style.pointerEvents = 'none';
    });
  }

})();
