// POST {name, base64} -> commit an image to assets/uploads/<name>, returns its site URL.
import { requireUser, gh, json, readJson, OWNER, REPO, BRANCH } from "../lib/admin.js";

export default async function handler(req, res) {
  const u = requireUser(req, res); if (!u) return;
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  const { name, base64 } = await readJson(req);
  if (!name || !base64) return json(res, 400, { error: "Missing name or data" });

  const safe = String(name).replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = "assets/uploads/" + safe;
  const r = await gh(`/repos/${OWNER}/${REPO}/contents/${path}`, {
    method: "PUT",
    body: JSON.stringify({ message: `Upload ${safe} via Content Studio — ${u}`, content: base64, branch: BRANCH }),
  });
  if (!r.ok) { const j = await r.json().catch(() => ({})); return json(res, r.status, { error: j.message || "Upload failed" }); }
  return json(res, 200, { url: "/" + path });
}
