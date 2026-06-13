// Tiny Upstash Redis (REST) helper for the view counter.
// Works with the env vars set by the Vercel "Upstash for Redis" Marketplace
// integration (KV_REST_API_* aliases) or a direct Upstash integration (UPSTASH_*).
// If neither is configured, the counter silently no-ops and the dashboard hides views.
export function kvCreds() {
  return {
    url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "",
    token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "",
  };
}
export function kvEnabled() {
  const { url, token } = kvCreds();
  return !!(url && token);
}
export async function kvCmd(path) {
  const { url, token } = kvCreds();
  const r = await fetch(url + path, { headers: { Authorization: "Bearer " + token } });
  if (!r.ok) throw new Error("kv " + r.status);
  return (await r.json()).result;
}
