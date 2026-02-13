// main.js
import { renderHead } from "./layout/head.js";
import { renderHeader } from "./layout/header.js";
import { renderFooter } from "./layout/footer.js";

// Set active page automatically from filename
const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();

const activeMap = {
  "index.html": "home",
  "about.html": "about",
  "projects.html": "projects",
  "testimonials.html": "testimonials",
  "contact.html": "contact",
};


// Inject head
document.getElementById("site-head").innerHTML = renderHead();
document.getElementById("site-header").innerHTML = renderHeader(activeMap[page] || "");
document.getElementById("site-footer").innerHTML = renderFooter();

// Navigation hover, bootstrap has built class, variables for this

// var links = document.querySelector('.nav-link');

// links.forEach(function(link) {
//     link.addEventListener('onmouseover', function() {
//         link.classList.add('active');
//     });

//     link.addEventListener('mouseout', function() {
//         link.classList.remove('active');
//     });
// });

// Dark mode toggle

function applyTheme(theme) {
  document.documentElement.setAttribute("data-bs-theme", theme);
  localStorage.setItem("theme", theme);

  const btn = document.getElementById("themeToggle");
  if (btn) btn.textContent = theme === "dark" ? "Light" : "Dark";
}

function initThemeToggle() {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  applyTheme(saved || (prefersDark ? "dark" : "light"));

  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-bs-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });
}

document.addEventListener("DOMContentLoaded", initThemeToggle);
