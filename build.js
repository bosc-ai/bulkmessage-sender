/* =========================================================
   Weflux - static site build
   Copies the hand-written site into /dist and generates
   themed pages from Markdown in /content (blog, articles,
   help, resources) + a fresh sitemap.xml.

   Publishing flow: edit Markdown via Pages CMS -> commit to
   GitHub -> Vercel runs `node build.js` -> pages go live.
   No hand-editing of HTML required.
   ========================================================= */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";
import { SITE, esc, fmtDate, readTime, absUrl, DEFAULT_OG, HEAD_LINKS, renderPostPage } from "./lib/postTemplate.js";
import { injectShell } from "./lib/shell.js";
import { injectSchema } from "./lib/schema.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");

marked.setOptions({ mangle: false, headerIds: false });

// ---- Collections (each = one publishable section + footer link) ----
const COLLECTIONS = [
  { key: "blog",      dir: "blog",      list: "blog.html",      title: "Blog",         eyebrow: "Field notes",
    lede: "Guides, playbooks and field notes on WhatsApp marketing, broadcasts and customer communication." },
  { key: "articles",  dir: "articles",  list: "articles.html",  title: "Articles",     eyebrow: "Articles",
    lede: "In-depth articles on the WhatsApp Business API, broadcast strategy and growing with WhatsApp." },
  { key: "case-studies", dir: "case-studies", list: "case-studies.html", title: "Case Studies", eyebrow: "Case studies",
    lede: "How businesses grow revenue and retention with WhatsApp broadcasts and the official Business API." },
  { key: "help",      dir: "help",      list: "help.html",      title: "Help Center",  eyebrow: "Help Center",
    lede: "How-to guides and answers for setting up and running Weflux on the WhatsApp Business API." },
  { key: "resources", dir: "resources", list: "resources.html", title: "Resources",    eyebrow: "Resources",
    lede: "Templates, checklists and resources to help you get more from WhatsApp broadcasts and customer engagement." },
];

// Intro copy for each listing page. A grid of cards with a one-line lede is
// not a page; these give the section something to rank on and something for a
// retrieval crawler to quote.
const COLLECTION_INTROS = {"blog": "Field notes on running WhatsApp as a sales and support channel: what works, what gets your number restricted, and the arithmetic behind both. Written from operating the platform rather than from a keyword list.", "articles": "Longer pieces on the WhatsApp Business API itself. How the platform actually behaves, what Meta's rules mean in practice, and how to decide between the options in front of you.", "case-studies": "How businesses use WhatsApp to move a number they care about. We publish a story only when the customer has agreed to be named and the figures are theirs.", "help": "Setup guides and answers for running Weflux on the WhatsApp Business API. Connecting a number, getting templates approved, building flows, and what to do when something is rejected.", "resources": "Templates, checklists and worked examples you can use directly. Message template wording by industry, campaign checklists, and the questions to ask a provider before you sign."};
for (const c of COLLECTIONS) c.intro = COLLECTION_INTROS[c.key] || "";

// Files/dirs in the repo root that should NOT be copied into /dist.
const SKIP_COPY = new Set([
  "dist", "content", "node_modules", ".git", ".github", ".claude", ".vscode",
  "build.js", "package.json", "package-lock.json", "vercel.json", ".pages.yml",
  "README.md", "SEO-AEO-BRIEF.md", ".gitignore", ".DS_Store", "sitemap.xml",
  "api", "lib", // serverless functions + their shared code - bundled by Vercel, not static
  "blog-editor.html", "ADMIN-SETUP.md", // local tools/docs - not published to the live site
  "contact-form.gs", "CONTACT-FORM-SETUP.md", // server-side glue + docs - not static assets
  "lead-capture-form.gs", "LEAD-CAPTURE-SETUP.md", // Google Apps Script + docs - not static assets

  ...COLLECTIONS.map((c) => c.list), // listing pages are generated
]);

// Body can be HTML (from the /admin dashboard - `format: html` in frontmatter)
// or Markdown (legacy posts / Pages CMS). Render each faithfully.
function renderBody(data, content) {
  return data.format === "html" ? content : marked.parse(content);
}

// ---------- Templates ----------
function listPage(col, posts) {
  const cards = posts.length
    ? `<div class="blog-grid">
${posts
  .map(
    (p) => `        <a class="blog-card" href="/${col.dir}/${p.slug}"><div class="cover${p.cover ? " " + p.cover : ""}">${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.imageAlt || p.title)}" loading="lazy">` : ""}</div><div class="body"><div class="cat">${esc([p.category, p.readTime].filter(Boolean).join(" · "))}</div><h3>${esc(p.title)}</h3><p class="excerpt">${esc(p.description)}</p><div class="meta"><span>${esc(p.author || "Weflux Team")}</span><span>${esc(p.dateLabel)}</span></div></div></a>`
  )
  .join("\n")}
      </div>`
    : `<div style="text-align:center;padding:64px 0;color:var(--muted)"><p>New ${esc(col.title.toLowerCase())} coming soon.</p></div>`;

  const url = `${SITE}/${col.dir}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(col.title)} - WhatsApp Automation | Weflux</title>
  <meta name="description" content="${esc(col.lede)}">
  <link rel="canonical" href="${url}">
  <meta property="og:title" content="${esc(col.title)} | Weflux">
  <meta property="og:description" content="${esc(col.lede)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="Weflux">
  <meta property="og:image" content="${DEFAULT_OG}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${DEFAULT_OG}">${HEAD_LINKS}
</head>
<body data-page="${col.key}">
  <div id="wc-nav"></div>
  <main id="main" class="page">
    <section class="container page-hero">
      <div class="crumb"><a href="/">Home</a> <span class="sep">/</span> <span>${esc(col.title)}</span></div>
      <span class="eyebrow"><span class="dot"></span> ${esc(col.eyebrow)}</span>
      <h1>${esc(col.title)}</h1>
      <p class="lede">${esc(col.lede)}</p>
    </section>
    <section class="container" style="padding-bottom:8px">
      <div class="prose" style="max-width:760px">
        <p>${esc(col.intro)}</p>
      </div>
    </section>
    <section class="container" style="padding-bottom:96px">
      ${cards}
    </section>
  </main>
  <div id="wc-footer"></div>
  <script src="/shell.js"></script>
</body>
</html>
`;
}

// ---------- Build ----------
function copyStatic() {
  for (const entry of fs.readdirSync(ROOT)) {
    if (SKIP_COPY.has(entry)) continue;
    fs.cpSync(path.join(ROOT, entry), path.join(DIST, entry), { recursive: true });
  }
}

function loadPosts(col) {
  const dir = path.join(ROOT, "content", col.dir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf-8");
      const { data, content } = matter(raw);
      if (data.draft) return null;
      const base = data.slug || f.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
      const slug = base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      return {
        slug,
        title: data.title || slug,
        description: data.description || "",
        metaTitle: data.meta_title || "",
        keywords: Array.isArray(data.keywords) ? data.keywords.join(", ") : (data.keywords || ""),
        tags: Array.isArray(data.tags) ? data.tags.join(", ") : (data.tags || ""),
        faqs: Array.isArray(data.faqs) ? data.faqs.filter(f => f && f.q && f.a) : [],
        imageAlt: data.image_alt || "",
        date: data.date ? new Date(data.date).toISOString().slice(0, 10) : "",
        dateLabel: fmtDate(data.date),
        author: data.author || "",
        category: data.category || "",
        cover: { dark: "v2", cream: "v3", v2: "v2", v3: "v3" }[data.cover] || "",
        readTime: data.readTime || readTime(content),
        image: data.image || "",
        html: renderBody(data, content),
      };
    })
    .filter(Boolean)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Walk every page in /dist and render the nav + footer as real HTML.
// Runs last so it covers both copied root pages and generated posts.
function renderShells() {
  const pages = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.name.endsWith(".html")) pages.push(full);
    }
  })(DIST);

  let done = 0;
  let schema = 0;
  for (const file of pages) {
    const rel = path.relative(DIST, file);
    let html = fs.readFileSync(file, "utf-8");
    const hasShellHost = html.includes('id="wc-nav"');
    if (hasShellHost) {
      html = injectShell(html, EMPTY_COLLECTIONS);
      done++;
    }
    // Generated posts already carry their own Article/FAQ graph from
    // postTemplate.js; only the hand-written pages need one.
    // Generated posts already carry their own Article/FAQ graph from
    // postTemplate.js; only the hand-written root pages need one.
    const schemaAdded = !NOT_INDEXED.has(rel) && !rel.includes("/") && !rel.startsWith("admin");
    if (schemaAdded) {
      html = injectSchema(html, rel);
      schema++;
    }
    if (hasShellHost || schemaAdded) fs.writeFileSync(file, html);
  }
  return { total: pages.length, done, schema };
}

// A page with no crawlable nav is invisible to every AI crawler and
// costs Googlebot a render pass. Fail the build rather than ship it.
function assertCrawlable() {
  const problems = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.name.endsWith(".html")) {
        const html = fs.readFileSync(full, "utf-8");
        const rel = path.relative(DIST, full);
        if (NOT_INDEXED.has(rel) || rel.startsWith("admin/") || rel.startsWith("assets/")) continue;
        if (!NO_SHELL.has(rel)) {
          if (!html.includes('id="wc-nav-el"')) problems.push(`${rel}: no static <nav>`);
          if (!html.includes("footer-disclaimer")) problems.push(`${rel}: no static <footer>`);
        }
        const h1 = (html.match(/<h1[\s>]/gi) || []).length;
        if (h1 !== 1) problems.push(`${rel}: ${h1} <h1> (expected exactly 1)`);
        if (!/rel="canonical"/.test(html)) problems.push(`${rel}: no canonical`);
        if (!/property="og:title"/.test(html)) problems.push(`${rel}: no og:title`);
        const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
        if (!ld.length) problems.push(`${rel}: no structured data`);
        for (const [, raw] of ld) {
          try {
            JSON.parse(raw);
          } catch (e) {
            problems.push(`${rel}: invalid JSON-LD (${e.message})`);
          }
        }
        const orgs = (html.match(/"@type":\s*"Organization"/g) || []).length;
        if (orgs > 1) problems.push(`${rel}: Organization defined ${orgs} times`);
      }
    }
  })(DIST);

  if (problems.length) {
    console.error("\nBuild failed - crawlability checks:\n" + problems.map((p) => "  " + p).join("\n"));
    process.exit(1);
  }
}

// Not indexed, so none of the checks apply: app redirects, the offline
// fallback and the Meta review demo.
const NOT_INDEXED = new Set([
  "dashboard.html", "register.html", "signin.html", "signup.html",
  "app-review-demo.html", "weflux-promo.html", "offline.html",
]);

// Indexed, but carries its own inline CSS and internal chapter nav rather
// than the site shell. It links back to the site through its own footer.
const NO_SHELL = new Set(["weflux-guide.html"]);

async function run() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  copyStatic();

  const urls = [];
  for (const col of COLLECTIONS) {
    const posts = loadPosts(col);
    fs.mkdirSync(path.join(DIST, col.dir), { recursive: true });
    for (const p of posts) {
      fs.writeFileSync(path.join(DIST, col.dir, `${p.slug}.html`), renderPostPage(col, p));
      urls.push({ loc: `${SITE}/${col.dir}/${p.slug}`, lastmod: p.date || undefined, pr: "0.6", cf: "monthly" });
    }
    // A listing page with nothing on it is a soft 404. Do not publish it, do
    // not put it in the sitemap, and do not link it from the footer.
    if (!posts.length) {
      EMPTY_COLLECTIONS.add(col.dir);
      console.log(`  ${col.list.padEnd(15)} 0 post(s) - section not published`);
      continue;
    }
    // vercel.json holds a temporary redirect for any section that was empty
    // when it was added. If posts now exist, that redirect would shadow this
    // page, so say so loudly rather than silently serving a redirect.
    if (REDIRECTED_WHEN_EMPTY.has(col.dir)) {
      console.warn(`  WARNING: /${col.dir} has ${posts.length} post(s) but vercel.json still redirects it. Remove that redirect.`);
    }
    fs.writeFileSync(path.join(DIST, col.list), listPage(col, posts));
    urls.push({ loc: `${SITE}/${col.dir}`, pr: "0.7", cf: "weekly" });
    console.log(`  ${col.list.padEnd(15)} ${posts.length} post(s)`);
  }

  writeLlmsFull();
  const shells = renderShells();
  console.log(`  shell           ${shells.done}/${shells.total} page(s)`);
  console.log(`  schema          ${shells.schema} page(s)`);

  writeSitemap(urls);
  assertCrawlable();
  await pingIndexNow();
  console.log(`Build complete -> ${path.relative(ROOT, DIST)}/`);
}

// Populated by writeSitemap, consumed by pingIndexNow.
let SUBMITTED_URLS = [];

// Collections with no published posts this build. Their footer links are
// dropped so we never link to a page that does not exist.
const EMPTY_COLLECTIONS = new Set();

// Sections that have a temporary redirect in vercel.json because they were
// empty. Kept in sync by hand; the build warns if one gains posts.
const REDIRECTED_WHEN_EMPTY = new Set(["case-studies"]);

// IndexNow key. The file must be reachable at ${SITE}/${INDEXNOW_KEY}.txt and
// contain exactly the key. The key is public by design, that is the protocol.
const INDEXNOW_KEY = "5252890d487ac855bbc0f82402ca2a9c";

/**
 * Tell Bing (and Yandex, Naver, Seznam) which URLs exist, instead of waiting
 * to be crawled. Production deploys only: a preview build should not be
 * announcing URLs, and a local build definitely should not.
 *
 * Never fails the build. A search engine being unreachable is not a reason to
 * refuse to ship a site.
 */
async function pingIndexNow() {
  if (process.env.VERCEL_ENV !== "production") {
    console.log("  indexnow        skipped (not a production deploy)");
    return;
  }
  const host = new URL(SITE).host;
  const body = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`,
    urlList: SUBMITTED_URLS,
  };
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    });
    console.log(`  indexnow        ${res.status} for ${SUBMITTED_URLS.length} url(s)`);
  } catch (err) {
    console.log(`  indexnow        skipped (${err.message})`);
  }
}

// Every article as one plain-text file. Retrieval crawlers do not run
// JavaScript and mostly do not want our CSS; this hands them the corpus
// directly. llms.txt (the curated map) is hand-written and copied as-is.
function writeLlmsFull() {
  const parts = [
    "# Weflux - full content",
    "",
    "Every published article from https://www.weflux.in, as plain text.",
    "The curated site map is at https://www.weflux.in/llms.txt",
    "",
  ];
  for (const col of COLLECTIONS) {
    for (const p of loadPosts(col)) {
      parts.push(
        `---`,
        `# ${p.title}`,
        `URL: ${SITE}/${col.dir}/${p.slug}`,
        p.date ? `Date: ${p.date}` : "",
        p.description ? `Summary: ${p.description}` : "",
        "",
        p.html.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim(),
        ""
      );
    }
  }
  fs.writeFileSync(path.join(DIST, "llms-full.txt"), parts.filter((l) => l !== "").join("\n") + "\n");
}

function writeSitemap(collectionUrls) {
  const today = new Date().toISOString().slice(0, 10);
  // Curated static pages (kept in sync with the hand-written site).
  const statics = [
    ["", "1.0", "weekly"],
    ["features.html", "0.9", "weekly"],
    ["pricing.html", "0.9", "weekly"],
    ["broadcasts.html", "0.9", "weekly"],
    ["automations.html", "0.9", "weekly"],
    ["shared-inbox.html", "0.9", "weekly"],
    ["whatsapp-crm.html", "0.9", "weekly"],
    ["comparison.html", "0.9", "weekly"],
    ["whatsapp-message-templates.html", "0.8", "monthly"],
    ["whatsapp-green-tick.html", "0.8", "monthly"],
    ["use-cases.html", "0.8", "monthly"],
    ["whatsapp-for-ecommerce.html", "0.8", "monthly"],
    ["whatsapp-for-healthcare.html", "0.8", "monthly"],
    ["whatsapp-for-education.html", "0.8", "monthly"],
    ["whatsapp-for-financial-services.html", "0.8", "monthly"],
    ["whatsapp-for-logistics.html", "0.8", "monthly"],
    ["whatsapp-for-agencies.html", "0.8", "monthly"],
    ["platform.html", "0.8", "monthly"],
    ["customers.html", "0.7", "monthly"],
    ["about.html", "0.6", "monthly"],
    ["contact.html", "0.7", "monthly"],
    ["docs.html", "0.6", "monthly"],
    ["weflux-guide.html", "0.8", "weekly"],
    ["changelog.html", "0.5", "weekly"],
    ["support.html", "0.5", "monthly"],
    ["security.html", "0.5", "monthly"],
    ["status.html", "0.4", "weekly"],
    ["embedded-signup.html", "0.5", "monthly"],
    ["privacy.html", "0.3", "yearly"],
    ["terms.html", "0.3", "yearly"],
    ["cookies.html", "0.3", "yearly"],
    ["data-deletion.html", "0.3", "yearly"],
  ].map(([p, pr, cf]) => ({ loc: `${SITE}/${p.replace(/\.html$/, "")}`, lastmod: today, pr, cf }));

  const all = [...statics, ...collectionUrls];
  SUBMITTED_URLS = all.map((u) => u.loc);
  const body = all
    .map(
      (u) =>
        `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}<changefreq>${u.cf}</changefreq><priority>${u.pr}</priority></url>`
    )
    .join("\n");
  fs.writeFileSync(
    path.join(DIST, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
  );
}

run();
