/* =========================================================
   Weflux - shared shell markup (nav + footer)

   Single source of truth. build.js renders this into every
   page in /dist so the nav and footer are real HTML that
   crawlers can read. shell.js in the browser only wires up
   behaviour (scroll state, burger menu) - it no longer
   creates markup, so there is nothing to drift.
   ========================================================= */

const LOGO = "/assets/weflux-logo.png";

// Extensionless hrefs throughout: vercel.json sets cleanUrls,
// so /features.html would 308 to /features and waste a hop.
const NAV_LINKS = [
  { href: "/features",   label: "Features",  key: "features" },
  { href: "/pricing",    label: "Pricing",   key: "pricing" },
  { href: "/use-cases",  label: "Use cases", key: "use-cases" },
  { href: "/customers",  label: "Customers", key: "customers" },
  { href: "/blog",       label: "Blog",      key: "blog" },
  { href: "/comparison", label: "Compare",   key: "comparison" },
];

const current = (key, active) => (key === active ? ' aria-current="page"' : "");

export function navHtml(activeKey = "") {
  const links = (cls) =>
    NAV_LINKS.map(
      (l) =>
        `<a href="${l.href}"${cls ? ` data-k="${l.key}"` : ""}${current(l.key, activeKey)}>${l.label}</a>`
    ).join("");

  return `<a class="skip" href="#main">Skip to content</a>
      <header class="nav" id="wc-nav-el">
        <div class="container-wide nav-inner">
          <a class="brand" href="/" aria-label="Weflux home">
            <span class="brand-mark" aria-hidden="true">
              <img src="${LOGO}" alt="" width="36" height="36">
            </span>
            <span class="brand-name">Weflux</span>
          </a>

          <nav class="nav-links" aria-label="Primary">
            ${links(true)}
          </nav>

          <div class="nav-cta">
            <a href="https://app.weflux.in/login" class="btn btn-ghost nav-signin">Sign in</a>
            <a href="https://app.weflux.in/register" class="btn btn-green">Start free →</a>
            <button class="nav-burger" id="wc-burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="wc-mobile">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      <div class="mobile-menu" id="wc-mobile" aria-hidden="true" inert>
        <nav aria-label="Mobile">
          ${links(false)}
          <hr>
          <a href="https://app.weflux.in/login">Sign in</a>
          <a href="https://app.weflux.in/register" class="btn btn-green" style="justify-content:center;margin-top:6px">Start free →</a>
        </nav>
      </div>`;
}

export function footerHtml(emptyCollections = new Set()) {
  const drop = (h) =>
    [...emptyCollections].reduce(
      (acc, dir) => acc.replace(new RegExp(`\\s*<li><a href="/${dir}">[^<]*</a></li>`, "g"), ""),
      h
    );
  return drop(`<footer class="footer">
        <div class="container">
          <div class="footer-top">
            <div class="footer-brand">
              <a class="brand" href="/" aria-label="Weflux home">
                <span class="brand-mark" aria-hidden="true">
                  <img src="${LOGO}" alt="" width="32" height="32">
                </span>
                <span class="brand-name">Weflux</span>
              </a>
              <p>Weflux is an official WhatsApp Business API platform - send broadcast campaigns, automate replies, build workflows, and manage a shared team inbox. Built in India.</p>
              <p class="footer-contact"><a href="mailto:hello@weflux.in">hello@weflux.in</a> · <a href="https://www.weflux.in">weflux.in</a></p>
            </div>
            <div class="footer-col">
              <h2>Product</h2>
              <ul>
                <li><a href="/features">All Features</a></li>
                <li><a href="/broadcasts">Broadcasts</a></li>
                <li><a href="/shared-inbox">Shared Inbox</a></li>
                <li><a href="/automations">Automations</a></li>
                <li><a href="/whatsapp-crm">WhatsApp CRM</a></li>
                <li><a href="/platform">Platform</a></li>
                <li><a href="/comparison">Compare providers</a></li>
                <li><a href="/weflux-vs-wati">vs WATI</a></li>
                <li><a href="/weflux-vs-aisensy">vs AiSensy</a></li>
                <li><a href="/weflux-vs-interakt">vs Interakt</a></li>
                <li><a href="/pricing">Pricing</a></li>
                <li><a href="/changelog">Changelog</a></li>
                <li><a href="/status">Status</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h2>Solutions</h2>
              <ul>
                <li><a href="/whatsapp-for-ecommerce">D2C &amp; e-commerce</a></li>
                <li><a href="/whatsapp-for-education">Education</a></li>
                <li><a href="/whatsapp-for-financial-services">Financial services</a></li>
                <li><a href="/whatsapp-for-healthcare">Healthcare</a></li>
                <li><a href="/whatsapp-for-logistics">Logistics &amp; travel</a></li>
                <li><a href="/whatsapp-for-agencies">Agencies &amp; partners</a></li>
                <li><a href="/use-cases">All playbooks</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h2>Resources</h2>
              <ul>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/articles">Articles</a></li>
                <li><a href="/case-studies">Case Studies</a></li>
                <li><a href="/help">Help Center</a></li>
                <li><a href="/resources">Resources</a></li>
                <li><a href="/whatsapp-message-templates">Message Templates</a></li>
                <li><a href="/whatsapp-green-tick">Green Tick Guide</a></li>
                <li><a href="/docs">API Docs</a></li>
                <li><a href="/weflux-guide">Weflux Guide</a></li>
                <li><a href="/contact">Contact sales</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h2>Legal</h2>
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
              <a href="https://www.instagram.com/wefluxapp/" target="_blank" rel="noopener noreferrer" aria-label="Weflux on Instagram"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
              <a href="https://www.facebook.com/wefluxapp" target="_blank" rel="noopener noreferrer" aria-label="Weflux on Facebook"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
              <a href="https://www.linkedin.com/company/wefluxapp/" target="_blank" rel="noopener noreferrer" aria-label="Weflux on LinkedIn"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M19 0H5a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5h14a5 5 0 0 0 5-5V5a5 5 0 0 0-5-5ZM8 19H5V8h3v11ZM6.5 6.7a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6ZM20 19h-3v-5.6c0-1.4-.5-2.4-1.8-2.4-1 0-1.6.7-1.8 1.3-.1.2-.1.6-.1.9V19h-3V8h3v1.3c.4-.7 1.1-1.6 2.8-1.6 2 0 3.6 1.3 3.6 4.1V19Z"/></svg></a>
            </div>
          </div>
          <p class="footer-disclaimer">WhatsApp and the WhatsApp logo are trademarks of Meta Platforms, Inc. Weflux is an independent product of Serves Technologies and is not affiliated with, endorsed by, or sponsored by Meta. All product and company names herein may be trademarks of their respective owners.</p>
        </div>
      </footer>`);
}

/** Replace the empty shell hosts in a page with real markup. */
export function injectShell(html, emptyCollections = new Set()) {
  const activeKey = (html.match(/<body[^>]*\bdata-page="([^"]*)"/i) || [, ""])[1].toLowerCase();
  return html
    .replace(/<div id="wc-nav">\s*<\/div>/, `<div id="wc-nav">${navHtml(activeKey)}</div>`)
    .replace(/<div id="wc-footer">\s*<\/div>/, `<div id="wc-footer">${footerHtml(emptyCollections)}</div>`);
}
