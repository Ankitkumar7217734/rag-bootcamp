# RAG Bootcamp Documentation Site

A static, no-build single-page documentation site for a RAG (Retrieval-Augmented
Generation) course. Dark theme, indigo accent. Each chapter is a standalone HTML
fragment loaded dynamically by a tiny hash router — no frameworks, no bundler.

## How to View

Since the site loads chapter files dynamically with `fetch`, you must serve it
over HTTP — opening `index.html` directly from the filesystem won't load chapters.

**Option 1: Python (simplest)**
```bash
cd RAG_webpages
python3 -m http.server 8000
```
Then open http://localhost:8000

**Option 2: Node.js**
```bash
npx serve .
```

The site is also published via GitHub Pages at
https://ankitkumar7217734.github.io/rag-bootcamp/

## Chapters

1. Retrieval-Augmented Generation
   - RAG vs Fine-Tuning vs Prompt Engineering
2. Core Components of RAG
   - Phase 2 & 3: Query Processing and Generation
3. Data Ingestion & Parsing
4. Vector Embeddings & Vector Databases
5. Vector Storage & Vector Databases
6. Advanced Chunking & Preprocessing — Semantic Chunking
7. Hybrid Search Strategies
   - Combining Dense & Sparse Retrieval
   - Re-Ranking Techniques
   - MMR — Maximal Marginal Relevance
8. Query Enhancement
   - Query Expansion
   - Query Decomposition
   - HyDE — Hypothetical Document Embeddings

## How to Add a New Chapter

1. Create a new fragment in `chapters/` (e.g., `chapters/chapter9.html`).
   Write it as plain HTML starting at `<h1>` — no `<html>`, `<head>`, or
   `<body>` tags.
2. Register it in `chapters.js` (the sidebar, homepage cards, and routing all
   generate from this — no other wiring needed):

```js
{
    id: "chapter9",                        // = filename + URL hash
    title: "Chapter 9: Advanced RAG Techniques",
    description: "One- to two-sentence summary for the homepage card.",
    children: [                            // OPTIONAL — only for sub-chapters
        { id: "chapter9-1", title: "…", description: "…" }
    ]
}
```

3. Update the previous chapter's forward `<nav class="page-nav">` to link here.
4. Bump the `?v=NN` cache-busting query in `index.html` if you changed
   `style.css`, `app.js`, or `chapters.js`.

> **Building chapters from source notes?** See [`CLAUDE.md`](CLAUDE.md) for the
> full authoring workflow, structure spec, design-system tokens, and SVG
> conventions.

### Sub-chapters

A child chapter uses the `chapterN-1` filename convention and is listed in the
parent's `children` array. In the sidebar, sub-chapters are **collapsed by
default** and expand when you open their parent chapter.

## File Structure

```
RAG_webpages/
├── index.html          # Shell: topbar (hamburger + brand), sidebar, content, TOC
├── style.css           # All styles + CSS variables (the design system)
├── chapters.js         # Chapter config — edit this to register chapters
├── app.js              # Hash router, sidebar toggle, TOC, copy buttons, highlight
├── CLAUDE.md           # Authoring guide for building new chapters
├── Asset/              # Images
└── chapters/           # One HTML fragment per chapter
    ├── chapter1.html
    ├── chapter1-1.html # "-1" suffix = sub-chapter (child)
    └── …
```

## How It Works

- **Routing** is hash-based (`#chapter7`); `app.js` listens for `hashchange`,
  fetches `chapters/<id>.html`, and injects it.
- After injecting a chapter, `app.js` builds the "On this page" TOC from the
  `<h2>`/`<h3>` headings, syntax-highlights `<pre>` blocks (highlight.js), and
  adds Copy buttons.
- The **hamburger** toggles the sidebar on all screen sizes (collapse state is
  remembered in `localStorage`). On mobile (≤860px) the sidebar is an off-canvas
  drawer. The "RAG Bootcamp" brand text links to the homepage.
