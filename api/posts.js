// GET           -> { posts: [{dir,path,date,slug,title,draft}] } across all sections
// GET ?path=... -> { content, sha } raw file text for editing
import { requireUser, gh, json, b64decode, OWNER, REPO, BRANCH } from "../lib/admin.js";

const COLLS = ["blog", "articles", "case-studies", "help", "resources"];

function frontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : "";
}
function unquote(v) {
  v = (v || "").trim();
  if (/^".*"$/.test(v)) return v.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  return v;
}

export default async function handler(req, res) {
  const u = requireUser(req, res); if (!u) return;

  const path = req.query.path;
  if (path) {
    const r = await gh(`/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`);
    if (!r.ok) return json(res, r.status, { error: "Not found" });
    const d = await r.json();
    return json(res, 200, { content: b64decode(d.content), sha: d.sha });
  }

  const posts = [];
  await Promise.all(
    COLLS.map(async (dir) => {
      const r = await gh(`/repos/${OWNER}/${REPO}/contents/content/${dir}?ref=${BRANCH}`);
      if (!r.ok) return; // missing/empty dir
      const items = await r.json();
      await Promise.all(
        items.filter((f) => f.name.endsWith(".md")).map(async (f) => {
          const m = f.name.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
          let title = (m ? m[2] : f.name.replace(/\.md$/, "")).replace(/-/g, " ");
          let draft = false, category = "", image = "";
          try {
            const raw = b64decode((await gh(`/repos/${OWNER}/${REPO}/contents/${f.path}?ref=${BRANCH}`).then((x) => x.json())).content);
            const fmm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
            const fm = fmm ? fmm[1] : raw, body = fmm ? fmm[2] : "";
            const t = fm.match(/^title:\s*(.+)$/m); if (t) title = unquote(t[1]);
            draft = /^draft:\s*true\b/m.test(fm);
            const c = fm.match(/^category:\s*(.+)$/m); if (c) category = unquote(c[1]);
            const im = body.match(/<img[^>]+src="([^"]+)"/i) || body.match(/!\[[^\]]*\]\(([^)\s]+)/);
            if (im && !im[1].startsWith("blob:")) image = im[1];
          } catch {}
          posts.push({ dir, path: f.path, sha: f.sha, date: m ? m[1] : "", slug: m ? m[2] : f.name.replace(/\.md$/, ""), title, draft, category, image });
        })
      );
    })
  );
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return json(res, 200, { posts });
}
