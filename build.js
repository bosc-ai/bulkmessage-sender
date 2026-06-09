/* =========================================================
   BulkMessageSender — static site build
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");
const SITE = "https://bulkmessagesender.com";

marked.setOptions({ mangle: false, headerIds: false });

// ---- Collections (each = one publishable section + footer link) ----
const COLLECTIONS = [
  { key: "blog",      dir: "blog",      list: "blog.html",      title: "Blog",         eyebrow: "Field notes",
    lede: "Guides, playbooks and field notes on WhatsApp marketing, broadcasts and bulk messaging for Indian businesses." },
  { key: "articles",  dir: "articles",  list: "articles.html",  title: "Articles",     eyebrow: "Articles",
    lede: "In-depth articles on the WhatsApp Business API, broadcast strategy and growing with WhatsApp." },
  { key: "help",      dir: "help",      list: "help.html",      title: "Help Center",  eyebrow: "Help Center",
    lede: "How-to guides and answers for setting up and running BulkMessageSender on the WhatsApp Business API." },
  { key: "resources", dir: "resources", list: "resources.html", title: "Resources",    eyebrow: "Resources",
    lede: "Templates, checklists and resources to help you get more from WhatsApp broadcasts and bulk messaging." },
];

// Files/dirs in the repo root that should NOT be copied into /dist.
const SKIP_COPY = new Set([
  "dist", "content", "node_modules", ".git", ".github", ".claude", ".vscode",
  "build.js", "package.json", "package-lock.json", "vercel.json", ".pages.yml",
  "README.md", ".gitignore", ".DS_Store", "sitemap.xml",
  ...COLLECTIONS.map((c) => c.list), // listing pages are generated
]);

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function fmtDate(d) {
  const dt = d ? new Date(d) : null;
  if (!dt || isNaN(dt)) return "";
  return `${dt.getDate()} ${MONTHS[dt.getMonth()]} ${dt.getFullYear()}`;
}
function readTime(md) {
  const words = md.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

const HEAD_LINKS = `
  <link rel="icon" href="/assets/wachat-logo.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css">`;

// ---------- Templates ----------
function postPage(col, post) {
  const url = `${SITE}/${col.dir}/${post.slug}.html`;
  const metaLine = [post.author, post.dateLabel, post.readTime].filter(Boolean).join(" · ");
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description || "",
    datePublished: post.date || undefined,
    dateModified: post.date || undefined,
    author: { "@type": post.author ? "Person" : "Organization", name: post.author || "BulkMessageSender" },
    publisher: {
      "@type": "Organization",
      name: "BulkMessageSender",
      logo: { "@type": "ImageObject", url: `${SITE}/assets/wachat-logo.png` },
    },
    mainEntityOfPage: url,
    url,
  };
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(post.title)} | BulkMessageSender</title>
  <meta name="description" content="${esc(post.description)}">
  <link rel="canonical" href="${url}">
  <meta property="og:title" content="${esc(post.title)}">
  <meta property="og:description" content="${esc(post.description)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="BulkMessageSender">
  <meta name="twitter:card" content="summary_large_image">${HEAD_LINKS}
  <script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body data-page="${col.key}">
  <div id="wc-nav"></div>
  <main id="main" class="page">
    <section class="container page-hero" style="max-width:820px">
      <div class="crumb"><a href="/index.html">Home</a> <span class="sep">/</span> <a href="/${col.list}">${esc(col.title)}</a> <span class="sep">/</span> <span>${esc(post.title)}</span></div>
      ${post.category ? `<span class="eyebrow"><span class="dot"></span> ${esc(post.category)}</span>` : ""}
      <h1>${esc(post.title)}</h1>
      ${post.description ? `<p class="lede">${esc(post.description)}</p>` : ""}
      ${metaLine ? `<p style="font-family:var(--font-mono);font-size:12.5px;color:var(--muted);margin-top:8px">${esc(metaLine)}</p>` : ""}
    </section>
    <section class="container" style="padding-bottom:96px">
      <article class="prose" style="max-width:760px;margin:0 auto">
${post.html}
      </article>
      <div style="max-width:760px;margin:48px auto 0">
        <a href="/${col.list}" class="btn btn-ghost">← Back to ${esc(col.title)}</a>
      </div>
    </section>
  </main>
  <div id="wc-footer"></div>
  <script src="/shell.js"></script>
</body>
</html>
`;
}

function listPage(col, posts) {
  const cards = posts.length
    ? `<div class="blog-grid">
${posts
  .map(
    (p) => `        <a class="blog-card" href="/${col.dir}/${p.slug}.html"><div class="cover${p.cover ? " " + p.cover : ""}"></div><div class="body"><div class="cat">${esc([p.category, p.readTime].filter(Boolean).join(" · "))}</div><h3>${esc(p.title)}</h3><p class="excerpt">${esc(p.description)}</p><div class="meta"><span>${esc(p.author || "BulkMessageSender")}</span><span>${esc(p.dateLabel)}</span></div></div></a>`
  )
  .join("\n")}
      </div>`
    : `<div style="text-align:center;padding:64px 0;color:var(--muted)"><p>New ${esc(col.title.toLowerCase())} coming soon.</p></div>`;

  const url = `${SITE}/${col.list}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(col.title)} — WhatsApp Bulk Messaging | BulkMessageSender</title>
  <meta name="description" content="${esc(col.lede)}">
  <link rel="canonical" href="${url}">
  <meta property="og:title" content="${esc(col.title)} | BulkMessageSender">
  <meta property="og:description" content="${esc(col.lede)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="BulkMessageSender">
  <meta name="twitter:card" content="summary_large_image">${HEAD_LINKS}
</head>
<body data-page="${col.key}">
  <div id="wc-nav"></div>
  <main id="main" class="page">
    <section class="container page-hero">
      <div class="crumb"><a href="/index.html">Home</a> <span class="sep">/</span> <span>${esc(col.title)}</span></div>
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
        date: data.date ? new Date(data.date).toISOString().slice(0, 10) : "",
        dateLabel: fmtDate(data.date),
        author: data.author || "",
        category: data.category || "",
        cover: { dark: "v2", cream: "v3", v2: "v2", v3: "v3" }[data.cover] || "",
        readTime: data.readTime || readTime(content),
        html: marked.parse(content),
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
      fs.writeFileSync(path.join(DIST, col.dir, `${p.slug}.html`), postPage(col, p));
      urls.push({ loc: `${SITE}/${col.dir}/${p.slug}.html`, lastmod: p.date || undefined, pr: "0.6", cf: "monthly" });
    }
    fs.writeFileSync(path.join(DIST, col.list), listPage(col, posts));
    urls.push({ loc: `${SITE}/${col.list}`, pr: "0.7", cf: "weekly" });
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
    ["changelog.html", "0.5", "weekly"],
    ["support.html", "0.5", "monthly"],
    ["security.html", "0.5", "monthly"],
    ["status.html", "0.4", "weekly"],
    ["embedded-signup.html", "0.5", "monthly"],
    ["privacy.html", "0.3", "yearly"],
    ["terms.html", "0.3", "yearly"],
    ["cookies.html", "0.3", "yearly"],
    ["data-deletion.html", "0.3", "yearly"],
  ].map(([p, pr, cf]) => ({ loc: `${SITE}/${p}`, lastmod: today, pr, cf }));

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
