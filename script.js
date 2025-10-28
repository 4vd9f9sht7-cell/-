document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const addTaskForm = document.getElementById('addTaskForm');
    const taskTitleInput = document.getElementById('taskTitle');
    const taskDescriptionInput = document.getElementById('taskDescription');
    const tasksContainer = document.getElementById('tasksContainer');
    const emptyState = document.getElementById('emptyState');

    // Массив для хранения задач
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Функция для отображения задач
    function renderTasks() {
        tasksContainer.innerHTML = '';
        
        if (tasks.length === 0) {
            tasksContainer.appendChild(emptyState);
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        
        tasks.forEach((task, index) => {
            const taskCard = document.createElement('div');
            taskCard.className = 'task-card';
            taskCard.innerHTML = `
                <div class="task-header">
                    <h3 class="task-title">${escapeHtml(task.title)}</h3>
                    <button class="btn btn-danger delete-btn" data-index="${index}">Удалить</button>
                </div>
                ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
            `;
            
            tasksContainer.appendChild(taskCard);
        });
        
        // Добавляем обработчики событий для кнопок удаления
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                deleteTask(index);
            });
        });
    }

    // Функция для добавления новой задачи
    function addTask(title, description) {
        const newTask = {
            title: title,
            description: description,
            createdAt: new Date().toISOString()
        };
        
        tasks.push(newTask);
        saveTasksToStorage();
        renderTasks();
    }

    // Функция для удаления задачи
    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasksToStorage();
        renderTasks();
    }

    // Функция для сохранения задач в localStorage
    function saveTasksToStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Функция для экранирования HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Обработчик отправки формы
    addTaskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = taskTitleInput.value.trim();
        const description = taskDescriptionInput.value.trim();
        
        if (title) {
            addTask(title, description);
            
            // Очистка формы
            taskTitleInput.value = '';
            taskDescriptionInput.value = '';
            taskTitleInput.focus();
        }
    });

    // Инициализация приложения
    renderTasks();
});
