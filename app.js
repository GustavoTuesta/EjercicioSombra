/**
 * Task Management Logic
 * Handles CRUD operations, LocalStorage persistence, and DOM updates.
 */

class Task {
    constructor(title, description = '') {
        this.id = Date.now().toString();
        this.title = title;
        this.description = description;
        this.completed = false;
        this.createdAt = new Date().toLocaleString();
    }
}

class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || this.getPreferredTheme();
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
    }

    getPreferredTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    setupEventListeners() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.taskForm = document.getElementById('task-form');
        this.taskList = document.getElementById('task-list');
        this.taskCount = document.getElementById('task-count');
        this.feedback = document.getElementById('form-feedback');

        // Modals
        this.editModal = document.getElementById('edit-modal');
        this.editForm = document.getElementById('edit-form');
        this.confirmModal = document.getElementById('confirm-modal');

        this.deleteId = null;

        // Theme Support
        this.themeManager = new ThemeManager();

        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
        this.setupRealTimeValidation();
    }

    setupEventListeners() {
        // Add Task
        this.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddTask();
        });

        // Task Actions (Delegation)
        this.taskList.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            const id = btn.dataset.id;
            if (btn.classList.contains('btn-check')) this.toggleStatus(id);
            if (btn.classList.contains('btn-edit')) this.openEditModal(id);
            if (btn.classList.contains('btn-delete')) this.confirmDelete(id);
        });

        // Edit Modal Actions
        this.editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEditTask();
        });

        document.getElementById('close-modal').addEventListener('click', () => {
            this.closeModal(this.editModal);
        });

        // Delete Modal Actions
        document.getElementById('confirm-delete').addEventListener('click', () => {
            this.handleDeleteTask();
        });

        document.getElementById('cancel-delete').addEventListener('click', () => {
            this.closeModal(this.confirmModal);
        });

        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });
    }

    // --- Core Operations ---

    handleAddTask() {
        const titleInput = document.getElementById('task-title');
        const descInput = document.getElementById('task-description');

        const title = titleInput.value.trim();
        const description = descInput.value.trim();

        if (!this.validateField(titleInput, 'task-title-error')) {
            return;
        }

        const newTask = new Task(title, description);
        this.tasks.unshift(newTask); // New tasks at the top
        this.saveAndRender();

        this.taskForm.reset();
        this.showFeedback('Tarea añadida con éxito', 'success');
    }

    handleEditTask() {
        const id = document.getElementById('edit-task-id').value;
        const titleInput = document.getElementById('edit-title');
        const title = titleInput.value.trim();
        const description = document.getElementById('edit-description').value.trim();

        if (!this.validateField(titleInput, 'edit-title-error')) {
            return;
        }

        this.tasks = this.tasks.map(task =>
            task.id === id ? { ...task, title, description } : task
        );

        this.saveAndRender();
        this.closeModal(this.editModal);
        this.showFeedback('Tarea actualizada', 'success');
    }

    handleDeleteTask() {
        if (!this.deleteId) return;

        this.tasks = this.tasks.filter(task => task.id !== this.deleteId);
        this.saveAndRender();
        this.closeModal(this.confirmModal);
        this.showFeedback('Tarea eliminada', 'success');
        this.deleteId = null;
    }

    toggleStatus(id) {
        this.tasks = this.tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        this.saveAndRender();
    }

    // --- Helpers ---

    saveAndRender() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.render();
    }

    render() {
        this.taskList.innerHTML = '';
        this.taskCount.textContent = `${this.tasks.length} ${this.tasks.length === 1 ? 'tarea' : 'tareas'}`;

        if (this.tasks.length === 0) {
            this.taskList.innerHTML = `<li class="task-muted text-center" style="margin-top: 2rem; color: #64748b; text-align: center; width: 100%;">No hay tareas pendientes. Empieza por añadir una.</li>`;
            return;
        }

        this.tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <div class="task-content">
                    <span class="task-title">${this.escapeHTML(task.title)}</span>
                    ${task.description ? `<p class="task-desc">${this.escapeHTML(task.description)}</p>` : ''}
                    <span class="task-meta">Creada: ${task.createdAt}</span>
                </div>
                <div class="task-actions">
                    <button class="action-btn btn-check" data-id="${task.id}" title="${task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${task.completed ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>' : '<circle cx="12" cy="12" r="10"></circle>'}</svg>
                    </button>
                    <button class="action-btn btn-edit" data-id="${task.id}" title="Editar tarea">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="action-btn btn-delete" data-id="${task.id}" title="Eliminar tarea">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </div>
            `;
            this.taskList.appendChild(li);
        });
    }

    openEditModal(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        document.getElementById('edit-task-id').value = task.id;
        document.getElementById('edit-title').value = task.title;
        document.getElementById('edit-description').value = task.description;

        this.editModal.classList.add('active');
    }

    confirmDelete(id) {
        this.deleteId = id;
        this.confirmModal.classList.add('active');
    }

    closeModal(modal) {
        modal.classList.remove('active');
    }

    showFeedback(message, type) {
        this.feedback.textContent = message;
        this.feedback.className = `feedback ${type}`;

        setTimeout(() => {
            if (this.feedback.textContent === message) {
                this.feedback.textContent = '';
                this.feedback.className = 'feedback';
            }
        }, 3000);
    }

    validateField(input, errorId) {
        const value = input.value.trim();
        const errorElement = document.getElementById(errorId);

        if (!value) {
            input.classList.add('c-input--error');
            errorElement.classList.add('is-visible');
            input.focus();
            return false;
        }

        input.classList.remove('c-input--error');
        errorElement.classList.remove('is-visible');
        return true;
    }

    setupRealTimeValidation() {
        const inputs = [
            { field: document.getElementById('task-title'), error: 'task-title-error' },
            { field: document.getElementById('edit-title'), error: 'edit-title-error' }
        ];

        inputs.forEach(({ field, error }) => {
            field.addEventListener('input', () => {
                if (field.value.trim()) {
                    field.classList.remove('c-input--error');
                    document.getElementById(error).classList.remove('is-visible');
                }
            });
        });
    }

    escapeHTML(str) {
        const p = document.createElement('p');
        p.textContent = str;
        return p.innerHTML;
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});
