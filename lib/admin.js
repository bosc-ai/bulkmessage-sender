// Shared helpers for the Content Studio serverless API (/api/*).
// Holds the single server-side GitHub credential and the password/session logic.
// Writers authenticate with a username + password; the server commits on their behalf.
import crypto from "node:crypto";

export const OWNER = process.env.GH_OWNER || "bosc-ai";
export const REPO = process.env.GH_REPO || "WAchat-website";
export const BRANCH = process.env.GH_BRANCH || "main";

// ---------- HTTP helpers ----------
export function json(res, status, obj) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}
export async function readJson(req) {
  if (req.body !== undefined) return typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body;
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}
export function parseCookies(req) {
  const str = req.headers.cookie || "";
  return Object.fromEntries(
    str.split(";").map((c) => c.trim().split("=").map(decodeURIComponent)).filter((p) => p[0])
  );
}

// ---------- Sessions (signed cookie, no DB) ----------
function sign(payloadObj) {
  const secret = process.env.SESSION_SECRET || "";
  const p = Buffer.from(JSON.stringify(payloadObj)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(p).digest("base64url");
  return `${p}.${sig}`;
}
function verify(token) {
  if (!token || !token.includes(".")) return null;
  const secret = process.env.SESSION_SECRET || "";
  const [p, sig] = token.split(".");
  const expect = crypto.createHmac("sha256", secret).update(p).digest("base64url");
  const a = Buffer.from(sig), b = Buffer.from(expect);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  let payload;
  try { payload = JSON.parse(Buffer.from(p, "base64url").toString()); } catch { return null; }
  if (!payload.exp || Date.now() > payload.exp) return null;
  return payload;
}
const COOKIE = "bms_session";
export function setSession(res, user) {
  const days = 30;
  const token = sign({ u: user, exp: Date.now() + days * 864e5 });
  res.setHeader("Set-Cookie", `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${days * 86400}`);
}
export function clearSession(res) {
  res.setHeader("Set-Cookie", `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
}
export function getUser(req) {
  const payload = verify(parseCookies(req)[COOKIE]);
  return payload ? payload.u : null;
}
export function requireUser(req, res) {
  const u = getUser(req);
  if (!u) { json(res, 401, { error: "Not signed in" }); return null; }
  return u;
}

// ---------- Users (from ADMIN_USERS env) ----------
// Format: JSON map {"alice":"pass1","bob":"pass2"}  OR  csv "alice:pass1,bob:pass2".
// A password value may be "sha256:<hex>" to store a hash instead of plaintext.
function loadUsers() {
  const raw = (process.env.ADMIN_USERS || "").trim();
  if (!raw) return {};
  if (raw[0] === "{") { try { return JSON.parse(raw); } catch { return {}; } }
  const map = {};
  raw.split(",").forEach((pair) => { const i = pair.indexOf(":"); if (i > 0) map[pair.slice(0, i).trim()] = pair.slice(i + 1).trim(); });
  return map;
}
function safeEq(a, b) {
  const ba = Buffer.from(String(a)), bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}
export function verifyUser(username, password) {
  const stored = loadUsers()[username];
  if (!stored || !password) return false;
  if (stored.startsWith("sha256:")) {
    return safeEq(crypto.createHash("sha256").update(password).digest("hex"), stored.slice(7));
  }
  return safeEq(password, stored);
}

// ---------- GitHub (server-side token) ----------
export async function gh(path, opt = {}) {
  opt.headers = Object.assign(
    {
      Authorization: "Bearer " + (process.env.GITHUB_TOKEN || ""),
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    opt.headers || {}
  );
  return fetch("https://api.github.com" + path, opt);
}
export const b64decode = (b) => Buffer.from(String(b).replace(/\n/g, ""), "base64").toString("utf8");
export const b64encode = (s) => Buffer.from(s, "utf8").toString("base64");
