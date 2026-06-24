/**
 * Simple SPA router for the documentation site.
 *
 * - Reads chapters from chapters.js (supports nested children)
 * - Uses URL hash for navigation (#chapter1, #chapter1-1, etc.)
 * - Loads chapter HTML from /chapters/ folder
 * - Auto-generates the right-hand "On this page" table of contents
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
        const li = document.createElement('li');

        if (ch.children && ch.children.length) {
            // Parent chapter WITH sub-chapters: a collapsible group.
            // Sub-chapters are hidden by default and revealed when the parent
            // is opened (via navigation or the chevron toggle).
            li.classList.add('nav-group');

            // Row holds the chapter link plus a chevron that toggles the group.
            const row = document.createElement('div');
            row.className = 'nav-group-row';

            const a = document.createElement('a');
            a.href = `#${ch.id}`;
            a.textContent = ch.title;
            row.appendChild(a);

            const toggle = document.createElement('button');
            toggle.className = 'subnav-toggle';
            toggle.type = 'button';
            toggle.setAttribute('aria-label', `Toggle ${ch.title} sub-chapters`);
            toggle.setAttribute('aria-expanded', 'false');
            toggle.innerHTML =
                '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">' +
                '<path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" ' +
                'stroke-linecap="round" stroke-linejoin="round"/></svg>';
            // The chevron toggles the group without navigating.
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                setGroupExpanded(li, !li.classList.contains('expanded'));
            });
            row.appendChild(toggle);

            li.appendChild(row);

            // Nested list of sub-chapters
            const subUl = document.createElement('ul');
            subUl.className = 'subnav';
            ch.children.forEach(sub => {
                const subLi = document.createElement('li');
                subLi.classList.add('sub-item');
                const subA = document.createElement('a');
                subA.href = `#${sub.id}`;
                subA.textContent = sub.title;
                subLi.appendChild(subA);
                subUl.appendChild(subLi);
            });
            li.appendChild(subUl);
        } else {
            // Leaf chapter (no children)
            const a = document.createElement('a');
            a.href = `#${ch.id}`;
            a.textContent = ch.title;
            li.appendChild(a);
        }

        nav.appendChild(li);
    });
}

/* Expand or collapse a sidebar group, keeping the chevron's aria state in sync. */
function setGroupExpanded(group, expanded) {
    group.classList.toggle('expanded', expanded);
    const toggle = group.querySelector('.subnav-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
}

function buildHomepage() {
    const main = document.getElementById('main-content');
    main.classList.add('is-home');

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
    buildTOC(null);
}

async function loadChapter(id) {
    const main = document.getElementById('main-content');
    main.classList.remove('is-home');

    try {
        const response = await fetch(`chapters/${id}.html`);
        if (!response.ok) throw new Error('Not found');
        const html = await response.text();

        main.innerHTML = html;
        updateSidebarActive(id);
        buildTOC(main);
        highlightCode(main);
        addCopyButtons(main);
        wrapScrollables(main);
        window.scrollTo(0, 0);
    } catch (e) {
        main.innerHTML = `
            <h1>Page not found</h1>
            <p>The chapter "${id}" could not be loaded. Make sure the file <code>chapters/${id}.html</code> exists.</p>
            <p><a href="#">&larr; Back to home</a></p>
        `;
        updateSidebarActive(null);
        buildTOC(null);
    }
}

/**
 * Apply IDE-style syntax highlighting to every <pre> code block in scope.
 * Uses highlight.js (loaded from CDN). Language is auto-detected.
 */
function highlightCode(scope) {
    if (!window.hljs) return;
    scope.querySelectorAll('pre').forEach(pre => {
        if (pre.dataset.highlighted) return;   // avoid re-processing
        try {
            hljs.highlightElement(pre);
        } catch (e) {
            /* leave the block as plain text if highlighting fails */
        }
    });
}

/**
 * Add a "Copy" button to every <pre> code block within the given scope.
 * Each <pre> is wrapped in a positioned container so the button can float
 * in its top-right corner.
 */
function addCopyButtons(scope) {
    const blocks = scope.querySelectorAll('pre');

    blocks.forEach(pre => {
        // Skip if this block is already wrapped
        if (pre.parentElement && pre.parentElement.classList.contains('code-block')) return;

        const wrap = document.createElement('div');
        wrap.className = 'code-block';
        pre.parentNode.insertBefore(wrap, pre);
        wrap.appendChild(pre);

        const btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Copy code to clipboard');
        btn.textContent = 'Copy';

        btn.addEventListener('click', () => {
            const code = pre.innerText;
            copyText(code)
                .then(() => flashButton(btn, 'Copied!', 'copied'))
                .catch(() => flashButton(btn, 'Failed', 'failed'));
        });

        wrap.appendChild(btn);
    });
}

/**
 * Wrap wide elements (tables and diagrams) in a horizontally scrollable
 * container so they stay readable on narrow screens instead of overflowing the
 * page or being crushed into the viewport. The wrapper only scrolls on small
 * screens (see the .scroll-x rules in style.css); on desktop it is an inert
 * pass-through, so box shadows and rounded corners still render normally.
 */
function wrapScrollables(scope) {
    const targets = scope.querySelectorAll('table, svg.diagram-svg');
    targets.forEach(el => {
        const parent = el.parentElement;
        if (!parent || parent.classList.contains('scroll-x')) return;  // already wrapped
        const isTable = el.tagName.toLowerCase() === 'table';
        const wrap = document.createElement('div');
        wrap.className = 'scroll-x ' + (isTable ? 'scroll-x--table' : 'scroll-x--diagram');
        parent.insertBefore(wrap, el);
        wrap.appendChild(el);
    });
}

function flashButton(btn, label, cls) {
    const original = 'Copy';
    btn.textContent = label;
    btn.classList.add(cls);
    setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove(cls);
    }, 1800);
}

/**
 * Copy text to the clipboard, with a fallback for older browsers
 * and non-secure (http) contexts where navigator.clipboard is unavailable.
 */
function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy') ? resolve() : reject();
        } catch (err) {
            reject(err);
        } finally {
            document.body.removeChild(textarea);
        }
    });
}

/**
 * Build the "On this page" table of contents from the article's headings.
 * Pass the article element, or null to clear/hide the TOC.
 */
let tocObserver = null;

function buildTOC(article) {
    const toc = document.getElementById('toc');
    if (tocObserver) {
        tocObserver.disconnect();
        tocObserver = null;
    }

    if (!article) {
        toc.innerHTML = '';
        toc.classList.remove('visible');
        return;
    }

    const headings = Array.from(article.querySelectorAll('h2, h3'));
    if (headings.length === 0) {
        toc.innerHTML = '';
        toc.classList.remove('visible');
        return;
    }

    let html = '<p class="toc-label">On this page</p><ul class="toc-list">';
    headings.forEach((h, i) => {
        // Ensure each heading has a stable id to anchor to
        if (!h.id) {
            h.id = 'sec-' + i + '-' + h.textContent
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }
        const level = h.tagName.toLowerCase(); // h2 | h3
        html += `<li class="toc-${level}"><a href="#${h.id}" data-target="${h.id}">${h.textContent}</a></li>`;
    });
    html += '</ul>';

    toc.innerHTML = html;
    toc.classList.add('visible');

    wireTOCInteractions(headings);
}

function wireTOCInteractions(headings) {
    const toc = document.getElementById('toc');
    const links = Array.from(toc.querySelectorAll('a'));

    // Smooth-scroll to heading without changing the page hash (hash drives routing)
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById(link.dataset.target);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Scroll-spy: highlight the heading currently in view
    const setActive = (id) => {
        links.forEach(l => l.parentElement.classList.toggle('active', l.dataset.target === id));
    };

    tocObserver = new IntersectionObserver((entries) => {
        const visible = entries
            .filter(en => en.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
            setActive(visible[0].target.id);
        }
    }, {
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0
    });

    headings.forEach(h => tocObserver.observe(h));
    if (headings[0]) setActive(headings[0].id);
}

function updateSidebarActive(activeId) {
    // Mark the <li> whose OWN link matches as active. Use direct-child links so
    // a parent group isn't flagged active just because it contains the link.
    const items = document.querySelectorAll('#sidebar-nav li');
    items.forEach(li => {
        const link = li.classList.contains('nav-group')
            ? li.querySelector(':scope > .nav-group-row > a')
            : li.querySelector(':scope > a');
        const isActive = link && link.getAttribute('href') === `#${activeId}`;
        li.classList.toggle('active', !!isActive);
    });

    // Open only the group that contains the active page; collapse the rest so
    // sub-chapters are never shown by default.
    document.querySelectorAll('#sidebar-nav .nav-group').forEach(group => {
        const containsActive = !!group.querySelector(`a[href="#${activeId}"]`);
        setGroupExpanded(group, containsActive);
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
    // After navigating, dismiss the mobile drawer only — never collapse the
    // desktop sidebar just because the user clicked a chapter link.
    if (isMobileViewport()) closeSidebar();
}

/* ---- Sidebar open/close ----
 * Two modes share one toggle button:
 *   - Mobile (<= 860px): the sidebar is an off-canvas drawer. "open" slides it
 *     in over a backdrop; closing hides it.
 *   - Desktop (> 860px): the sidebar is always-on by default. Closing collapses
 *     it out of the layout (the article reclaims the space); the choice is
 *     remembered across visits via localStorage.
 */
const SIDEBAR_PREF_KEY = 'sidebarCollapsed';

function isMobileViewport() {
    return window.matchMedia('(max-width: 860px)').matches;
}

function openSidebar() {
    if (isMobileViewport()) {
        document.getElementById('sidebar').classList.add('open');
        document.getElementById('sidebar-backdrop').classList.add('visible');
    } else {
        document.body.classList.remove('sidebar-collapsed');
        try { localStorage.setItem(SIDEBAR_PREF_KEY, 'false'); } catch (e) { /* ignore */ }
    }
    syncSidebarHandle();
}

function closeSidebar() {
    // Always clear the mobile drawer state…
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('open');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (backdrop) backdrop.classList.remove('visible');

    // …and on desktop, collapse it out of the layout and remember the choice.
    if (!isMobileViewport()) {
        document.body.classList.add('sidebar-collapsed');
        try { localStorage.setItem(SIDEBAR_PREF_KEY, 'true'); } catch (e) { /* ignore */ }
    }
    syncSidebarHandle();
}

function toggleSidebar() {
    if (isMobileViewport()) {
        document.getElementById('sidebar').classList.contains('open')
            ? closeSidebar()
            : openSidebar();
    } else {
        document.body.classList.contains('sidebar-collapsed')
            ? openSidebar()
            : closeSidebar();
    }
}

/* Keep the toggle controls' accessibility state in sync with the sidebar.
   Open state depends on the viewport: a slide-in drawer (.open) on mobile, the
   collapsed class on desktop. The chevron's visual direction is flipped in CSS. */
function syncSidebarHandle() {
    const open = isMobileViewport()
        ? document.getElementById('sidebar').classList.contains('open')
        : !document.body.classList.contains('sidebar-collapsed');

    [document.getElementById('sidebar-toggle'),
     document.getElementById('sidebar-handle')].forEach(btn => {
        if (!btn) return;
        btn.setAttribute('aria-expanded', String(open));
        btn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
}

function wireSidebarToggle() {
    const toggle = document.getElementById('sidebar-toggle');
    const closeBtn = document.getElementById('sidebar-close');
    const backdrop = document.getElementById('sidebar-backdrop');
    const handle = document.getElementById('sidebar-handle');

    if (toggle) toggle.addEventListener('click', toggleSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (backdrop) backdrop.addEventListener('click', closeSidebar);
    // The arrow handle lives on the sidebar edge and toggles it both ways.
    if (handle) handle.addEventListener('click', toggleSidebar);

    // Escape closes the sidebar
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSidebar();
    });

    // Restore the remembered desktop collapsed state
    let collapsed = false;
    try { collapsed = localStorage.getItem(SIDEBAR_PREF_KEY) === 'true'; } catch (e) { /* ignore */ }
    if (collapsed && !isMobileViewport()) {
        document.body.classList.add('sidebar-collapsed');
    }

    syncSidebarHandle();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    buildSidebar();
    wireSidebarToggle();
    handleRoute();
});

window.addEventListener('hashchange', handleRoute);
