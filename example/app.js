/**
 * Example CRUD Logic following UI Standards
 */

let tasks = JSON.parse(localStorage.getItem('ui-standard-tasks')) || [];

const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const taskCount = document.getElementById('task-count');
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-form');
const closeModalBtn = document.getElementById('close-modal');

// --- Render Logic ---

function renderTasks() {
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }

    tasks.forEach(task => {
        const taskEl = document.createElement('div');
        taskEl.className = 'task-item';
        taskEl.innerHTML = `
            <div class="task-item__content">
                <span class="task-item__title">${task.title}</span>
                <span class="task-item__desc">${task.description || 'Sin descripción'}</span>
            </div>
            <div class="task-item__actions">
                <button class="c-button c-button--secondary c-button--sm" onclick="openEditModal('${task.id}')">
                    Editar
                </button>
                <button class="c-button c-button--danger c-button--sm" onclick="deleteTask('${task.id}')">
                    Borrar
                </button>
            </div>
        `;
        taskList.appendChild(taskEl);
    });

    taskCount.textContent = `${tasks.length} ${tasks.length === 1 ? 'tarea' : 'tareas'}`;
    localStorage.setItem('ui-standard-tasks', JSON.stringify(tasks));
}

// --- CRUD Operations ---

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = taskForm.querySelector('button[type="submit"]');
    submitBtn.classList.add('is-loading');

    const newTask = {
        id: Date.now().toString(),
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-desc').value
    };

    // Simulate async operation
    setTimeout(() => {
        tasks.push(newTask);
        taskForm.reset();
        submitBtn.classList.remove('is-loading');
        renderTasks();
    }, 500);
});

window.deleteTask = (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
    }
};

// --- Modal Logic ---

window.openEditModal = (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    document.getElementById('edit-id').value = task.id;
    document.getElementById('edit-title').value = task.title;
    document.getElementById('edit-desc').value = task.description;

    editModal.classList.add('c-modal--active');
};

const closeModal = () => {
    editModal.classList.remove('c-modal--active');
};

closeModalBtn.addEventListener('click', closeModal);

editForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('edit-id').value;
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex !== -1) {
        tasks[taskIndex].title = document.getElementById('edit-title').value;
        tasks[taskIndex].description = document.getElementById('edit-desc').value;
        renderTasks();
        closeModal();
    }
});

// Initial Render
renderTasks();
