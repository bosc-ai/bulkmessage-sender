// POST {path, sha} -> delete a post.
import { requireUser, gh, json, readJson, OWNER, REPO, BRANCH } from "../lib/admin.js";

export default async function handler(req, res) {
  const u = requireUser(req, res); if (!u) return;
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  const { path, sha } = await readJson(req);
  if (!path || !sha) return json(res, 400, { error: "Missing path or sha" });

  const r = await gh(`/repos/${OWNER}/${REPO}/contents/${path}`, {
    method: "DELETE",
    body: JSON.stringify({ message: `Delete ${path} via Content Studio — ${u}`, sha, branch: BRANCH }),
  });
  if (!r.ok) { const j = await r.json().catch(() => ({})); return json(res, r.status, { error: j.message || "Delete failed" }); }
  return json(res, 200, { ok: true });
}
