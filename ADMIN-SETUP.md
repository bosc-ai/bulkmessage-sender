# Content Studio — the `/admin` dashboard for your SEO team

A branded, WordPress-Classic-style publishing dashboard at **`https://bulkmessagesender.com/admin`**.
Your team signs in with a **username + password you give them** (no GitHub account needed), writes in a
full visual editor (alignment, tables, images, hyperlinks, lists, headings), and hits **Publish** — the
post goes live on the site automatically.

It supports **Blog, Articles, Case Studies, Help Center and Resources**.

---

## How it works

The team logs in with a password. The **server** holds one GitHub key and does all the committing on
their behalf — so writers never touch GitHub, tokens, or code.

| Piece | What it is |
|---|---|
| `admin/index.html` | The dashboard (deployed at `/admin`). Editor = TinyMCE (same engine WordPress Classic used). |
| `api/login.js` | Username/password sign-in. Issues a signed session cookie. |
| `api/posts.js`, `api/save.js`, `api/delete.js`, `api/upload.js` | The content API — all gated by the login, all use the server's GitHub key. |
| `lib/admin.js` | Shared server code (sessions, password check, GitHub helper). |
| `content/<section>/*.md` | Where posts are saved. Body is stored as **HTML** with `format: html`. |
| `build.js` | Renders HTML bodies verbatim, so alignment/tables/layouts survive. Old Markdown posts still render too. |

Publish flow: **write → Publish → server commits to GitHub → Vercel rebuild → live** (~1 minute).
Every commit is stamped with the writer's username, so you can see who wrote what.

---

## One-time setup (~10 minutes) — set 3 environment variables in Vercel

Vercel → your project → **Settings → Environment Variables** → add each to **Production + Preview**, then **redeploy**.

### 1. `GITHUB_TOKEN` — lets the server publish
Create a **fine-grained personal access token**:
GitHub → **Settings → Developer settings → Fine-grained personal access tokens → Generate new token**
- **Resource owner:** `bosc-ai`
- **Repository access:** Only select repositories → **WAchat-website**
- **Permissions → Repository → Contents:** **Read and write**
- Generate, copy the `github_pat_…` value → paste as `GITHUB_TOKEN`.

> Fine-grained tokens expire (max 1 year) — set a reminder to regenerate. *(Prefer no expiry? Use a classic token with the `repo` scope instead — broader access, but never expires.)*

### 2. `SESSION_SECRET` — secures login sessions
Any long random string. Generate one with:
```
openssl rand -hex 32
```
Paste the output as `SESSION_SECRET`.

### 3. `ADMIN_USERS` — your team's logins
A JSON object of `username: password`. Example:
```json
{"riya":"Riya@2026","arjun":"BroadcastPro#7","editor":"shared-password-123"}
```
Paste that as the value of `ADMIN_USERS`. To **add or remove a writer later**, just edit this variable and redeploy.

*(Optional — store hashed passwords instead of plaintext: use `"name":"sha256:<hash>"`, where the hash is*
`printf 'thepassword' | shasum -a 256` *. Plaintext is fine too — env vars are server-side secrets, never sent to the browser.)*

---

## How your team uses it
1. Go to **`https://bulkmessagesender.com/admin`**
2. Enter the **username + password** you gave them
3. **+ New post** → pick the section, write, add images/tables/links, fill Title + Summary
4. **Publish →** (or **Save as draft** to keep it hidden)
5. Live in ~1 minute. Existing posts can be reopened and edited the same way.

---

## Notes
- **Security:** the GitHub key and `SESSION_SECRET` live only in Vercel's env (server-side, never sent to browsers). Sessions are signed cookies. The dashboard page is `noindex` and useless without a valid login.
- **Images** upload to `assets/uploads/` and commit automatically.
- **Drafts** (`draft: true`) never appear on the live site.
- The old `blog-editor.html` (a local single-file tool) still works for you personally.
- Pages CMS still works as a fallback editor; both write to the same `content/` folder.
