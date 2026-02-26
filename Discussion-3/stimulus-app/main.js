import { Application, Controller } from "https://unpkg.com/@hotwired/stimulus/dist/stimulus.js";

window.Stimulus = Application.start();

class TodoController extends Controller {
  static targets = ["input", "list", "total", "remaining", "filter"];

  connect() {
    this.tasks = [
      { id: crypto.randomUUID(), text: "Read Discussion 3 requirements", done: true },
      { id: crypto.randomUUID(), text: "Build a simple framework demo", done: false }
    ];
    this.activeFilter = "all";
    this.render();
  }

  add(event) {
    event.preventDefault();
    const text = this.inputTarget.value.trim();
    if (!text) return;

    this.tasks.unshift({ id: crypto.randomUUID(), text, done: false });
    this.inputTarget.value = "";
    this.render();
  }

  toggle(event) {
    const id = event.currentTarget.getAttribute("data-id");
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;
    task.done = !task.done;
    this.render();
  }

  remove(event) {
    const id = event.currentTarget.getAttribute("data-id");
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.render();
  }

  clearDone() {
    this.tasks = this.tasks.filter(t => !t.done);
    this.render();
  }

  filter() {
    this.activeFilter = this.filterTarget.value;
    this.render();
  }

  get filteredTasks() {
    if (this.activeFilter === "active") return this.tasks.filter(t => !t.done);
    if (this.activeFilter === "done") return this.tasks.filter(t => t.done);
    return this.tasks;
  }

  render() {
    const total = this.tasks.length;
    const remaining = this.tasks.filter(t => !t.done).length;

    this.totalTarget.textContent = `Total: ${total}`;
    this.remainingTarget.textContent = `Remaining: ${remaining}`;

    this.listTarget.innerHTML = "";

    for (const task of this.filteredTasks) {
      const li = document.createElement("li");

      const left = document.createElement("div");
      left.className = "left";

      const check = document.createElement("input");
      check.type = "checkbox";
      check.checked = task.done;
      check.setAttribute("data-id", task.id);
      check.setAttribute("data-action", "change->todo#toggle");

      const text = document.createElement("span");
      text.className = "text" + (task.done ? " done" : "");
      text.textContent = task.text;

      left.append(check, text);

      const del = document.createElement("button");
      del.type = "button";
      del.textContent = "Delete";
      del.setAttribute("data-id", task.id);
      del.setAttribute("data-action", "click->todo#remove");

      li.append(left, del);
      this.listTarget.append(li);
    }
  }
}

Stimulus.register("todo", TodoController);
