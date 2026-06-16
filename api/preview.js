// POST -> renders a live-accurate preview of the post currently being edited
// (not saved, not published). Uses the exact same renderer as build.js, so
// what you see here is guaranteed to match the published page.
import { requireUser, json, readJson } from "../lib/admin.js";
import { renderPostPage, fmtDate, readTime } from "../lib/postTemplate.js";

const COLLECTIONS = {
  blog: { key: "blog", dir: "blog", title: "Blog" },
  articles: { key: "articles", dir: "articles", title: "Articles" },
  "case-studies": { key: "case-studies", dir: "case-studies", title: "Case Studies" },
  help: { key: "help", dir: "help", title: "Help Center" },
  resources: { key: "resources", dir: "resources", title: "Resources" },
};

export default async function handler(req, res) {
  const u = requireUser(req, res); if (!u) return;
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  const b = await readJson(req);
  const col = COLLECTIONS[b.collection] || COLLECTIONS.blog;
  const html = b.html || "<p><em>(Nothing written yet.)</em></p>";
  const post = {
    slug: "preview",
    title: b.title || "Untitled",
    description: b.desc || "",
    metaTitle: b.metaTitle || "",
    keywords: b.keywords || "",
    tags: b.tags || "",
    faqs: Array.isArray(b.faqs) ? b.faqs.filter((f) => f && f.q && f.a) : [],
    date: b.date || "",
    dateLabel: b.date ? fmtDate(b.date) : "",
    author: b.author || "",
    category: b.category || "",
    readTime: b.readTime || readTime(html),
    image: b.image || "",
    imageAlt: b.imageAlt || "",
    html,
  };
  const out = renderPostPage(col, post, { preview: true });
  return json(res, 200, { html: out });
}
