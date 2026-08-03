/* =========================================================
   Weflux — shared shell (nav + footer + mobile menu)
   All pages live at root level — no /pages/ prefix needed.
   ========================================================= */
(function () {
  'use strict';

  // ---- GOOGLE ANALYTICS 4 (injected once from shell so new pages auto-track) ----
  if (!document.querySelector('script[src*="G-EGHHC5WBPN"]')) {
    var ga = document.createElement('script');
    ga.async = true;
    ga.src = 'https://www.googletagmanager.com/gtag/js?id=G-EGHHC5WBPN';
    document.head.appendChild(ga);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-EGHHC5WBPN');
  }

  // ---- GOOGLE TAG MANAGER (injected once from shell so new pages auto-track) ----
  if (!window.dataLayer || !window.dataLayer.some(function(e){ return e['gtm.start']; })) {
    // Head script
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-55CH5SQK');
    // Noscript fallback
    var ns = document.createElement('noscript');
    ns.innerHTML = '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-55CH5SQK" height="0" width="0" style="display:none;visibility:hidden"></iframe>';
    document.body.insertBefore(ns, document.body.firstChild);
  }

  // ---- LEAD CAPTURE POPUP (injected once from shell so configured pages get it) ----
  if (!document.querySelector('link[href*="lead-capture"]')) {
    var lcCss = document.createElement('link');
    lcCss.rel = 'stylesheet';
    lcCss.href = '/lead-capture.css';
    document.head.appendChild(lcCss);

    var lcJs = document.createElement('script');
    lcJs.defer = true;
    lcJs.src = '/lead-capture.js';
    document.head.appendChild(lcJs);

    var dbJs = document.createElement('script');
    dbJs.defer = true;
    dbJs.src = '/demo-booking.js';
    document.head.appendChild(dbJs);
  }

  const navLinks = [
    { href: '/features.html',   label: 'Features',  key: 'features' },
    { href: '/pricing.html',    label: 'Pricing',   key: 'pricing' },
    { href: '/use-cases.html',  label: 'Use cases', key: 'use-cases' },
    { href: '/customers.html',  label: 'Customers', key: 'customers' },
    { href: '/blog.html',       label: 'Blog',      key: 'blog' },
    { href: '/comparison.html', label: 'Compare',   key: 'comparison' },

  ];

  const activeKey = (document.body.dataset.page || '').toLowerCase();
  const logoSrc = '/assets/wachat-logo.png';

  // ---- NAV ----
  const navHost = document.getElementById('wc-nav');
  if (navHost) {
    navHost.innerHTML = `
      <a class="skip" href="#main">Skip to content</a>
      <header class="nav" id="wc-nav-el">
        <div class="container-wide nav-inner">
          <a class="brand" href="/" aria-label="Weflux home">
            <span class="brand-mark" aria-hidden="true">
              <img src="${logoSrc}" alt="" width="36" height="36">
            </span>
            <span class="brand-name">Weflux</span>
          </a>

          <nav class="nav-links" aria-label="Primary">
            ${navLinks.map(l => `<a href="${l.href}" data-k="${l.key}"${activeKey === l.key ? ' aria-current="page"' : ''}>${l.label}</a>`).join('')}
          </nav>

          <div class="nav-cta">
            <a href="https://app.weflux.in/login" class="btn btn-ghost nav-signin">Sign in</a>
            <a href="https://app.weflux.in/register" class="btn btn-green">Start free →</a>
            <button class="nav-burger" id="wc-burger" aria-label="Open menu" aria-expanded="false" aria-controls="wc-mobile">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      <div class="mobile-menu" id="wc-mobile" aria-hidden="true" inert>
        <nav>
          ${navLinks.map(l => `<a href="${l.href}"${activeKey === l.key ? ' aria-current="page"' : ''}>${l.label}</a>`).join('')}
          <hr>
          <a href="https://app.weflux.in/login">Sign in</a>
          <a href="https://app.weflux.in/register" class="btn btn-green" style="justify-content:center;margin-top:6px">Start free →</a>
        </nav>
      </div>
    `;

    const nav = document.getElementById('wc-nav-el');
    const onScroll = () => {
      if (window.scrollY > 8) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const burger = document.getElementById('wc-burger');
    const mobile = document.getElementById('wc-mobile');
    function setMenu(open) {
      mobile.classList.toggle('open', open);
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      mobile.setAttribute('aria-hidden', open ? 'false' : 'true');
      // inert keeps the menu's links out of the tab order + a11y tree while closed
      if (open) mobile.removeAttribute('inert');
      else mobile.setAttribute('inert', '');
      document.body.style.overflow = open ? 'hidden' : '';
    }
    burger.addEventListener('click', () => setMenu(!mobile.classList.contains('open')));
    mobile.addEventListener('click', (e) => { if (e.target.tagName === 'A') setMenu(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 1024) setMenu(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  }

  // ---- FOOTER ----
  const footHost = document.getElementById('wc-footer');
  if (footHost) {
    footHost.innerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer-top">
            <div class="footer-brand">
              <a class="brand" href="/">
                <span class="brand-mark" aria-hidden="true">
                  <img src="${logoSrc}" alt="" width="32" height="32">
                </span>
                <span class="brand-name">Weflux</span>
              </a>
              <p>Weflux is an official WhatsApp Business API platform — send broadcast campaigns, automate replies, build workflows, and manage a shared team inbox. Built in India.</p>
              <p class="footer-contact"><a href="mailto:hello@weflux.in">hello@weflux.in</a> · <a href="https://weflux.in">weflux.in</a></p>
            </div>
            <div class="footer-col">
              <h5>Product</h5>
              <ul>
                <li><a href="/features">All Features</a></li>
                <li><a href="/broadcasts">Broadcasts</a></li>
                <li><a href="/shared-inbox">Shared Inbox</a></li>
                <li><a href="/automations">Automations</a></li>
                <li><a href="/whatsapp-crm">WhatsApp CRM</a></li>
                <li><a href="/pricing">Pricing</a></li>
                <li><a href="/changelog">Changelog</a></li>
                <li><a href="/status">Status</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h5>Solutions</h5>
              <ul>
                <li><a href="/use-cases.html#d2c">D2C &amp; e-commerce</a></li>
                <li><a href="/use-cases.html#education">Education</a></li>
                <li><a href="/use-cases.html#finance">Financial services</a></li>
                <li><a href="/use-cases.html#healthcare">Healthcare</a></li>
                <li><a href="/use-cases.html#logistics">Logistics &amp; travel</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h5>Resources</h5>
              <ul>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/articles">Articles</a></li>
                <li><a href="/case-studies">Case Studies</a></li>
                <li><a href="/help">Help Center</a></li>
                <li><a href="/resources">Resources</a></li>
                <li><a href="/weflux-guide">Weflux Guide</a></li>
                <li><a href="/contact">Contact sales</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h5>Legal</h5>
              <ul>
                <li><a href="/privacy">Privacy</a></li>
                <li><a href="/terms">Terms</a></li>
                <li><a href="/data-deletion">Data deletion</a></li>
                <li><a href="/cookies">Cookies</a></li>
                <li><a href="/security">Security</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bot">
            <div class="left">
              <span>© 2026 Serves Technologies</span>
              <span class="sep">·</span>
              <span>MSME · Udyam UDYAM-KR-03-0513677</span>
              <span class="sep">·</span>
              <span>Made in India</span>
            </div>
            <div class="socials">
              <a href="https://www.instagram.com/wefluxapp/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
              <a href="https://www.facebook.com/wefluxapp" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
              <a href="https://www.linkedin.com/company/wefluxapp/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0H5a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5h14a5 5 0 0 0 5-5V5a5 5 0 0 0-5-5ZM8 19H5V8h3v11ZM6.5 6.7a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6ZM20 19h-3v-5.6c0-1.4-.5-2.4-1.8-2.4-1 0-1.6.7-1.8 1.3-.1.2-.1.6-.1.9V19h-3V8h3v1.3c.4-.7 1.1-1.6 2.8-1.6 2 0 3.6 1.3 3.6 4.1V19Z"/></svg></a>
            </div>
          </div>
          <p class="footer-disclaimer">WhatsApp and the WhatsApp logo are trademarks of Meta Platforms, Inc. Weflux is an independent product of Serves Technologies and is not affiliated with, endorsed by, or sponsored by Meta. All product and company names herein may be trademarks of their respective owners.</p>
        </div>
      </footer>
    `;
  }

  // ---- WEFLUX REDIRECT INTERSTITIAL ----
  // Any in-page link to weflux.in shows a short "Taking you to Weflux…"
  // loading screen, then auto-continues. Injected once from the shell so
  // every page (current and future) gets it for free.
  (function () {
    const WEFLUX_RE = /^https?:\/\/(www\.)?weflux\.in(\/|$|\?|#)/i;
    const DELAY = 1500; // 1.5s — within the "1–2 sec" brief

    const overlay = document.createElement('div');
    overlay.className = 'weflux-redirect';
    overlay.id = 'wc-weflux-redirect';
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'polite');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <div class="wfr-card">
        <div class="wfr-spinner" aria-hidden="true"></div>
        <p class="wfr-title">Taking you to Weflux…</p>
        <p class="wfr-sub">WhatsApp Automation &amp; Customer Communication Platform</p>
        <div class="wfr-bar" aria-hidden="true"></div>
      </div>
    `;

    let armed = false;
    function ensureMounted() {
      if (!overlay.isConnected) document.body.appendChild(overlay);
    }
    function go(href) {
      ensureMounted();
      // force reflow so the transition runs even if just appended
      overlay.offsetHeight; // eslint-disable-line no-unused-expressions
      overlay.classList.add('show');
      overlay.setAttribute('aria-hidden', 'false');
      window.setTimeout(function () { window.location.href = href; }, DELAY);
    }

    document.addEventListener('click', function (e) {
      if (armed) { e.preventDefault(); return; }
      // respect modifier keys / non-left clicks (open-in-new-tab, etc.)
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      if (a.target && a.target !== '' && a.target !== '_self') return; // new-tab links pass through
      const href = a.getAttribute('href') || '';
      if (!WEFLUX_RE.test(href)) return;
      e.preventDefault();
      armed = true;
      go(href);
    }, true);

    // If the page is restored from bfcache, clear the overlay state.
    window.addEventListener('pageshow', function (ev) {
      if (ev.persisted) {
        armed = false;
        overlay.classList.remove('show');
        overlay.setAttribute('aria-hidden', 'true');
      }
    });
  })();
})();
