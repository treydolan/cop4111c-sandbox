// layout/header.js
export function renderHeader(activePage = "") {
  return `
    <nav class="navbar navbar-expand-lg navbar-dark bg-secondary">
      <div class="container">
        <a class="navbar-brand" href="index.html">Binaryville</a>

        <button class="navbar-toggler" type="button"
          data-bs-toggle="collapse" data-bs-target="#mainNav"
          aria-controls="mainNav" aria-expanded="false"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="mainNav">
          <div class="navbar-nav ms-auto">
            <a class="nav-link ${activePage === "home" ? "active" : ""}" href="index.html">Home</a>
            <a class="nav-link ${activePage === "about" ? "active" : ""}" href="about.html">About</a>
            <a class="nav-link ${activePage === "projects" ? "active" : ""}" href="projects.html">Projects</a>
            <a class="nav-link ${activePage === "contact" ? "active" : ""}" href="contact.html">Contact</a>
          </div>
        </div>
      </div>
    </nav>
  `;
}
