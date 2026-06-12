// GET -> { media: [{name,url}] } — images uploaded to assets/uploads
import { requireUser, gh, json, OWNER, REPO, BRANCH } from "../lib/admin.js";

export default async function handler(req, res) {
  const u = requireUser(req, res); if (!u) return;
  const r = await gh(`/repos/${OWNER}/${REPO}/contents/assets/uploads?ref=${BRANCH}`);
  if (!r.ok) return json(res, 200, { media: [] });
  const items = await r.json();
  const media = items
    .filter((f) => /\.(png|jpe?g|gif|webp|svg)$/i.test(f.name))
    .map((f) => ({ name: f.name, url: "/assets/uploads/" + f.name }))
    .reverse();
  return json(res, 200, { media });
}
