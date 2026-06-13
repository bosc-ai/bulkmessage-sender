// Session-gated — returns per-post view counts for the dashboard.
import { requireUser, json } from "../lib/admin.js";
import { kvEnabled, kvCmd } from "../lib/kv.js";

export default async function handler(req, res) {
  const u = requireUser(req, res); if (!u) return;
  if (!kvEnabled()) return json(res, 200, { enabled: false, views: {}, total: 0, daily: [] });
  try {
    const arr = (await kvCmd("/hgetall/views")) || [];
    const views = {}; let total = 0;
    for (let i = 0; i < arr.length; i += 2) {
      const n = parseInt(arr[i + 1], 10) || 0;
      views[arr[i]] = n; total += n;
    }
    // last 7 days site-wide series for the sparkline
    const darr = (await kvCmd("/hgetall/views_daily")) || [];
    const dmap = {};
    for (let i = 0; i < darr.length; i += 2) dmap[darr[i]] = parseInt(darr[i + 1], 10) || 0;
    const daily = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      daily.push(dmap[d.toISOString().slice(0, 10)] || 0);
    }
    return json(res, 200, { enabled: true, views, total, daily });
  } catch {
    return json(res, 200, { enabled: false, views: {}, total: 0, daily: [] });
  }
}
