/* =========================================================
   Weflux — static site build
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

// Files/dirs in the repo root that should NOT be copied into /dist.
const SKIP_COPY = new Set([
  "dist", "content", "node_modules", ".git", ".github", ".claude", ".vscode",
  "build.js", "package.json", "package-lock.json", "vercel.json", ".pages.yml",
  "README.md", ".gitignore", ".DS_Store", "sitemap.xml",
  "api", "lib", // serverless functions + their shared code — bundled by Vercel, not static
  "blog-editor.html", "ADMIN-SETUP.md", // local tools/docs — not published to the live site
  "contact-form.gs", "CONTACT-FORM-SETUP.md", // server-side glue + docs — not static assets

  ...COLLECTIONS.map((c) => c.list), // listing pages are generated
]);

// Body can be HTML (from the /admin dashboard — `format: html` in frontmatter)
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
  <title>${esc(col.title)} — WhatsApp Automation | Weflux</title>
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

function run() {
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
    fs.writeFileSync(path.join(DIST, col.list), listPage(col, posts));
    urls.push({ loc: `${SITE}/${col.dir}`, pr: "0.7", cf: "weekly" });
    console.log(`  ${col.list.padEnd(15)} ${posts.length} post(s)`);
  }

  writeSitemap(urls);
  console.log(`Build complete -> ${path.relative(ROOT, DIST)}/`);
}

function writeSitemap(collectionUrls) {
  const today = new Date().toISOString().slice(0, 10);
  // Curated static pages (kept in sync with the hand-written site).
  const statics = [
    ["", "1.0", "weekly"],
    ["features.html", "0.9", "weekly"],
    ["pricing.html", "0.9", "weekly"],
    ["use-cases.html", "0.8", "monthly"],
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
