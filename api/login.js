// POST {username,password} -> sign in (sets session cookie)
// GET    -> { user } for the current session (whoami)
// DELETE -> sign out
import { readJson, verifyUser, setSession, clearSession, getUser, json } from "../lib/admin.js";

export default async function handler(req, res) {
  if (req.method === "GET") return json(res, 200, { user: getUser(req) });
  if (req.method === "DELETE") { clearSession(res); return json(res, 200, { ok: true }); }
  if (req.method === "POST") {
    if (!process.env.SESSION_SECRET || !process.env.ADMIN_USERS)
      return json(res, 500, { error: "Server not configured yet (missing ADMIN_USERS / SESSION_SECRET)." });
    const { username, password } = await readJson(req);
    if (verifyUser(username, password)) { setSession(res, username); return json(res, 200, { user: username }); }
    return json(res, 401, { error: "Wrong username or password." });
  }
  return json(res, 405, { error: "Method not allowed" });
}
