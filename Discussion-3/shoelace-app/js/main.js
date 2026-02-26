// Navigation -> open matching accordion panel and scroll into view.
const group = document.getElementById("sections");
const buttons = document.querySelectorAll(".nav sl-button");

function openPanel(panelId) {
    const panels = group.querySelectorAll("sl-details");
    for (const p of panels) {
        p.open = p.id === panelId;
    }

    const active = document.getElementById(panelId);
    if (active) {
        active.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

for (const btn of buttons) {
    btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-target");
        if (id) openPanel(id);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const animations = document.querySelectorAll("sl-animation");

  // Assign specific animation names in order
  const names = ["bounce", "jello", "heartBeat"];

  animations.forEach((el, i) => {
    el.setAttribute("name", names[i] || "bounce");
  });
});
