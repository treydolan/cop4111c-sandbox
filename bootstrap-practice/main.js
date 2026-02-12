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
document.head.innerHTML = renderHead(pageTitles[page] || "Binaryville");

document.title = pageTitles[page] || "Binaryville";

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
