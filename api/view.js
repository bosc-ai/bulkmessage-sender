// PUBLIC endpoint — pinged by each published post page to count a view.
// No session required (visitors aren't logged in). No-ops if KV isn't set up.
import { kvEnabled, kvCmd } from "../lib/kv.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const key = String(req.query.slug || "").toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 120);
  if (key && kvEnabled()) {
    try { await kvCmd("/hincrby/views/" + key + "/1"); } catch {}
  }
  res.statusCode = 204;
  res.end();
}
