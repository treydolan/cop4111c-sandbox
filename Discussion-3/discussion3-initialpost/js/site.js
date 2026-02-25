document.addEventListener("alpine:init", () => {
  Alpine.data("site", () => ({
    // For nav highlighting
    activePage: "",

    // Gallery data
    projects: [
      { title: "Counter Widget", tag: "Alpine", desc: "Reactive counter component example." },
      { title: "Theme Toggle", tag: "UI", desc: "Dark/light mode using Alpine state." },
      { title: "Contact Form", tag: "Forms", desc: "Live validation and submission feedback." },
      { title: "FAQ Accordion", tag: "UX", desc: "Interactive FAQ with show/hide behavior." }
    ],

    // Contact form state
    form: {
      name: "",
      email: "",
      message: ""
    },
    submitted: false,

    setActive(page) {
      this.activePage = page;
    },

    isEmailValid(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    submitForm() {
      this.submitted = true;

      // In a real app you’d POST to a server.
      // For this assignment, we just show success UI.
      this.form = { name: "", email: "", message: "" };
    }
  }));
});