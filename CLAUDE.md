# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> RAG Bootcamp Docs Site. The day-to-day task here is **building new chapters**
> from the user's source notes. **Read this file first, every time**, then follow
> the workflow below before writing any code.

---

## Commands

No build, no dependencies, no test suite — it's static files. The only thing you
must do is serve over HTTP, because `app.js` loads chapters with `fetch` and
opening `index.html` from `file://` will silently fail to load any chapter.

```bash
python3 -m http.server 8000      # then open http://localhost:8000
# or: npx serve .
```

Before finishing a chapter, sanity-check it (this is the only "lint" the repo
has — see the verify step in the workflow):

```bash
grep -rn $'�' chapters/      # find corrupted chars (esp. inside inline SVG); should be empty
```

Published via GitHub Pages at https://ankitkumar7217734.github.io/rag-bootcamp/
(`.nojekyll` is present so Pages serves the files as-is).

---

## What this project is

A static, no-build **single-page documentation site** for a RAG (Retrieval-
Augmented Generation) course. Dark theme, indigo accent, doc-site feel. Each
"chapter" is a standalone HTML fragment loaded dynamically by a tiny hash router.
No frameworks, no bundler — just `index.html` + `style.css` + `app.js` +
`chapters.js` + one HTML file per chapter.

The chapters are the **web version of the user's handwritten RAG bootcamp
notes**. The user gives source material (a PDF of notes, `.ipynb` notebooks,
`.txt`/data files) and asks me to turn it into the next polished chapter that
matches the existing ones.

---

## How the runtime works (the one thing that ties the files together)

`chapters.js` is the **single source of truth** — a flat `chapters` array where
each entry may carry a `children` array of sub-chapters. The sidebar, homepage
cards, and routing are all *generated* from it; registering a chapter there is
the only wiring step. There is no central route table to update.

`app.js` (loaded after `chapters.js`) is the whole engine, ~460 lines, no
dependencies except highlight.js from a CDN:

- **Routing is hash-based.** `handleRoute()` runs on `DOMContentLoaded` and on
  every `hashchange`. It reads `location.hash`, looks the id up in the flattened
  page list (`getAllPages()` walks `children`), and either `fetch`es
  `chapters/<id>.html` into `#main-content` or renders the homepage. An unknown
  hash falls through to the homepage; a fetch failure renders an inline
  "Page not found" view.
- **After each chapter injects**, `loadChapter()` runs a fixed post-process
  pipeline: `buildTOC` (scans `h2`/`h3`, assigns stable ids, wires an
  `IntersectionObserver` scroll-spy) → `highlightCode` (highlight.js,
  language auto-detected) → `addCopyButtons` (wraps each `<pre>` in a
  `.code-block` and floats a Copy button) → `wrapScrollables` (wraps each
  `<table>` and `.diagram-svg` in a `.scroll-x` div so wide tables/diagrams
  scroll horizontally on phones instead of overflowing). **This is why chapter
  fragments only need semantic HTML** — headings, `<pre>`, `<table>`, raw
  `<svg class="diagram-svg">` — and never hand-write TOC entries, ids, copy
  buttons, scroll wrappers, or `<code>` inside `<pre>`.
- **Sidebar has two modes off one hamburger** (`toggleSidebar`): desktop
  collapses it out of the layout and remembers the choice in `localStorage`
  (`sidebarCollapsed`); mobile (≤860px, `isMobileViewport()`) slides an
  off-canvas drawer over a backdrop. Sub-chapter groups auto-expand only for the
  active page.

So the data flow is: **`chapters.js` (config) → `app.js` (router + post-process)
→ `chapters/*.html` (content fragments) → `style.css` (design system)**. Cache
busting is manual: `index.html` references `style.css`/`chapters.js`/`app.js`
with a shared `?v=NN` query (currently `v=22`) — bump it when you change any of
those three.

---

## ⚡ Workflow when the user asks for "the next chapter"

Do these in order. Do **not** skip the reading steps.

1. **Read this CLAUDE.md fully.**
2. **Read every source file the user provides — all of it, not a skim:**
   - **PDF** of handwritten notes → read it with the Read tool (`pages` param if
     long). This is the primary content + the intended structure/diagrams.
   - **`.ipynb` notebooks** → `cat` them; extract the real, working code cells
     and their printed outputs. The user's actual code is the source of truth for
     code blocks — reproduce it faithfully (only fix obvious typos like
     `import numpy as py`, misspellings, missing final flush, etc.).
   - **`.txt` / data files** → read them; they're often the sample data used in
     the code examples.
3. **Read the most recent existing chapter** (latest is `chapters/chapter11.html`
   and its `chapter11-1/-2/-3` sub-chapters) to match structure, tone, and
   components exactly. Also check `chapters.js` for the current chapter list and
   the previous chapter's `<nav class="page-nav">`.
4. **Find the chapter number**: the source folders are numbered (e.g.
   `8-advanced-shanking-...`), but the **website chapter number is sequential**
   (next integer after the last entry in `chapters.js`). The folder number and
   the web chapter number do **not** have to match — follow `chapters.js`.
5. **Write `chapters/chapterN.html`** following the structure spec below.
6. **Register it in `chapters.js`** (append an entry; see format below).
7. **Update the previous chapter's forward nav** to point to the new one.
8. **Bump the cache-busting version** `?v=NN` in `index.html` for any of
   `style.css` / `app.js` / `chapters.js` you changed (always bump if `app.js`
   or `chapters.js` changed; chapter HTML files are not versioned).
9. **Verify**: no stray/garbled characters (especially in inline SVG — grep for
   the U+FFFD replacement char), nav links resolve, IDs are unique.
10. **Commit only when the user asks.** Match their style: one feature per
    commit, message like `Add Chapter N: <Title>`. Co-author trailer:
    `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

> The user wants to hand over source files and get back a finished, on-brand
> chapter without re-explaining the format. Enrich the notes where it helps
> learning (extra tables, comparisons, callouts, "why it matters" framing) — the
> user explicitly welcomes added depth as long as it stays accurate to the notes
> and code.

---

## File structure

```
RAG_webpages/
├── index.html        # Shell: topbar (hamburger + brand), sidebar, content, TOC
├── style.css         # All styles + CSS variables (the design system)
├── chapters.js       # Chapter config — edit to register a chapter
├── app.js            # Hash router, sidebar toggle, TOC, copy buttons, highlight
├── Asset/            # Images
└── chapters/
    ├── chapter1.html, chapter1-1.html   # "-1" suffix = sub-chapter (child)
    ├── chapter2.html, chapter2-1.html
    ├── chapter3.html … chapter8.html
    └── chapter7-1.html … chapter8-3.html   # sub-chapters
```

- A chapter HTML file is a **fragment**: no `<html>/<head>/<body>`, just the
  content starting with `<h1>`.
- `app.js` fetches `chapters/<id>.html` based on the URL hash, injects it, then
  builds the "On this page" TOC, syntax-highlights `<pre>` blocks (highlight.js),
  and adds Copy buttons. **Must be served over HTTP** (it uses `fetch`), e.g.
  `python3 -m http.server 8000` — opening the file directly won't load chapters.

---

## `chapters.js` entry format

Append to the `chapters` array. Sub-chapters go in a `children` array.

```js
{
    id: "chapter6",                       // = filename chapters/chapter6.html + URL hash
    title: "Chapter 6: <Short Title>",    // shown in sidebar + homepage card
    description: "One- to two-sentence summary for the homepage card.",
    children: [                            // OPTIONAL — only if there's a sub-page
        { id: "chapter6-1", title: "…", description: "…" }
    ]
}
```

The sidebar, homepage cards, and routing all generate from this — no other
registration needed.

---

## Chapter HTML structure (match this exactly)

Order and components used by every chapter:

```html
<h1>Chapter N: <Full Title></h1>
<p style="color:#888; margin-bottom: 2rem;"><em>One-line hook / framing.</em></p>

<h2>Overview</h2>
<p>…what this chapter covers and why it matters…</p>

<!-- Optional inline SVG diagram, see SVG section -->
<svg class="diagram-svg" viewBox="0 0 940 300" …> … </svg>

<div class="example-block">
  <div class="label">The Core Idea</div>
  <p>…</p>
</div>

<hr class="divider">

<h2>Section Title</h2>
<h3>Subsection</h3>
<p>… prose with <strong>bold</strong>, <em>italic</em>, <code>inline code</code> …</p>

<table>
  <thead><tr><th>…</th><th>…</th></tr></thead>
  <tbody><tr><td>…</td><td>…</td></tr></tbody>
</table>

<pre>… real code from the user's notebook (becomes a copyable, highlighted block) …</pre>

<!-- …repeat sections, separated by <hr class="divider"> … -->

<h2>Key Takeaways</h2>
<div class="example-block">
  <div class="label">Remember These Four</div>
  <p><strong>1.</strong> …</p>
  <p><strong>2.</strong> …</p>
  <p><strong>3.</strong> …</p>
  <p><strong>4.</strong> …</p>
</div>

<!-- Page Navigation — always last -->
<nav class="page-nav">
    <a href="#chapter5">← Chapter 5: <Prev Title></a>
    <span></span>   <!-- placeholder for "next" until a later chapter exists -->
</nav>
```

### Component conventions
- **Sections** are `<h2>`, subsections `<h3>`. The TOC auto-builds from `h2`/`h3`,
  so use them for every real section. IDs are auto-generated — don't hand-set.
- **Separators**: `<hr class="divider">` between major sections.
- **Callouts**: `<div class="example-block"><div class="label">LABEL</div><p>…</p></div>`
  — use for "Core Idea", tips, gotchas, and the final "Key Takeaways" box.
- **Code**: plain `<pre>…</pre>`. `app.js` auto-highlights (language auto-detected)
  and auto-adds a Copy button. Don't add `<code>` inside `<pre>`. Escape `<`,`>`,`&`
  only if they'd break HTML; normal Python code is fine as-is.
- **Tables**: standard `<thead>/<tbody>`. Used heavily for comparisons, parameter
  lists, decision guides — a signature of this site. Add them generously.
- **Inline code** in prose: `<code>…</code>`.
- **Escape ampersands** in titles/text as `&amp;` (e.g. "Embeddings &amp; …").
- **Page nav** always closes the file. Set the previous chapter's `<span></span>`
  to `<a href="#chapterN" class="next">Chapter N: <Title> →</a>` when adding the
  next chapter.

---

## Design system (from `style.css` `:root`)

Reuse these variables and inline colors so new content stays on-brand. **Dark
theme, indigo accent.**

| Token | Value | Use |
|---|---|---|
| `--bg-base` | `#0e0e10` | page background |
| `--bg-elevated` | `#16161a` | sidebar, cards, diagram boxes |
| `--bg-card` / `--bg-card-hover` | `#1a1a1f` / `#20202a` | cards |
| `--border` / `--border-strong` | `#26262c` / `#36363e` | hairlines |
| `--text-primary` | `#ececf1` | body text |
| `--text-secondary` | `#b4b4be` | secondary text |
| `--text-muted` | `#76767f` | captions, labels |
| `--accent` (indigo) | `#818cf8` | links, highlights, accents |
| `--accent-strong` | `#6366f1` | gradient end, emphasis |

**Accent palette for diagrams / emphasis** (used across existing SVGs):
- Indigo `#818cf8` / `#6366f1` — primary accent, arrows, embeddings
- Green `#4ecca3` — "good"/success/retriever steps
- Purple `#a78bfa` — LLM / secondary nodes
- Amber/yellow `#fbbf24` — thresholds, parameters, warnings
- Red `#ef6461` — breaks, failures, "✗"
- Caption/muted text in SVG: `#76767f` / `#b4b4be`

Fonts: system UI stack for prose; `monospace` for code and vector/number bits in
diagrams.

---

## Inline SVG diagrams

Most chapters include one hand-built diagram showing the chapter's flow. Pattern:

- `<svg class="diagram-svg" viewBox="0 0 940 H" xmlns="http://www.w3.org/2000/svg"
  role="img" aria-label="…describe it…">` — width ~940 to fill the column;
  `.diagram-svg` is already styled (responsive, subtle hover).
- Define an arrowhead `<marker>` with a **unique id per chapter** (e.g. `c6-arr`,
  `c5-arr`) so multiple diagrams don't collide.
- Boxes: `<rect rx="8">` filled `#16161a`/`#1a1a2e` with a colored stroke from the
  accent palette; labels as `<text>` using `font-family="system-ui"` (or
  `monospace` for vectors/numbers).
- Connect stages with `<line … marker-end="url(#cN-arr)">`.
- **Use only plain ASCII + safe glyphs** (`✓`, `✗`, `→`, `·`). After writing,
  grep the file for the replacement char (U+FFFD `�`) and fix any — corrupted
  multibyte chars sneak into SVG text easily.

---

## Top bar / sidebar behavior (already built — don't regress)

- **Hamburger** (`#sidebar-toggle`, far left of topbar) is the single sidebar
  toggle on **all** screen sizes. Brand text ("RAG Bootcamp") is the homepage
  link. The old desktop arrow handle + in-sidebar × are retired on desktop.
- Desktop: toggling collapses the sidebar out of the layout (remembered via
  `localStorage` key `sidebarCollapsed`); the reading column widens.
- Mobile (≤860px): sidebar is an off-canvas drawer with a backdrop.
- Routing is **hash-based** (`#chapterN`); `app.js` listens for `hashchange`.
  This is intentional deep-linking — keep it.

---

## Conventions / gotchas checklist

- [ ] Chapter fragment starts at `<h1>`, no document wrapper tags.
- [ ] Registered in `chapters.js` with sequential web number.
- [ ] Previous chapter's forward `page-nav` updated to link here.
- [ ] `?v=NN` bumped in `index.html` if `app.js`/`chapters.js`/`style.css` changed.
- [ ] Code blocks are real code from the user's notebook (typos fixed), in `<pre>`.
- [ ] Tables and `example-block` callouts used to aid learning.
- [ ] SVG marker id is unique; no U+FFFD characters anywhere.
- [ ] On-brand colors only (indigo accent + the palette above).
- [ ] Commit only when asked; `Add Chapter N: …`; co-author trailer included.
