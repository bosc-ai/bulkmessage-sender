/* =========================================================
   Weflux - shared shell (nav + footer + mobile menu)
   All pages live at root level - no /pages/ prefix needed.
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

  // ---- META PIXEL (injected once from shell so all pages auto-track) ----
  if (!window.fbq) {
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '2167003997195249');
    fbq('track', 'PageView');

    var nsPixel = document.createElement('noscript');
    nsPixel.innerHTML = '<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=2167003997195249&ev=PageView&noscript=1" />';
    if (document.body) {
      document.body.appendChild(nsPixel);
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        if (document.body) document.body.appendChild(nsPixel);
      });
    }
  }

  // ---- META PIXEL AUTOMATIC EVENT TRACKING ----
  try {
    if (window.fbq) {
      var path = location.pathname.toLowerCase();
      var pageName = document.title || path;
      if (path.indexOf('pricing') !== -1 || path.indexOf('features') !== -1 || path.indexOf('use-cases') !== -1 || path.indexOf('comparison') !== -1 || path.indexOf('platform') !== -1) {
        fbq('track', 'ViewContent', { content_name: pageName, content_category: 'Product Page', page_path: path });
      }

      document.addEventListener('click', function(e) {
        var target = e.target.closest ? e.target.closest('a, button') : null;
        if (!target) return;
        var href = (target.getAttribute('href') || '').toLowerCase();
        var text = (target.textContent || '').trim().toLowerCase();

        // Start Free / Register CTAs
        if (href.indexOf('weflux.in/register') !== -1 || href.indexOf('register.html') !== -1 || href.indexOf('signup.html') !== -1 || text.indexOf('start free') !== -1 || text.indexOf('start 14-day free trial') !== -1 || text.indexOf('sign up') !== -1) {
          fbq('track', 'CompleteRegistration', { content_name: text || 'Start Free CTA', link_url: href });
        }
        // Contact actions (WhatsApp, Phone, Email)
        else if (href.indexOf('wa.me') !== -1 || href.indexOf('api.whatsapp.com') !== -1 || href.indexOf('whatsapp.com') !== -1) {
          fbq('track', 'Contact', { content_name: 'WhatsApp Link Click', link_url: href });
        } else if (href.indexOf('tel:') !== -1) {
          fbq('track', 'Contact', { content_name: 'Phone Call Click', link_url: href });
        } else if (href.indexOf('mailto:') !== -1) {
          fbq('track', 'Contact', { content_name: 'Email Link Click', link_url: href });
        }
      }, true);
    }
  } catch (err) {
    console.error('Meta Pixel auto-tracking error:', err);
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
  // Nav + footer markup is rendered into the page at build time by
  // lib/shell.js, so crawlers see real links. This file only wires up
  // behaviour on markup that is already in the DOM.


  // ---- NAV ----
  const navHost = document.getElementById('wc-nav');
  if (navHost) {

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


  // ---- WEFLUX REDIRECT INTERSTITIAL ----
  // Any in-page link to weflux.in shows a short "Taking you to Weflux…"
  // loading screen, then auto-continues. Injected once from the shell so
  // every page (current and future) gets it for free.
  (function () {
    const WEFLUX_RE = /^https?:\/\/(www\.)?weflux\.in(\/|$|\?|#)/i;
    const DELAY = 1500; // 1.5s - within the "1–2 sec" brief

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
