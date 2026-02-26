document.addEventListener("DOMContentLoaded", () => {
  initAccordionNav();
  initAnimations();
  initIcons();
});

function initAccordionNav() {
  const group = document.getElementById("sections");
  const buttons = document.querySelectorAll(".nav sl-button");
  if (!group || buttons.length === 0) return;

  function openPanel(panelId) {
    const panels = group.querySelectorAll("sl-details");
    panels.forEach((p) => (p.open = p.id === panelId));

    const active = document.getElementById(panelId);
    if (active) active.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-target");
      if (id) openPanel(id);
    });
  });
}

function initAnimations() {
  const animations = document.querySelectorAll("sl-animation");
  if (animations.length === 0) return;

  const names = ["bounce", "jello", "heartBeat"];

  animations.forEach((el, i) => {
    el.setAttribute("name", names[i] || names[0]);
  });
}

function initIcons() {
  // 1) Preferred: set any icon with data-icon (KPIs, etc.) — validator-safe
  document.querySelectorAll("sl-icon[data-icon]").forEach((icon) => {
    icon.setAttribute("name", icon.getAttribute("data-icon"));
  });

  // 2) Alerts: target just the two alert slot icons (no guessing by order)
  const headerAlertIcon = document.querySelector(".alert-closable sl-icon[slot='icon']");
  if (headerAlertIcon) headerAlertIcon.setAttribute("name", "info-circle");

  const panel5AlertIcon = document.querySelector("#panel-5 sl-alert sl-icon[slot='icon']");
  if (panel5AlertIcon) panel5AlertIcon.setAttribute("name", "info-circle");
}
