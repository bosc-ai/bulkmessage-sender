// POST {path, content, sha?, oldPath?, title, draft} -> commit the post.
// Renames (path changed) delete the old file. Commit is attributed to the signed-in user.
import { requireUser, gh, json, readJson, b64encode, OWNER, REPO, BRANCH } from "../lib/admin.js";

export default async function handler(req, res) {
  const u = requireUser(req, res); if (!u) return;
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  const { path, content, sha, oldPath, title, draft } = await readJson(req);
  if (!path || !content) return json(res, 400, { error: "Missing path or content" });

  let useSha = sha;
  if (!useSha) {
    const r0 = await gh(`/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`);
    if (r0.ok) useSha = (await r0.json()).sha; // file already exists -> update it
  }

  const message = `${useSha ? "Update" : "Publish"} "${title || path}"${draft ? " (draft)" : ""} via Content Studio — ${u}`;
  const body = { message, content: b64encode(content), branch: BRANCH };
  if (useSha) body.sha = useSha;

  const r = await gh(`/repos/${OWNER}/${REPO}/contents/${path}`, { method: "PUT", body: JSON.stringify(body) });
  if (!r.ok) { const j = await r.json().catch(() => ({})); return json(res, r.status, { error: j.message || "Save failed" }); }
  const d = await r.json();

  if (oldPath && oldPath !== path) {
    const ro = await gh(`/repos/${OWNER}/${REPO}/contents/${oldPath}?ref=${BRANCH}`);
    if (ro.ok) {
      const od = await ro.json();
      await gh(`/repos/${OWNER}/${REPO}/contents/${oldPath}`, {
        method: "DELETE",
        body: JSON.stringify({ message: `Remove old path after rename via Content Studio — ${u}`, sha: od.sha, branch: BRANCH }),
      });
    }
  }
  return json(res, 200, { sha: d.content.sha, htmlUrl: d.content.html_url });
}
