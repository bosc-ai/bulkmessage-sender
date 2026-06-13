// Session-gated — returns per-post view counts for the dashboard.
import { requireUser, json } from "../lib/admin.js";
import { kvEnabled, kvCmd } from "../lib/kv.js";

export default async function handler(req, res) {
  const u = requireUser(req, res); if (!u) return;
  if (!kvEnabled()) return json(res, 200, { enabled: false, views: {}, total: 0 });
  try {
    const arr = (await kvCmd("/hgetall/views")) || [];
    const views = {}; let total = 0;
    for (let i = 0; i < arr.length; i += 2) {
      const n = parseInt(arr[i + 1], 10) || 0;
      views[arr[i]] = n; total += n;
    }
    return json(res, 200, { enabled: true, views, total });
  } catch {
    return json(res, 200, { enabled: false, views: {}, total: 0 });
  }
}
