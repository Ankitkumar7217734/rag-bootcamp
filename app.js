/**
 * Simple SPA router for the documentation site.
 * 
 * - Reads chapters from chapters.js (supports nested children)
 * - Uses URL hash for navigation (#chapter1, #chapter1-1, etc.)
 * - Loads chapter HTML from /chapters/ folder
 * - No build tools needed — just serve with a local HTTP server
 */

// Flatten chapters for routing (get all IDs including children)
function getAllPages() {
    const pages = [];
    chapters.forEach(ch => {
        pages.push(ch);
        if (ch.children) {
            ch.children.forEach(sub => pages.push(sub));
        }
    });
    return pages;
}

function buildSidebar() {
    const nav = document.getElementById('sidebar-nav');
    nav.innerHTML = '';

    chapters.forEach(ch => {
        // Parent chapter
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${ch.id}`;
        a.textContent = ch.title;
        li.appendChild(a);
        nav.appendChild(li);

        // Sub-chapters (indented)
        if (ch.children) {
            ch.children.forEach(sub => {
                const subLi = document.createElement('li');
                subLi.classList.add('sub-item');
                const subA = document.createElement('a');
                subA.href = `#${sub.id}`;
                subA.textContent = sub.title;
                subLi.appendChild(subA);
                nav.appendChild(subLi);
            });
        }
    });
}

function buildHomepage() {
    const main = document.getElementById('main-content');
    let html = `
        <div class="home-content">
            <h1>RAG Bootcamp</h1>
            <p class="home-subtitle">A complete guide to Retrieval-Augmented Generation</p>
            <div class="chapter-cards">
    `;

    chapters.forEach(ch => {
        html += `
            <a class="chapter-card" href="#${ch.id}">
                <h3>${ch.title}</h3>
                <p>${ch.description}</p>
            </a>
        `;
        if (ch.children) {
            ch.children.forEach(sub => {
                html += `
                    <a class="chapter-card sub-card" href="#${sub.id}">
                        <h3>${sub.title}</h3>
                        <p>${sub.description}</p>
                    </a>
                `;
            });
        }
    });

    html += `
            </div>
        </div>
    `;

    main.innerHTML = html;
    updateSidebarActive(null);
}

async function loadChapter(id) {
    const main = document.getElementById('main-content');

    try {
        const response = await fetch(`chapters/${id}.html`);
        if (!response.ok) throw new Error('Not found');
        const html = await response.text();

        main.innerHTML = `<div class="content">${html}</div>`;
        updateSidebarActive(id);
        window.scrollTo(0, 0);
    } catch (e) {
        main.innerHTML = `
            <div class="content">
                <h1>Page not found</h1>
                <p>The chapter "${id}" could not be loaded. Make sure the file <code>chapters/${id}.html</code> exists.</p>
                <p><a href="#">&larr; Back to home</a></p>
            </div>
        `;
        updateSidebarActive(null);
    }
}

function updateSidebarActive(activeId) {
    const items = document.querySelectorAll('#sidebar-nav li');
    items.forEach(li => {
        const link = li.querySelector('a');
        if (link && link.getAttribute('href') === `#${activeId}`) {
            li.classList.add('active');
        } else {
            li.classList.remove('active');
        }
    });
}

function handleRoute() {
    const hash = window.location.hash.slice(1);
    const allPages = getAllPages();
    if (hash && allPages.find(p => p.id === hash)) {
        loadChapter(hash);
    } else {
        buildHomepage();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    buildSidebar();
    handleRoute();
});

window.addEventListener('hashchange', handleRoute);
