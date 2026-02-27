

(function () {
    
    // HELPERS
    // These are small utility functions used throughout the app.
    // They don't depend on state — just pure input output.

    // uid() generates a unique ID for each task/reminder.
    // We use the browser's built-in crypto API when available,
    // and fall back to Date.now() + random for older browsers.
    function uid() {
        return (window.crypto && crypto.randomUUID)
            ? crypto.randomUUID()
            : String(Date.now()) + "_" + Math.random();
    }

    // Maps a timer mode string to its duration in minutes.
    // The Pomodoro Technique uses 25-min focus blocks, 5-min short breaks,
    // and 15-min long breaks after several cycles.
    function minutesForMode(mode) {
        if (mode === "focus") return 25;
        if (mode === "long")  return 15;
        return 5; // "short" break
    }

    // Returns a human-readable label for each mode.
    function modeLabel(mode) {
        if (mode === "focus") return "Focus";
        if (mode === "long")  return "Long Break";
        return "Short Break";
    }

    // Converts a raw seconds count into "MM:SS" display format.
    // padStart(2, "0") ensures single digits show as e.g. "05" not "5".
    function formatTime(sec) {
        var m = Math.floor(sec / 60);
        var s = sec % 60;
        return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
    }

    // Determines urgency class for a reminder based on how soon it is.
    // Returns "urgent" (≤10 min), "soon" (≤30 min), or "" (further away).
    // This is used to add a CSS class to the reminder <li> for color coding.
    function reminderClass(timeStr) {
        var now   = new Date();
        var parts = timeStr.split(":");
        var target = new Date(now);
        target.setHours(Number(parts[0]), Number(parts[1]), 0, 0);

        var diffMin = Math.round((target - now) / 60000);
        if (diffMin >= 0 && diffMin <= 10) return "list-group-item-danger";
        if (diffMin >= 0 && diffMin <= 30) return "list-group-item-warning";
        return "";
    }

    function toggleDarkMode() {
        state.darkMode = !state.darkMode;
        document.documentElement.setAttribute(
            "data-bs-theme", 
            state.darkMode ? "dark" : "light"
        );
    }

    // Shorthand to trigger a Mithril redraw.
    // Mithril automatically redraws after DOM events (onclick, oninput, etc.),
    function redraw() { m.redraw(); }

    // STATE
    var state = {
        // Dark mode
        darkMode: false,

        // --- To-Do ---
        newTask: "",        // Tracks what the user is typing in the input field
        filter:  "all",     // Current filter: "all" | "active" | "done"
        tasks: [
            // Pre-loaded example tasks so the list isn't empty on first load
            { id: uid(), text: "Grocery Shopping", done: true  },
            { id: uid(), text: "Finish Laundry",   done: false }
        ],

        // --- Timer ---
        mode:         "focus",    // Current mode: "focus" | "short" | "long"
        isRunning:    false,      // Whether the countdown is actively ticking
        totalSeconds: 25 * 60,   // The full duration for the current mode (for progress bar %)
        secondsLeft:  25 * 60,   // How many seconds remain on the current countdown
        intervalId:   null,       // Holds the setInterval reference so we can cancel it

        // --- Reminders ---
        newReminderText: "",  // Tracks the text input for a new reminder
        newReminderTime: "",  // Tracks the time input for a new reminder
        reminders:       []   // Array of { id, text, time } reminder objects
    };

    // TO-DO LOGIC

    // Count how many tasks are NOT yet done.
    function remaining() {
        return state.tasks.filter(function (t) { return !t.done; }).length;
    }

    // Return the subset of tasks that match the current filter setting.
    function filteredTasks() {
        if (state.filter === "active") return state.tasks.filter(function (t) { return !t.done; });
        if (state.filter === "done")   return state.tasks.filter(function (t) { return  t.done; });
        return state.tasks; // "all" — return everything
    }

    // TIMER LOGIC

    // Reset: stop any running timer and restore secondsLeft/totalSeconds
    // to whatever the current mode's full duration is.
    function resetTimer() {
        stopTimer();
        state.totalSeconds = minutesForMode(state.mode) * 60;
        state.secondsLeft  = state.totalSeconds;
    }

    // Start: set isRunning = true and kick off a 1-second interval.
    // Each tick decrements secondsLeft and calls redraw() so the display updates.
    function startTimer() {
        if (state.isRunning) return; // Guard: don't start a second interval
        state.isRunning = true;
        state.intervalId = window.setInterval(function () {
            if (state.secondsLeft > 0) {
                state.secondsLeft -= 1;

                // Alert at 5 minutes remaining
                if (state.secondsLeft === 300) {
                    alert("5 minutes remaining!");
                }
                // Alert at 1 minute remaining
                if (state.secondsLeft === 60) {
                    alert("1 minute remaining!");
                }
            } else {
                stopTimer(); // Timer finished - stop automatically
            }
            redraw(); // Tell Mithril to re-render since we're outside its event loop
        }, 1000);
    }

    // Stop: clear the interval and mark isRunning as false.
    function stopTimer() {
        state.isRunning = false;
        if (state.intervalId) {
            window.clearInterval(state.intervalId);
            state.intervalId = null;
        }
    }

    // Toggle: if running - pause; if paused - resume.
    function toggleTimer() {
        if (state.isRunning) stopTimer();
        else startTimer();
    }

    // Calculate how far along the timer is as a 0–100 percentage.
    // Used to set the width of the progress bar div.
    function progressPercent() {
        if (state.totalSeconds === 0) return 0;
        var elapsed = state.totalSeconds - state.secondsLeft;
        return Math.round((elapsed / state.totalSeconds) * 100);
    }

    // COMPONENT — App
    var App = {

        // oninit runs once when the component is first mounted.
        // We use it here to make sure the timer is in a clean initial state.
        oninit: function () {
            resetTimer();
            // Recheck reminder urgency every 30 seconds
            state.reminderIntervalId = window.setInterval(function () {
                m.redraw();
            }, 30000);
        },

        view: function () {
            // The top-level node is a div.wrap that contains all three sections.
            // Returning a single root node is required (just like in React).
            return m("div.container-fluid", [
                m("nav.navbar.px-3.py-2.mb-4",
                    m("div.container-fluid", [
                        m("span.navbar-brand.fw-bold.fs-5", [
                            m("i.bi.bi-check2-square.me-2"),
                            "Productivity Dashboard"
                       ]),
                        m("button.btn.btn-secondary.btn-sm", {onclick: toggleDarkMode}, [
                            m("i.bi", { class: state.darkMode ? "bi-sun-fill" : "bi-moon-fill"}),
                            " ",
                            state.darkMode ? "Light Mode" : "Dark Mode"
                         ])
                    ])
                ),
                m("div.row.g-3", [

                    //TO-DO LIST
                    m("div.col-12",
                        m("section.card.p-3.shadow-sm.rounded-3", [
                            m("h2.fs-1.fw-bold.text-center", [m("i.bi.bi-list-check.me-2"), "To-Do"]),
                            m("div.dol-12.col-md-8", [
                            // Add-task form.
                            m("form", {
                                onsubmit: function (e) {
                                    e.preventDefault();
                                    var text = state.newTask.trim();
                                    if (!text) return; // Don't add blank tasks
                                    state.tasks.unshift({ id: uid(), text: text, done: false }); // Add to front
                                    state.newTask = ""; // Clear the input
                                }
                            }, [
                                // Controlled input: `value` is always driven by state.newTask,
                                // and oninput updates state.newTask on every keystroke.
                                // This is the Mithril equivalent of a "controlled component" in React.
                                m("input[type=text][required]", {
                                    placeholder: "Add a task…",
                                    value: state.newTask,
                                    oninput: function (e) { state.newTask = e.target.value; }
                                }),
                                m("button.btn.btn-primary.mx-1[type=submit]", [m("i.bi.bi-plus-lg.me-1"), "Add"]),

                                // "Clear done" is disabled unless at least one task is checked off.
                                // Clicking it filters state.tasks to remove all completed tasks.
                                m("button.btn.btn-outline-secondary[type=button]", {
                                    disabled: !state.tasks.some(function (t) { return t.done; }),
                                    onclick: function () {
                                        state.tasks = state.tasks.filter(function (t) { return !t.done; });
                                    }
                                }, "Clear done")
                            ]),

                            // Stats row + filter dropdown
                            m("div.d-flex.align-items-center.gap-2.my-2", [
                                m("span.badge.bg-secondary", "Total: "     + state.tasks.length),
                                m("span.badge.bg-primary", "Remaining: " + remaining()),
                                m("label[for=filterSel]", { style: "margin-left:auto;" }, "Filter"),
                                // onchange updates state.filter, which causes filteredTasks() to return
                                // a different subset on the next redraw.
                                m("select.form-select.form-select-sm.ms-auto.w-auto#filterSel", {
                                    value: state.filter,
                                    onchange: function (e) { state.filter = e.target.value; }
                                }, [
                                    m("option[value=all]",    "All"),
                                    m("option[value=active]", "Active"),
                                    m("option[value=done]",   "Done")
                                ])
                            ]),

                            // Task list.
                            // .map() transforms each task object into a virtual DOM <li> node.
                            // The `key` attribute is critical — Mithril uses it to efficiently
                            // match old vnodes to new vnodes when the list changes (add/delete/reorder).
                            // Without keys, Mithril may re-render the wrong items.
                            m("ul",
                                filteredTasks().map(function (task) {
                                    return m("li.d-flex.align-items-center.gap-2.py-2.border-bottom", { key: task.id }, [
                                        m("div.left", [
                                            // Toggling the checkbox flips task.done directly.
                                            // Mithril will redraw automatically after this onclick.
                                            m("input[type=checkbox]", {
                                                checked: task.done,
                                                onchange: function () { task.done = !task.done; }
                                            }),
                                            // Conditionally add the ".done" class for strikethrough styling
                                            m("span.flex-grow-1" + (task.done ? ".done" : ""), task.text)
                                        ]),
                                        // Delete: filter out this task by id and replace state.tasks
                                        m("button.btn.btn-sm.btn-outline-danger[type=button]", {
                                            onclick: function () {
                                                state.tasks = state.tasks.filter(function (t) { return t.id !== task.id; }, );
                                            },
                                        }, "Delete", m("i.bi.bi-trash.mx-2"))
                                    ]);
                                })
                            )
                            ])

                            
                        ])
                    ),

                    //POMODORO TIMER
                    m("div.col-12.col-md-6", 
                        m("section.card.h-100.p-3.shadow-sm.rounded-3", [
                            m("h2.fs-1.fw-bold.text-center", [m("i.bi.bi-stopwatch.me-2"), "Pomodoro Timer"]),

                            // Mode buttons: each sets state.mode then calls resetTimer()
                            // to load the correct duration for that mode.
                            m("div.btn-group.w-100.gap-2", [
                                m("button.btn.btn-secondary[type=button]", {
                                    onclick: function () { state.mode = "focus"; resetTimer(); }
                                }, [m("i.bi.bi-pencil.me-1"), "Focus 25"]), // Button Text
                                m("button.btn.btn-secondary[type=button]", {
                                    onclick: function () { state.mode = "short"; resetTimer(); }
                                }, [m("i.bi.bi-cup-hot.me-1"), "Break 5"]), // Button Text
                                m("button.btn.btn-secondary[type=button]", {
                                    onclick: function () { state.mode = "long"; resetTimer(); }
                                }, [m("i.bi.bi-fork-knife.me-1"), "Break 15"]) // Button Text
                            ]),

                            m("div.text-center.mt-2",
                                m("span.badge.bg-primary.ms-2", modeLabel(state.mode)),
                            ),

                            

                            // Large countdown display — formatTime() converts raw seconds to MM:SS
                            m("p.display-3.fw-bold.text-center.my-3", formatTime(state.secondsLeft)),

                            // Progress bar: the inner div's width is set as a percentage inline style.
                            m("div.progress.my-2", {style:"height: 8px"}, [
                                m("div.progress-bar.bg-success", { 
                                    role: "progressbar",
                                    style: "width:" + progressPercent() + "%;"})
                            ]),

                            // Status text changes between "Running…" and "Paused"
                            m("p.text-muted.text-center.small", { style: "color: var(--muted); margin: 8px 0 0;" },
                                state.isRunning ? "Running…" : "Paused"
                            ),

                            // Start/Pause and Reset buttons
                            m("div.btn-group.gap-2", { style: "margin-top: 10px;" }, [
                                // toggleTimer handles both starting and stopping
                                m("button.btn[type=button]", {
                                    class: state.isRunning ? "text-dark bg-warning bi-pause-fill me-1" : "text-light bg-success bi-play-fill me-1",
                                    onclick: toggleTimer },
                                    state.isRunning ? "Pause" : "Start"
                                ),
                                m("button.btn.btn-danger[type=button]", { onclick: resetTimer }, [m("i.bi.bi-arrow-counterclockwise.me-1"), "Reset"])
                            ])
                        ])
                    ),

                    //REMINDERS
                    m("div.col-12.col-md-6", 
                        m("section.card.h-100.p-3.shadow-sm.rounded-3", [
                            m("h2.fs-1.fw-bold.text-center", [m("i.bi.bi-bell.me-2"), "Reminders"]),

                            // Add-reminder form: requires both a text description and a time.
                            m("form.row", {
                                onsubmit: function (e) {
                                    e.preventDefault();
                                    var text = state.newReminderText.trim();
                                    var time = state.newReminderTime;
                                    if (!text || !time) return; // Both fields are required
                                    state.reminders.push({ id: uid(), text: text, time: time });
                                    // Reset both inputs after adding
                                    state.newReminderText = "";
                                    state.newReminderTime = "";
                                }
                            }, [
                                m("label[for=remText]", "Reminder text"),
                                m("input#remText.form-control[type=text][required]", {
                                    placeholder: "Reminder (e.g., Email Client)",
                                    value: state.newReminderText,
                                    oninput: function (e) { state.newReminderText = e.target.value; }
                                }),
                                m("label[for=remTime]", "Reminder time"),
                                // type=time gives a native time picker in most browsers
                                m("input#remTime.form-control[type=time][required]", {
                                    value: state.newReminderTime,
                                    oninput: function (e) { state.newReminderTime = e.target.value; }
                                }),
                                m("div.btn-group.w-25.m-2" , [
                                    m("button.btn.btn-primary[type=submit]", [m("i.bi.bi-plus-circle.me-1"), "Add"])
                                ])
                                
                            ]),

                            // Show a hint message when the list is empty
                            state.reminders.length === 0
                                ? m("p", { style: "color: var(--muted); margin: 10px 0 0;" },
                                    "Add a reminder with a time. (No system notifications in this demo.)")
                                : null, // null is valid in Mithril — it renders nothing

                            // Reminder list, sorted ascending by time string (HH:MM compares correctly as a string).
                            // .slice() creates a shallow copy before sorting so we don't mutate state.reminders.
                            m("ul.list-group.list-group-flush.mt-2",
                                state.reminders
                                    .slice()
                                    .sort(function (a, b) { return a.time.localeCompare(b.time); })
                                    .map(function (rem) {
                                        // reminderClass() returns "urgent", "soon", or "" based on
                                        // how close the reminder time is to right now.
                                        return m("li", {
                                            key: rem.id, 
                                            class: "list-group-item d-flex align-items-center gap-2 " + reminderClass(rem.time)
                                        }, [
                                            m("span.badge.bg-secondary", rem.time),
                                            m("span.flex-grow-1", rem.text),
                                            m("button.btn.btn-sm.btn-outline-danger[type=button]", {
                                                onclick: function () {
                                                    state.reminders = state.reminders.filter(function (r) { return r.id !== rem.id; });
                                                }
                                            }, "Delete", m("i.bi.bi-trash.mx-2"))
                                        ]);
                                    })
                            )
                        ])
                    )
                ])
            ]); // end div.wrap
        } // end view
    }; // end App component


    // ============================================================
    // MOUNT
    // m.mount(domElement, Component) attaches the component to the page.
    // Mithril calls view() immediately to do the first render,
    // and then automatically re-renders after any Mithril event handler fires.
    // ============================================================
    m.mount(document.getElementById("app"), App);

})(); // end IIFE
