# Publishing content (no code needed)

Your **Blog, Articles, Help Center and Resources** are powered by Markdown files in `/content`
and built into static pages by `build.js`. You edit them through a free web editor — **Pages CMS** —
so you never touch code.

## How it flows

```
You write a post in Pages CMS  →  it commits a Markdown file to GitHub
   →  Vercel runs `node build.js`  →  the new page is live (~1–2 min)
```

## One-time setup (≈5 minutes)

1. Go to **https://app.pagescms.org** and click **Sign in with GitHub**.
2. Authorise Pages CMS for the **`bosc-ai/WAchat-website`** repository (you can limit it to just this repo).
3. Open the repo in Pages CMS. It reads `.pages.yml` and shows four collections:
   **Blog, Articles, Help Center, Resources**.
4. (Vercel) Make sure the project's **Build Command** is `node build.js` and **Output Directory** is `dist`.
   These are already set in `vercel.json`, so no action is usually needed.

That's it. From now on it's just step-by-step publishing below.

## Publishing a post

1. In Pages CMS, open the section (e.g. **Blog**) → **Add new**.
2. Fill in:
   - **Title** – the headline (also the page `<h1>` and SEO title)
   - **Summary** – 1–2 sentences (used as the SEO description and the card text)
   - **Date**, **Author**, **Category** – shown on the card and post
   - **Card cover colour** – green / dark / cream
   - **Draft** – leave on while writing; turn off to publish
   - **Body** – write your post (headings, lists, links, images)
3. Click **Save / Publish**. Pages CMS commits it; Vercel rebuilds; the page appears at
   `bulkmessagesender.com/blog/your-title.html` and on the Blog listing.

Images you upload go to `/assets/uploads` automatically.

## Editing without the CMS (optional)

You can also just add a Markdown file under `content/blog/`, `content/articles/`,
`content/help/` or `content/resources/` and push to GitHub — same result.
Filename format: `YYYY-MM-DD-some-title.md` (the date prefix is stripped from the URL).

Frontmatter example:

```markdown
---
title: "Your headline"
description: "One or two sentence summary for SEO + the card."
date: 2026-06-10
author: "Your Name"
category: "Broadcasts"
cover: green        # green | dark | cream
draft: false
---

Your post content in Markdown…
```

## Local preview (optional, for developers)

```bash
npm install
node build.js          # generates /dist
npx serve dist         # or: python3 -m http.server -d dist 8080
```

Every new post is automatically added to `sitemap.xml`, so Google can find it.
