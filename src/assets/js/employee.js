// ToDo List Celebration Effect
function triggerCelebration() {
  // Using canvas-confetti
  confetti({
    particleCount: 200,
    spread: 70,
    origin: { y: 0.6 },
  });
}

// ToDo List Basic Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and is an employee
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    // TEMPORARILY COMMENTED OUT FOR DEVELOPMENT
    // if (!loggedInUser || loggedInUser.role !== 'employee') {
    //     window.location.href = "../auth/auth.html";
    //     return;
    // }

    // Set employee name (with fallback for development)
    const employeeNameElement = document.getElementById("employeeName");
    if (employeeNameElement) {
        employeeNameElement.textContent = loggedInUser ? loggedInUser.username : "Development Mode";
    }

    // Add logout functionality
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            sessionStorage.removeItem("loggedInUser");
            // TEMPORARILY COMMENTED OUT FOR DEVELOPMENT
            // window.location.href = "../auth/auth.html";
            alert("Logout functionality temporarily disabled for development");
        });
    }

    // Use logged-in user ID
    const loggedInUserId = loggedInUser.id;

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
    
    let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let tasks = allTasks.filter(t => t.userId === loggedInUserId);
    
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
            saveTasks();
            updateUI();
        });
    }
    
    function addTask(text, priority = 'medium', dueDate = '') {
        const task = {
            id: Date.now(),
            userId: loggedInUserId,
            text: text,
            priority: priority,
            dueDate: dueDate,
            completed: false,
            createdAt: new Date(),
            file: null,
            description: ''
        };
        tasks.push(task);
        saveTasks();
    }
    
    function toggleTask(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            const today = new Date().toISOString().split('T')[0];
            if (task.dueDate && task.dueDate < today && !task.completed) {
                showNotification("Cannot complete an overdue task.", "error");
                const checkbox = document.querySelector(`input[onchange="toggleTask(${id})"]`);
                if(checkbox) checkbox.checked = false;
                return;
            }

            if (!task.completed) {
                // Task is being completed - show completion modal
                showCompletionModal(task);
            } else {
                // Task is being unchecked
                task.completed = false;
                task.completedAt = null;
                task.description = '';
                task.file = null;
                saveTasks();
                updateUI();
            }
        }
    }
    
    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
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
                    ${task.completed ? `
                        <div class="mt-2">
                            <textarea class="form-control form-control-sm" rows="2" placeholder="Add a description..." onchange="addDescription(${task.id}, this.value)">${task.description}</textarea>
                            <input type="file" class="form-control form-control-sm mt-2" onchange="uploadFile(${task.id}, this.files[0])">
                            ${task.file ? `<div class="mt-1"><i class="fas fa-paperclip me-1"></i><a href="${task.file.url}" target="_blank">${task.file.name}</a></div>` : ''}
                        </div>
                    ` : ''}
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

        // Check for celebration
        if (total > 0 && completed === total) {
            triggerCelebration();
            showNotification('All Tasks Completed!');
        }
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
    
    function uploadFile(id, file) {
        const task = tasks.find(t => t.id === id);
        if (task && file) {
            // For demonstration, we'll use a local URL.
            // In a real app, you would upload to a server.
            task.file = {
                name: file.name,
                url: URL.createObjectURL(file)
            };
            saveTasks();
            updateUI();
            showNotification("File uploaded successfully!");
        }
    }

    function addDescription(id, description) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.description = description;
            saveTasks();
            updateUI();
            showNotification("Description added successfully!");
        }
    }

    function showNotification(message, type = 'success') {
        const notificationText = document.getElementById('notificationText');
        const notification = document.getElementById('notification');
        
        if (notificationText && notification) {
            notificationText.textContent = message;
            
            // Adjust notification style based on type
            notification.classList.remove('bg-success', 'bg-danger');
            if (type === 'error') {
                notification.classList.add('bg-danger');
            } else {
                notification.classList.add('bg-success');
            }

            const toast = new bootstrap.Toast(notification);
            toast.show();
        }
    }

    function saveTasks() {
        const otherUserTasks = allTasks.filter(t => t.userId !== loggedInUserId);
        localStorage.setItem('tasks', JSON.stringify([...otherUserTasks, ...tasks]));
    }

    // Task completion modal functions
    let currentTaskToComplete = null;

    function showCompletionModal(task) {
        currentTaskToComplete = task;
        document.getElementById('taskToComplete').textContent = task.text;
        document.getElementById('completionDescription').value = '';
        document.getElementById('completionFile').value = '';
        
        const modal = new bootstrap.Modal(document.getElementById('completionModal'));
        modal.show();
    }

    // Handle completion confirmation
    document.getElementById('confirmCompletion').addEventListener('click', function() {
        if (currentTaskToComplete) {
            const description = document.getElementById('completionDescription').value.trim();
            const fileInput = document.getElementById('completionFile');
            
            // Mark task as completed
            currentTaskToComplete.completed = true;
            currentTaskToComplete.completedAt = new Date().toISOString();
            currentTaskToComplete.description = description;
            
            // Handle file upload if present
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const fileUrl = URL.createObjectURL(file);
                currentTaskToComplete.file = {
                    name: file.name,
                    url: fileUrl,
                    type: file.type,
                    size: file.size
                };
            }
            
            saveTasks();
            updateUI();
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('completionModal'));
            modal.hide();
            
            // Show notification
            const completedCount = tasks.filter(t => t.completed).length;
            if (completedCount !== tasks.length) {
                showNotification('Task completed successfully!');
            }
            
            currentTaskToComplete = null;
        }
    });
    
    // Make functions global so they can be called from HTML
    window.toggleTask = toggleTask;
    window.deleteTask = deleteTask;
    window.uploadFile = uploadFile;
    window.addDescription = addDescription;
    
    // Initialize UI
    updateUI();
});