// Shared post-page renderer — used by both build.js (real publish) and
// api/preview.js (live preview in the editor), so a preview is guaranteed
// to look exactly like the published page.
export const SITE = "https://bulkmessagesender.com";

export const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
export function fmtDate(d) {
  const dt = d ? new Date(d) : null;
  if (!dt || isNaN(dt)) return "";
  return `${dt.getDate()} ${MONTHS[dt.getMonth()]} ${dt.getFullYear()}`;
}
export function readTime(html) {
  const words = String(html || "").replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

// Make a possibly-relative image URL absolute (required for og:image/twitter:image to work).
export function absUrl(s) {
  if (!s) return "";
  if (s.startsWith("/")) s = SITE + s;
  return /^https?:\/\//.test(s) ? s : "";
}
export const DEFAULT_OG = `${SITE}/assets/wachat-logo.png`;
// First image in a post's rendered HTML, absolute-ised — used as a fallback og:image.
export function firstImg(html) {
  const m = /<img[^>]+src="([^"]+)"/i.exec(html || "");
  return m ? absUrl(m[1]) : "";
}

export const HEAD_LINKS = `
  <link rel="icon" href="/assets/wachat-logo.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css">`;

// col: {key, dir, title}  post: {slug,title,description,metaTitle,keywords,tags,faqs,
//   date,dateLabel,author,category,readTime,image,imageAlt,html}
// opts.preview: render a "not published yet" banner + <base> tag so it renders correctly
//   when opened standalone (document.write into a blank tab) instead of at its real URL.
export function renderPostPage(col, post, opts = {}) {
  const preview = !!opts.preview;
  const url = `${SITE}/${col.dir}/${post.slug}`;
  const ogImage = absUrl(post.image) || firstImg(post.html) || DEFAULT_OG;
  const metaLine = [post.author, post.dateLabel, post.readTime].filter(Boolean).join(" · ");
  const pageTitle = post.metaTitle || post.title;
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description || "",
    image: ogImage,
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
  const faqJsonld = post.faqs && post.faqs.length ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faqs.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
  }) : "";
  const faqSection = post.faqs && post.faqs.length ? `
      <section class="post-faqs" style="max-width:760px;margin:56px auto 0">
        <h2 style="font-size:22px;font-weight:700;margin:0 0 20px;letter-spacing:-.02em">Frequently Asked Questions</h2>
        <div class="post-faq-list">
          ${post.faqs.map((f) => `<details class="post-faq-item">
            <summary class="post-faq-q">${esc(f.q)}</summary>
            <div class="post-faq-a">${esc(f.a)}</div>
          </details>`).join("\n          ")}
        </div>
      </section>` : "";
  // Cover image hero — only when a dedicated cover image was uploaded (not the
  // in-body firstImg fallback, which already appears once inside the article).
  const coverHero = post.image ? `
      <div style="max-width:760px;margin:0 auto 32px">
        <img src="${esc(absUrl(post.image))}" alt="${esc(post.imageAlt || post.title)}" style="width:100%;height:auto;border-radius:16px;display:block" loading="eager">
      </div>` : "";
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  ${preview ? `<base href="${SITE}/">\n  <meta name="robots" content="noindex">` : ""}
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(pageTitle)} | BulkMessageSender</title>
  <meta name="description" content="${esc(post.description)}">
  ${post.keywords ? `<meta name="keywords" content="${esc(post.keywords)}">` : ""}
  <link rel="canonical" href="${url}">
  <meta property="og:title" content="${esc(pageTitle)}">
  <meta property="og:description" content="${esc(post.description)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="BulkMessageSender">
  <meta property="og:image" content="${esc(ogImage)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${esc(ogImage)}">
  ${post.date ? `<meta property="article:published_time" content="${post.date}">` : ""}
  ${post.author ? `<meta property="article:author" content="${esc(post.author)}">` : ""}${HEAD_LINKS}
  <script type="application/ld+json">${JSON.stringify(jsonld)}</script>
  ${faqJsonld ? `<script type="application/ld+json">${faqJsonld}</script>` : ""}
</head>
<body data-page="${col.key}">
  ${preview ? `<div style="position:sticky;top:0;z-index:999;background:#10211a;color:#fff;text-align:center;font-family:'Geist',sans-serif;font-size:13px;font-weight:600;padding:9px;letter-spacing:.02em">👁 PREVIEW — this is not published yet</div>` : ""}
  <div id="wc-nav"></div>
  <main id="main" class="page">
    <section class="container page-hero" style="max-width:820px">
      <div class="crumb"><a href="/">Home</a> <span class="sep">/</span> <a href="/${col.dir}">${esc(col.title)}</a> <span class="sep">/</span> <span>${esc(post.title)}</span></div>
      ${post.category ? `<span class="eyebrow"><span class="dot"></span> ${esc(post.category)}</span>` : ""}
      <h1>${esc(post.title)}</h1>
      ${post.description ? `<p class="lede">${esc(post.description)}</p>` : ""}
      ${metaLine ? `<p style="font-family:var(--font-mono);font-size:12.5px;color:var(--muted);margin-top:8px">${esc(metaLine)}</p>` : ""}
    </section>
    <section class="container" style="padding-bottom:96px">${coverHero}
      <article class="prose" style="max-width:760px;margin:0 auto">
${post.html}
      </article>${faqSection}
      <div style="max-width:760px;margin:48px auto 0">
        <a href="/${col.dir}" class="btn btn-ghost">← Back to ${esc(col.title)}</a>
      </div>
    </section>
  </main>
  <div id="wc-footer"></div>
  <script src="/shell.js"></script>
  ${preview ? "" : `<script>try{fetch('/api/view?slug=${col.dir}__${post.slug}',{method:'POST',keepalive:true}).catch(function(){});}catch(e){}</script>`}
</body>
</html>
`;
}
