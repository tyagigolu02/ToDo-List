// ToDo List Basic Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Basic functionality for form submission
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskPriority = document.getElementById('taskPriority');
    const taskDueDate = document.getElementById('taskDueDate');
    const tasksList = document.getElementById('tasksList');
    const emptyState = document.getElementById('emptyState');
    const clearCompleted = document.getElementById('clearCompleted');
    
    // Stats elements
    const totalTasks = document.getElementById('totalTasks');
    const completedTasks = document.getElementById('completedTasks');
    const pendingTasks = document.getElementById('pendingTasks');
    const overdueTasks = document.getElementById('overdueTasks');
    
    // Filter elements
    const filterBtns = document.querySelectorAll('.filter-btn');
    let currentFilter = 'all';
    
    let tasks = [];
    
    // Add task functionality
    if (taskForm) {
        taskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const taskText = taskInput.value.trim();
            const priority = taskPriority.value;
            const dueDate = taskDueDate.value;
            
            if (taskText) {
                addTask(taskText, priority, dueDate);
                taskInput.value = '';
                taskDueDate.value = '';
                updateUI();
            }
        });
    }
    
    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentFilter = this.dataset.filter;
            updateUI();
        });
    });
    
    // Clear completed functionality
    if (clearCompleted) {
        clearCompleted.addEventListener('click', function() {
            tasks = tasks.filter(task => !task.completed);
            updateUI();
        });
    }
    
    function addTask(text, priority = 'medium', dueDate = '') {
        const task = {
            id: Date.now(),
            text: text,
            priority: priority,
            dueDate: dueDate,
            completed: false,
            createdAt: new Date()
        };
        tasks.push(task);
    }
    
    function toggleTask(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            updateUI();
            
            // Show notification
            if (task.completed) {
                showNotification('Task completed!');
            }
        }
    }
    
    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        updateUI();
    }
    
    function renderTasks() {
        if (!tasksList) return;
        
        // Filter tasks based on current filter
        let filteredTasks = tasks;
        const today = new Date().toISOString().split('T')[0];
        
        switch (currentFilter) {
            case 'active':
                filteredTasks = tasks.filter(task => !task.completed);
                break;
            case 'completed':
                filteredTasks = tasks.filter(task => task.completed);
                break;
            case 'overdue':
                filteredTasks = tasks.filter(task => 
                    !task.completed && task.dueDate && task.dueDate < today
                );
                break;
        }
        
        tasksList.innerHTML = '';
        
        filteredTasks.forEach(task => {
            const isOverdue = !task.completed && task.dueDate && task.dueDate < today;
            
            const taskElement = document.createElement('div');
            taskElement.className = `list-group-item task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`;
            
            taskElement.innerHTML = `
                <div class="form-check">
                    <input class="form-check-input task-checkbox" type="checkbox" 
                           ${task.completed ? 'checked' : ''} 
                           onchange="toggleTask(${task.id})">
                </div>
                <div class="task-content flex-grow-1">
                    <div class="task-text ${task.completed ? 'text-decoration-line-through' : ''}">${task.text}</div>
                    <div class="d-flex gap-2 mt-1">
                        <span class="badge task-priority ${task.priority}">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                        ${task.dueDate ? `<small class="text-light"><i class="fas fa-calendar me-1"></i>${new Date(task.dueDate).toLocaleDateString()}</small>` : ''}
                        ${isOverdue ? '<small class="text-danger"><i class="fas fa-exclamation-triangle me-1"></i>Overdue</small>' : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteTask(${task.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            tasksList.appendChild(taskElement);
        });
    }
    
    function updateUI() {
        // Update stats
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const pending = total - completed;
        const today = new Date().toISOString().split('T')[0];
        const overdue = tasks.filter(task => 
            !task.completed && task.dueDate && task.dueDate < today
        ).length;
        
        if (totalTasks) totalTasks.textContent = total;
        if (completedTasks) completedTasks.textContent = completed;
        if (pendingTasks) pendingTasks.textContent = pending;
        if (overdueTasks) overdueTasks.textContent = overdue;
        
        // Show/hide empty state
        if (emptyState) {
            emptyState.style.display = total === 0 ? 'block' : 'none';
        }
        
        // Render tasks
        renderTasks();
        
        // Update progress ring
        updateProgressRing(total > 0 ? (completed / total) * 100 : 0);
    }
    
    function updateProgressRing(percentage) {
        const circle = document.querySelector('.progress-ring-circle');
        const text = document.getElementById('progressPercent');
        
        if (circle && text) {
            const circumference = 2 * Math.PI * 25; // radius = 25
            const offset = circumference - (percentage / 100) * circumference;
            
            circle.style.strokeDashoffset = offset;
            text.textContent = Math.round(percentage) + '%';
            
            // Update circle color based on progress
            if (percentage === 100) {
                circle.style.stroke = '#4caf50';
            } else if (percentage > 0) {
                circle.style.stroke = '#667eea';
            } else {
                circle.style.stroke = 'rgba(255, 255, 255, 0.2)';
            }
        }
    }
    
    function showNotification(message) {
        const notificationText = document.getElementById('notificationText');
        const notification = document.getElementById('notification');
        
        if (notificationText && notification) {
            notificationText.textContent = message;
            const toast = new bootstrap.Toast(notification);
            toast.show();
        }
    }
    
    // Make functions global so they can be called from HTML
    window.toggleTask = toggleTask;
    window.deleteTask = deleteTask;
    
    // Initialize UI
    updateUI();
});