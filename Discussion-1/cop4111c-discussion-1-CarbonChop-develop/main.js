const app = document.getElementById("app");
const navLinks = Array.from(document.querySelectorAll("a[data-link]"));
const routeDot = document.getElementById("routeDot");
const routeText = document.getElementById("routeText");

// Route Table
const ROUTES = {
    "/": renderHome,
    "/projects": renderProjects,
    "/examples": renderExamples,
    "/about": renderAbout
};

// Dynamic UI
function setActiveNav(path) {
    navLinks.forEach((a) => {
        const href = a.getAttribute("href");
        const isActive = href === path;

        a.classList.toggle("active", isActive);
        a.setAttribute("aria-current", isActive ? "page" : "false");
    });
}

function setRouteStatus(kind, text) {
    routeDot.classList.remove("working", "bad");

    if (kind === "working") {
        routeDot.classList.add("working");
    }
    if (kind === "bad") {
        routeDot.classList.add("bad");
    }

    routeText.textContent = text;
}

// Main Render Function
function render(path, state, opts) {
    const fn = ROUTES[path];

    // 404 Route
    if (!fn) {
        setActiveNav("");
        setRouteStatus("bad", `Route: ${path} (404)`);
        app.innerHTML = renderNotFound(path);

        // Render route-specific events
        wireRouteEvents(path);

        if (!opts?.fromPopstate) {
            focusMain();
        }
        return;
    }

    // Normal route
    setActiveNav(path);
    setRouteStatus("working", `Route: ${path}`);
    app.innerHTML = fn(state);

    // Render route-specific events
    wireRouteEvents(path);

    if (!opts?.fromPopstate) {
        focusMain();
    }
}

// Route Renders
function renderHome() {
    return `
        <h2>Home</h2>
        <p>
            This project is a mini Single Page Application (SPA) built with the
            <strong>History API</strong>. Clicking navigation links updates the URL
            and swaps page content without reloading the browser.
        </p>

        <div class="grid">
            <div class="panel">
                <div class="panelTitle">Features implemented</div>
                <ul class="list">
                    <li>Client-side routing using <code>history.pushState()</code></li>
                    <li>Back/Forward support using the <code>popstate</code> event</li>
                    <li>Active navigation highlighting with a CSS <code>.active</code> class</li>
                    <li>Route status pill UI (working vs 404)</li>
                </ul>
            </div>

            <div class="panel">
                <div class="panelTitle">How to test</div>
                <ul class="list">
                    <li>Click between Home / Projects / Examples / About</li>
                    <li>Use browser Back and Forward buttons</li>
                    <li>Type an invalid path using <code>navigate("/path");</code> in the DevTools console like <code>/badpath</code> (server must support SPA fallback)</li>
                </ul>
            </div>
        </div>
    `;
}

function renderProjects() {
    return `
        <h2>Projects</h2>
        <p>
            This page simulates a “projects” section on a multi-page website.
            In this SPA, routing is handled client-side using the History API.
        </p>

        <div class="grid">
            <div class="panel">
                <div class="panelTitle">History API Router</div>
                <ul class="list">
                    <li>Maintains a route table that maps paths to render functions</li>
                    <li>Uses <code>history.pushState()</code> to update the URL</li>
                    <li>Renders HTML into a single <code>#app</code> container</li>
                </ul>
            </div>

            <div class="panel">
                <div class="panelTitle">Navigation System</div>
                <ul class="list">
                    <li>Intercepts clicks on internal links (<code>a[data-link]</code>)</li>
                    <li>Updates active link styling with <code>.active</code></li>
                    <li>Responds to Back/Forward with <code>popstate</code></li>
                </ul>
            </div>
        </div>
    `;
}

function renderExamples(state) {
    const count = Number.isFinite(state?.count) ? state.count : 0;

    return `
        <h2>Examples</h2>
        <p>
            This page demonstrates how data can be stored inside browser history
            entries using the History API.
        </p>

        <div class="panel">
            <p>Current count: <strong id="countValue">${count}</strong></p>

            <div class="actions">
                <button id="incBtn" type="button">Increment (pushState)</button>
                <button id="decBtn" type="button" class="secondary">Decrement (pushState)</button>
                <button id="replaceBtn" type="button" class="secondary">Replace (+10)</button>
            </div>

            <p class="hint">
                Use Back and Forward to move between different counter values stored in history.
            </p>
        </div>
    `;
}

function renderAbout() {
    return `
        <h2>About</h2>
        <p>
            The <strong>History API</strong> lets a web application change the browser URL and
            store entries in the session history without reloading the page. This is one of the
            core building blocks of Single Page Applications (SPAs).
        </p>

        <div class="grid">
            <div class="panel">
                <div class="panelTitle">Key Methods</div>
                <ul class="list">
                    <li><code>history.pushState(state, "", url)</code> — adds a new history entry</li>
                    <li><code>history.replaceState(state, "", url)</code> — updates the current entry</li>
                    <li><code>popstate</code> event — fires when navigating Back/Forward</li>
                </ul>
            </div>

            <div class="panel">
                <div class="panelTitle">How this project uses it</div>
                <ul class="list">
                    <li>Intercepts clicks on internal links so the page doesn’t reload</li>
                    <li>Calls <code>pushState()</code> to update the URL</li>
                    <li>Renders route content into a single <code>#app</code> container</li>
                    <li>Uses history state for the Examples counter</li>
                </ul>
            </div>
        </div>
    `;
}

function renderNotFound(path) {
    return `
        <h2>404 - Not Found</h2>
        <p>
            No route matches <code>${escapeHtml(path)}</code>.
            This is a client-side 404 (the server did not decide this).
        </p>

        <div class="panel">
            <div class="panelTitle">Open DevTools and in the console use <code>navigate("/path")</code> to try one of these routes:</div>
            <ul class="list">
                <li><code>/</code> (Home)</li>
                <li><code>/projects</code></li>
                <li><code>/examples</code></li>
                <li><code>/about</code></li>
            </ul>
        </div>

        <div class="actions">
            <button id="goHomeBtn" type="button">Go Home</button>
            <button id="goBackBtn" type="button">Go Back</button>
        </div>
    `;
}

function escapeHtml(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

//Route-Specific Events
function wireRouteEvents(path) {
    //Examples Route
    if (path === "/examples") {
        const countVal = document.getElementById("countValue");
        const incBtn = document.getElementById("incBtn");
        const decBtn = document.getElementById("decBtn");
        const replaceBtn = document.getElementById("replaceBtn");

        const currentCount = parseInt(countVal.textContent, 10) || 0;

        incBtn.addEventListener("click", () => {
            const next = currentCount + 1;
            history.pushState({ count: next }, "", "/examples");
            render("/examples", { count: next });
        });

        decBtn.addEventListener("click", () => {
            const next = currentCount - 1;
            history.pushState({ count: next }, "", "/examples");
            render("/examples", { count: next });
        });

        replaceBtn.addEventListener("click", () => {
            const next = currentCount + 10;
            history.replaceState({ count: next }, "", "/examples");
            render("/examples", { count: next });
        });
    }

    // 404 Route
    if (!ROUTES[path]) {
        const goHomeBtn = document.getElementById("goHomeBtn");
        const goBackBtn = document.getElementById("goBackBtn");

        if (goHomeBtn) {
            goHomeBtn.addEventListener("click", () => {
                navigate("/", {});
            });
        }

        if (goBackBtn) {
            goBackBtn.addEventListener("click", () => {
                history.back();
            });
        }
    }
}


// Link Interception
document.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-link]");
    if (!link) return;

    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

    const href = link.getAttribute("href");
    if (!href.startsWith("/")) return;

    event.preventDefault();
    navigate(href, {});
});

// Back and Foward Button Handler
window.addEventListener("popstate", (event) => {
    const path = safePathname();
    render(path, event.state || {}, { fromPopstate: false });
});

// Navigation
function navigate(path, state) {
    history.pushState(state || {}, "", path);
    render(path, state, { fromPopstate: false });
}

function safePathname() {
    return window.location.pathname || "/";
}

function focusMain() {
    app.focus();
}

// Initialization
render(safePathname(), history.state || {}, { fromPopstate: true });