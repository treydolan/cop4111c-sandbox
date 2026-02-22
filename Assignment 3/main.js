function addStyles(elementID) {

  const element = document.getElementById(elementID);

  // ✅ STOP if element doesn't exist
  if (!element) return;

  const items = element.querySelectorAll('li');

  items.forEach(item => {
    item.classList.add(
      "px-4",
      "py-2",
      "m-2",
      "bg-slate-800",
      "rounded-lg",
      "shadow",
      "hover:bg-slate-700",
      "transition",
      "duration-200",
      "text-white",
      "font-mono"
    );
  });

  element.classList.add(
    "divide-y",
    "divide-yellow-600",
    "divide-solid"
  );
}

addStyles("widthMetrics");
addStyles("heightMetrics");
addStyles("maxWidthProp");
addStyles("maxHeightProp");

//Fix Error in null reading --> Other pages cannot reference function when it can't find the ID's of width height page
addStyles("paddingMetrics");

// Navigation code to go here 
// ===== NAV DATA (edit this only) =====
const NAV_ITEMS = [
  { label: "Home", href: "index.html" },

  // Assignment 3 pages (looks like they live in Assignment 3/)
  { label: "Object Metrics", href: "Assignment 3/objectMetrics.html" },
  { label: "Object Properties", href: "Assignment 3/objectProperties.html" },
  { label: "Padding & Margin", href: "Assignment 3/paddingMargin.html" },

  // Add more as needed...
];

// ===== NAV BUILDER =====
function buildNav({
  mountId = "siteNav",
  items = NAV_ITEMS,
  basePath = "", // e.g. "" if you're at project root; "../" if pages are inside Assignment folders
} = {}) {
  const mount = document.getElementById(mountId);
  if (!mount) return;

  const currentPath = window.location.pathname.split("/").pop(); // current filename (rough)
  const currentFull = window.location.pathname.replace(/^\//, ""); // full path w/out leading slash

  // Build list
  const ul = document.createElement("ul");
  ul.className =
    "flex flex-wrap gap-2 p-2 rounded-xl bg-slate-900 text-white text-sm";

  items.forEach(({ label, href }) => {
    const a = document.createElement("a");
    a.href = basePath + href;
    a.textContent = label;

    // Active detection: match end of pathname OR exact href path
    const isActive =
      currentFull.endsWith(href) || currentPath === href.split("/").pop();

    a.className =
      "px-3 py-2 rounded-lg transition hover:bg-slate-700 " +
      (isActive ? "bg-slate-700 ring-2 ring-yellow-500" : "bg-slate-800");

    const li = document.createElement("li");
    li.appendChild(a);
    ul.appendChild(li);
  });

  mount.replaceChildren(ul);
}

buildNav({ basePath: "" });