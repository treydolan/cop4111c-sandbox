document.addEventListener('alpine:init', () => {
    Alpine.data('taskApp', () => ({
        tasks: [
            { id: 1, text: 'Set up Alpine.js project', priority: 'high', done: true },
            { id: 2, text: 'Build task dashboard UI', priority: 'high', done: true },
            { id: 3, text: 'Add filter functionality', priority: 'medium', done: false },
            { id: 4, text: 'Write documentation', priority: 'low', done: false }
        ],
        newTask: '',
        newPriority: 'medium',
        filter: 'all',
        nextId: 5,

        get filtered() {
            if (this.filter === 'active') return this.tasks.filter(t => !t.done);
            if (this.filter === 'done') return this.tasks.filter(t => t.done);
            return this.tasks;
        },

        get total() { return this.tasks.length; },
        get completed() { return this.tasks.filter(t => t.done).length; },
        get active() { return this.tasks.filter(t => !t.done).length; },
        get progress() {
            return this.total === 0 ? 0 : Math.round((this.completed / this.total) * 100);
        },

        addTask() {
            if (!this.newTask.trim()) return;
            this.tasks.unshift({
                id: this.nextId++,
                text: this.newTask.trim(),
                priority: this.newPriority,
                done: false
            });
            this.newTask = '';
        },

        deleteTask(id) {
            this.tasks = this.tasks.filter(t => t.id !== id);
        },

        toggleTask(id) {
            const task = this.tasks.find(t => t.id === id);
            if (task) task.done = !task.done;
        }
    }));
});