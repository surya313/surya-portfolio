# Surya Prakash Reddy — Portfolio (Eleventy)

A Jamstack portfolio site built with [Eleventy (11ty)](https://www.11ty.dev/), deployed to Netlify.  
The homepage is your existing portfolio. The `/blog/` section is fully dynamic — every new post is a single Markdown file.

---

## Project Structure

```
surya-portfolio/
├── .eleventy.js          ← Eleventy configuration (collections, filters, paths)
├── netlify.toml          ← Netlify build settings
├── package.json
│
└── src/
    ├── index.njk         ← Homepage (your full portfolio)
    ├── _data/            ← Global data (add site.js here if needed)
    │
    ├── _includes/
    │   ├── layouts/
    │   │   ├── base.njk  ← HTML shell shared by every page
    │   │   └── post.njk  ← Individual blog post layout
    │   └── partials/
    │       └── nav.njk   ← Navigation bar (shared)
    │
    ├── blog/
    │   ├── index.njk                     ← /blog/ listing page (auto-generated)
    │   ├── event-driven-patterns-lloyds.md
    │   ├── amazon-q-developer-results.md
    │   └── team-lead-lessons.md
    │
    ├── css/
    │   └── main.css      ← All styles (extracted from original index.html)
    │
    └── js/
        └── main.js       ← All JavaScript (extracted from original index.html)
```

---

## Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Start local dev server (hot reload on file changes)
npm start
# → Visit http://localhost:8080

# 3. Build for production
npm run build
# → Output goes to _site/
```

---

## ✍️ How to Add a New Blog Post (The Whole Point)

**You never need to redeploy manually.** Just follow these steps:

### Step 1 — Create a Markdown file in `src/blog/`

Name it with a descriptive slug. Example:
```
src/blog/my-new-post.md
```

### Step 2 — Add frontmatter at the top

```markdown
---
layout: post.njk
title: "My Post Title"
description: "A one-sentence summary shown on the blog listing page."
date: 2026-05-01
tags:
  - blog
  - java
  - aws
---

Your post content goes here in Markdown.

## A Heading

A paragraph with **bold** and _italic_ text.

- Bullet list item
- Another item

> A blockquote

    code block
```

**Required fields:** `layout`, `title`, `date`, `tags` (must include `blog`)  
**Optional:** `description` (shown as excerpt on /blog/ listing)

### Step 3 — Push to GitHub

```bash
git add src/blog/my-new-post.md
git commit -m "Add post: My Post Title"
git push origin main
```

### Step 4 — Netlify auto-deploys

Netlify detects the push, runs `npx @11ty/eleventy`, and publishes the new build in ~30–60 seconds.

**Your new post is live.** No redeployment button, no server restart, nothing else to do.

The post automatically appears:
- At `/blog/your-slug/`
- On the `/blog/` listing page (sorted newest first)
- In the "Latest Writing" section on the homepage (top 3 posts)

---

## Deploy to Netlify

### First-time setup:
1. Push this repo to GitHub
2. Go to [netlify.com](https://netlify.com) → New site from Git
3. Select your repo
4. Netlify auto-detects the `netlify.toml` settings — just click **Deploy**
5. Set a custom domain in Site Settings → Domain management

### After that:
Every `git push` to `main` triggers an automatic rebuild and deploy.

---

## Customisation

| What | Where |
|---|---|
| Your name, title, bio | `src/index.njk` |
| Skills, experience, projects | `src/index.njk` |
| Nav links | `src/_includes/partials/nav.njk` |
| Colours / theme | `src/css/main.css` (CSS variables at top) |
| Blog post styling | `src/css/main.css` (`.post-body`, `.blog-card`) |
| Terminal AI responses | `src/js/main.js` (`demos` object in AI Terminal section) |
| Learning ticker items | `src/js/main.js` (`items` array in Learning Ticker section) |

---

## Adding Your CV

Place your CV PDF at:
```
public/Surya_CV.pdf
```

It will be available at `/Surya_CV.pdf` on your live site.

---

## Frontmatter Reference

| Field | Required | Description |
|---|---|---|
| `layout` | ✅ | Always `post.njk` for blog posts |
| `title` | ✅ | Post title (used in `<h1>` and `<title>`) |
| `date` | ✅ | `YYYY-MM-DD` — controls sort order |
| `description` | ⬜ | Excerpt shown on listing page and in meta tags |
| `tags` | ✅ | Array — must include `blog`. Add others freely |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Static Site Generator | Eleventy 3.x (11ty) |
| Templating | Nunjucks (.njk) |
| Content | Markdown (.md) with YAML frontmatter |
| Styling | Vanilla CSS (CSS custom properties) |
| JavaScript | Vanilla JS (no framework) |
| Hosting | Netlify (auto-deploy from Git) |
| Fonts | Google Fonts (Playfair Display, DM Mono, DM Sans) |
