# RAG Bootcamp Documentation Site

## How to View

Since this site loads chapter files dynamically, you need to serve it via a local HTTP server.

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

## How to Add a New Chapter

1. Create a new file in `chapters/` (e.g., `chapters/chapter4.html`)
2. Write your chapter content as plain HTML (no `<html>`, `<head>`, or `<body>` tags needed — just content)
3. Add an entry to `chapters.js`:

```js
{
    id: "chapter4",
    title: "Chapter 4: Advanced RAG Techniques",
    description: "Hybrid search, re-ranking, and multi-step retrieval."
}
```

That's it. The sidebar, homepage, and routing update automatically.

## File Structure

```
RAG_webpages/
├── index.html          # Main shell (sidebar + content area)
├── style.css           # All styles
├── chapters.js         # Chapter config (edit this to add chapters)
├── app.js              # Router and sidebar logic
├── Asset/              # Assets like images
│   └── images.png
└── chapters/           # One HTML file per chapter
    ├── chapter1.html
    └── chapter1-1.html
```
