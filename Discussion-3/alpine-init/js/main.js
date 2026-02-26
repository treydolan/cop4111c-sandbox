// --- 1) Convert valid data-x-* attributes into Alpine attributes BEFORE Alpine initializes ---
(function convertDataXToAlpine() {
  var els = document.querySelectorAll('*');

  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    var attrs = Array.prototype.slice.call(el.attributes);

    for (var j = 0; j < attrs.length; j++) {
      var name = attrs[j].name;
      var value = attrs[j].value;

      if (name.indexOf('data-x-') !== 0) continue;

      // remove "data-" prefix
      var raw = name.slice(5); // "x-on-click-prevent", "x-model-trim", etc.
      var newName = raw;

      // data-x-on-click-prevent -> x-on:click.prevent
      if (raw.indexOf('x-on-') === 0) {
        var rest = raw.slice(5);
        var parts = rest.split('-');
        var eventName = parts.shift();
        var modifiers = parts.length ? '.' + parts.join('.') : '';
        newName = 'x-on:' + eventName + modifiers;
      }

      // data-x-bind-disabled -> x-bind:disabled
      else if (raw.indexOf('x-bind-') === 0) {
        newName = 'x-bind:' + raw.slice(7);
      }

      // data-x-model-trim -> x-model.trim
      else if (raw.indexOf('x-model-') === 0) {
        var mrest = raw.slice(8);
        var mparts = mrest ? mrest.split('-') : [];
        var mmods = mparts.length ? '.' + mparts.join('.') : '';
        newName = 'x-model' + mmods;
      }

      el.setAttribute(newName, value);
      el.removeAttribute(name);
    }
  }
})();

// --- 2) Alpine component factory MUST be global so x-data="dashboard()" can call it ---
function dashboard() {
  return {
    // To-do state
    newTask: '',
    filter: 'all',
    tasks: [
      { id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + '_1'), text: 'Read Discussion 3 requirements', done: true },
      { id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + '_2'), text: 'Build Alpine.js dashboard demo', done: false }
    ],

    // Timer state
    mode: 'focus', // focus | break | long
    isRunning: false,
    totalSeconds: 25 * 60,
    secondsLeft: 25 * 60,
    intervalId: null,

    // Reminders state
    newReminderText: '',
    newReminderTime: '',
    reminders: [],

    init: function () {
      // optional: set a default timer mode, or load from storage later
      this.resetTimer();
    },

    // --- To-do methods ---
    addTask: function () {
      if (!this.newTask) return;
      var id = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + '_' + Math.random());
      this.tasks.unshift({ id: id, text: this.newTask, done: false });
      this.newTask = '';
    },
    removeTask: function (id) {
      this.tasks = this.tasks.filter(function (t) { return t.id !== id; });
    },
    clearCompleted: function () {
      this.tasks = this.tasks.filter(function (t) { return !t.done; });
    },
    get remaining() {
      return this.tasks.filter(function (t) { return !t.done; }).length;
    },
    get filteredTasks() {
      if (this.filter === 'active') return this.tasks.filter(function (t) { return !t.done; });
      if (this.filter === 'done') return this.tasks.filter(function (t) { return t.done; });
      return this.tasks;
    },

    // --- Timer methods ---
    setMode: function (mode) {
      this.mode = mode;
      this.resetTimer();
    },
    get modeLabel() {
      var labels = { focus: 'Focus Mode', break: 'Short Break', long: 'Long Break' };
      return labels[this.mode] || 'Timer';
    },
    resetTimer: function () {
      this.stopTimer();
      var durations = { focus: 25, break: 5, long: 15 };
      var minutes = durations[this.mode] || 25;
      this.totalSeconds = minutes * 60;
      this.secondsLeft = this.totalSeconds;
    },
    toggleTimer: function () {
      if (this.isRunning) this.stopTimer();
      else this.startTimer();
    },
    startTimer: function () {
      var self = this;
      if (self.isRunning) return;
      self.isRunning = true;

      self.intervalId = window.setInterval(function () {
        if (self.secondsLeft > 0) self.secondsLeft -= 1;
        else self.stopTimer();
      }, 1000);
    },
    stopTimer: function () {
      this.isRunning = false;
      if (this.intervalId) {
        window.clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },
    get timeDisplay() {
      var m = Math.floor(this.secondsLeft / 60);
      var s = this.secondsLeft % 60;
      return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    },
    get progressPercent() {
      if (this.totalSeconds === 0) return 0;
      var done = this.totalSeconds - this.secondsLeft;
      return Math.round((done / this.totalSeconds) * 100);
    },

    // --- Reminders methods ---
    addReminder: function () {
      if (!this.newReminderText || !this.newReminderTime) return;
      var id = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + '_' + Math.random());
      this.reminders.push({ id: id, text: this.newReminderText, time: this.newReminderTime });
      this.newReminderText = '';
      this.newReminderTime = '';
    },
    removeReminder: function (id) {
      this.reminders = this.reminders.filter(function (r) { return r.id !== id; });
    },
    get sortedReminders() {
      return this.reminders.slice().sort(function (a, b) { return a.time.localeCompare(b.time); });
    },
    remClass: function (timeStr) {
      var now = new Date();
      var parts = timeStr.split(':');
      var hh = Number(parts[0]);
      var mm = Number(parts[1]);

      var target = new Date(now);
      target.setHours(hh, mm, 0, 0);

      var diffMin = Math.round((target.getTime() - now.getTime()) / 60000);
      if (diffMin >= 0 && diffMin <= 10) return 'danger';
      if (diffMin >= 0 && diffMin <= 30) return 'dueSoon';
      return '';
    }
  };
}
