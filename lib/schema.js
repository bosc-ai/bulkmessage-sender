/* =========================================================
   Weflux - JSON-LD structured data

   Generated at build time from one source rather than hand
   written into thirty-one pages, so the Organization entity
   cannot drift between them. build.js calls injectSchema()
   on every page in /dist.

   Deliberately NOT emitted:
   - AggregateRating / Review. We have no verifiable review
     corpus, and inventing one is a manual action risk.
   - Review or rating markup on comparison.html. Self-serving
     markup about competitors violates Google's guidelines.
   - Certification claims on security.html. SOC 2 and ISO 27001
     are asserted in the copy but unverified; marking them up
     would put a machine-readable claim behind them.
   - WebPage on legal pages. It earns no rich result and no
     answer-engine benefit; it is noise.
   ========================================================= */

import { SITE } from "./postTemplate.js";

const LOGO = `${SITE}/assets/weflux-logo.png`;

const esc = (s) => String(s).replace(/</g, "\\u003c");

/** The entity every other node hangs off. Same @id on every page. */
export function orgNode() {
  return {
    "@type": "Organization",
    "@id": `${SITE}/#org`,
    name: "Weflux",
    legalName: "Serves Technologies",
    url: `${SITE}/`,
    logo: LOGO,
    email: "hello@weflux.in",
    description:
      "Official WhatsApp Business API platform for broadcast campaigns, shared team inbox, automation and CRM. Meta conversation charges billed at cost with no markup.",
    address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
    // Real, live profiles only. A self-referencing sameAs teaches Google nothing.
    sameAs: [
      "https://www.facebook.com/wefluxapp",
      "https://www.instagram.com/wefluxapp/",
      "https://www.linkedin.com/company/wefluxapp/",
    ],
  };
}

export function websiteNode() {
  // No SearchAction: the site has no search endpoint, and declaring a
  // sitelinks searchbox that 404s is a claim we cannot honour.
  return {
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    url: `${SITE}/`,
    name: "Weflux",
    inLanguage: "en-IN",
    publisher: { "@id": `${SITE}/#org` },
  };
}

/**
 * Build BreadcrumbList from the breadcrumb the page already renders, so the
 * markup provably matches visible content. Returns null when there is none.
 */
export function breadcrumbFrom(html) {
  const block = html.match(/<div[^>]*class="crumb"[^>]*>([\s\S]*?)<\/div>/);
  if (!block) return null;

  const items = [];
  const re = /<a[^>]*href="([^"]*)"[^>]*>([^<]+)<\/a>|<span(?![^>]*class="sep")[^>]*>([^<]+)<\/span>/g;
  let m;
  while ((m = re.exec(block[1])) !== null) {
    const name = (m[2] || m[3] || "").trim();
    if (!name) continue;
    const href = m[1];
    const item = href
      ? `${SITE}/${href.replace(/^\//, "").replace(/index\.html$/, "").replace(/\.html$/, "")}`
      : undefined;
    items.push({ "@type": "ListItem", position: items.length + 1, name, ...(item ? { item } : {}) });
  }
  return items.length >= 2
    ? { "@type": "BreadcrumbList", itemListElement: items }
    : null;
}

const text = (html) =>
  html
    .replace(/<svg[\s\S]*?<\/svg>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Build FAQPage from the accordion the page already renders. Same reasoning
 * as breadcrumbs: Google requires FAQ markup to match visible content, and
 * deriving it from the markup makes that true by construction rather than by
 * someone remembering to update two places.
 */
export function faqFrom(html) {
  // Split on the item boundary rather than trying to match the closing
  // nesting: each chunk then holds exactly one question and one answer, and
  // text() strips whatever tags come along for the ride.
  const chunks = html.split(/<div class="faq-item">/).slice(1);
  const items = [];
  for (const chunk of chunks) {
    const q = chunk.match(/<button[^>]*class="faq-q"[^>]*>([\s\S]*?)<\/button>/);
    const a = chunk.match(/<div class="faq-a-inner">([\s\S]*)/);
    if (!q || !a) continue;
    const name = text(q[1]);
    const answer = text(a[1]);
    if (name && answer) {
      items.push({
        "@type": "Question",
        name,
        acceptedAnswer: { "@type": "Answer", text: answer },
      });
    }
  }
  return items.length ? { "@type": "FAQPage", mainEntity: items } : null;
}

const app = (name, description, extra = {}) => ({
  "@type": "SoftwareApplication",
  name,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description,
  provider: { "@id": `${SITE}/#org` },
  ...extra,
});

const offer = (name, price, description) => ({
  "@type": "Offer",
  name,
  price: String(price),
  priceCurrency: "INR",
  ...(Number(price) > 0 ? { priceValidUntil: "2027-12-31" } : {}),
  availability: "https://schema.org/InStock",
  url: `${SITE}/pricing`,
  description,
});

/** Page-specific node, keyed by the page's file name in /dist. */
const PAGE_NODES = {
  "index.html": () =>
    app("Weflux", "Send WhatsApp broadcasts and customer messages on the official WhatsApp Business API. Shared team inbox, template campaigns, no-code automation and Cloud API access.", {
      url: `${SITE}/`,
    }),

  "pricing.html": () =>
    app("Weflux", "WhatsApp Business Platform with a shared inbox, broadcasts, automation, campaigns and integrations.", {
      url: `${SITE}/pricing`,
      offers: [
        offer("Free", 0, "1 WhatsApp number, 1 team member, 500 contacts, shared inbox, 3 templates."),
        offer("Basic", 999, "1 WhatsApp number, 3 team members, unlimited contacts, 5 automations, 1 Google Sheet, broadcast campaigns, WhatsApp Calling, WhatsApp Authentication."),
        offer("Pro", 2499, "2 WhatsApp numbers, 5 team members, unlimited contacts, 15 automations, 3 Google Sheets, advanced segmentation, broadcast scheduling, webhooks, priority support."),
        offer("Scale", 4999, "5 WhatsApp numbers, 10 team members, unlimited contacts, 25 automations, 5 Google Sheets, advanced segmentation, broadcast scheduling, webhooks, priority support."),
      ],
    }),

  "features.html": () =>
    app("Weflux", "Broadcast campaigns, multi-agent shared inbox, no-code automation flows, WhatsApp CRM and analytics on the official WhatsApp Business API.", { url: `${SITE}/features` }),

  "broadcasts.html": () =>
    app("Weflux Broadcasts", "Send WhatsApp broadcast campaigns and bulk messages on approved Business API templates, with scheduling, segmentation and delivery reporting.", { url: `${SITE}/broadcasts` }),

  "automations.html": () =>
    app("Weflux Automations", "No-code WhatsApp automation: triggered auto-replies, drip sequences, cart recovery and appointment reminders.", { url: `${SITE}/automations` }),

  "shared-inbox.html": () =>
    app("Weflux Shared Inbox", "Multi-agent shared WhatsApp inbox with conversation assignment, internal notes, quick replies and response-time tracking.", { url: `${SITE}/shared-inbox` }),

  "whatsapp-crm.html": () =>
    app("Weflux CRM", "WhatsApp CRM with contact attributes, tags, lead stages, segmentation and full conversation history.", { url: `${SITE}/whatsapp-crm` }),

  "platform.html": () => ({
    "@type": "Service",
    name: "Weflux WhatsApp Business Platform",
    serviceType: "WhatsApp Business API platform",
    provider: { "@id": `${SITE}/#org` },
    areaServed: { "@type": "Country", name: "India" },
    url: `${SITE}/platform`,
    description: "Messaging infrastructure built directly on the Meta WhatsApp Cloud API, with role-based access control and REST API access.",
  }),

  "contact.html": () => ({
    "@type": "ContactPage",
    url: `${SITE}/contact`,
    about: { "@id": `${SITE}/#org` },
    mainEntity: {
      "@type": "ContactPoint",
      email: "hello@weflux.in",
      contactType: "sales",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
  }),

  "about.html": () => ({
    "@type": "AboutPage",
    url: `${SITE}/about`,
    mainEntity: { "@id": `${SITE}/#org` },
  }),

  "weflux-guide.html": () => ({
    "@type": "TechArticle",
    headline: "Weflux - The Complete Guide",
    url: `${SITE}/weflux-guide`,
    description: "A plain-English handbook for every screen, setting, automation and broadcast in Weflux.",
    publisher: { "@id": `${SITE}/#org` },
    inLanguage: "en-IN",
  }),

  "docs.html": () => ({
    "@type": "TechArticle",
    headline: "WhatsApp Business API Documentation",
    url: `${SITE}/docs`,
    description: "REST API and webhook reference for sending WhatsApp broadcasts and templates through Weflux.",
    publisher: { "@id": `${SITE}/#org` },
  }),
};

// The industry pages are all the same shape: a Service, aimed at one sector,
// offered in India. Generated rather than listed one by one.
const INDUSTRIES = {
  "whatsapp-for-ecommerce": ["WhatsApp for D2C and e-commerce", "Cart recovery, COD confirmation and order updates on the official WhatsApp Business API."],
  "whatsapp-for-healthcare": ["WhatsApp for healthcare", "Appointment confirmations, reminders, report delivery and refill flows for clinics."],
  "whatsapp-for-education": ["WhatsApp for education", "Admission funnels, fee reminders and parent communication for schools, colleges and EdTech."],
  "whatsapp-for-financial-services": ["WhatsApp for financial services", "Authentication messages, statements, payment reminders and document collection with access control."],
  "whatsapp-for-logistics": ["WhatsApp for logistics and travel", "Shipment tracking, delivery rescheduling and itinerary updates in multiple languages."],
  "whatsapp-for-agencies": ["WhatsApp for agencies and partners", "Per-client workspaces, pass-through billing and official API access without BSP infrastructure."],
};
for (const [slug, [name, description]] of Object.entries(INDUSTRIES)) {
  PAGE_NODES[`${slug}.html`] = () => ({
    "@type": "Service",
    name,
    serviceType: "WhatsApp Business API platform",
    provider: { "@id": `${SITE}/#org` },
    areaServed: { "@type": "Country", name: "India" },
    url: `${SITE}/${slug}`,
    description,
  });
}

// Two reference guides that are not product pages.
PAGE_NODES["whatsapp-message-templates.html"] = () => ({
  "@type": "TechArticle",
  headline: "WhatsApp Message Templates: Categories, Rules and Examples",
  url: `${SITE}/whatsapp-message-templates`,
  description: "How WhatsApp message templates work: the three categories, why templates get rejected, formatting rules and examples.",
  publisher: { "@id": `${SITE}/#org` },
  inLanguage: "en-IN",
});
PAGE_NODES["whatsapp-green-tick.html"] = () => ({
  "@type": "TechArticle",
  headline: "WhatsApp Green Tick: How to Get Verified in India",
  url: `${SITE}/whatsapp-green-tick`,
  description: "How the WhatsApp Official Business Account badge works, how it differs from Business Verification, and how to apply.",
  publisher: { "@id": `${SITE}/#org` },
  inLanguage: "en-IN",
});

/** The @graph for one page, or null if the page takes no schema. */
export function schemaFor(rel, html) {
  const nodes = [orgNode(), websiteNode()];

  const crumbs = breadcrumbFrom(html);
  if (crumbs) nodes.push(crumbs);

  const faq = faqFrom(html);
  if (faq) nodes.push(faq);

  const pageNode = PAGE_NODES[rel];
  if (pageNode) nodes.push(pageNode());

  return { "@context": "https://schema.org", "@graph": nodes };
}

/** Insert the graph just before </head>. */
export function injectSchema(html, rel) {
  const graph = schemaFor(rel, html);
  const tag = `<script type="application/ld+json">${esc(JSON.stringify(graph))}</script>\n`;
  return html.replace("</head>", `  ${tag}</head>`);
}
