document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and is an admin
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    // TEMPORARILY COMMENTED OUT FOR DEVELOPMENT
    // if (!loggedInUser || loggedInUser.role !== 'admin') {
    //     window.location.href = "../auth/auth.html";
    //     return;
    // }

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

    const userList = document.getElementById('userList');
    const assignUser = document.getElementById('assignUser');
    const allTasksList = document.getElementById('allTasksList');
    const assignTaskForm = document.getElementById('assignTaskForm');

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function renderUsers() {
        userList.innerHTML = '';
        assignUser.innerHTML = '';
        
        // Filter out admin users for cleaner display
        const nonAdminUsers = users.filter(user => user.role !== 'admin');
        
        nonAdminUsers.forEach(user => {
            const userElement = document.createElement('a');
            userElement.href = '#';
            userElement.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
            
            const userInfo = document.createElement('div');
            userInfo.innerHTML = `
                <div class="fw-bold">${user.username}</div>
                <small class="text-muted">${user.role}</small>
            `;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-danger btn-sm';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteUser(user.id);
            };
            
            userElement.appendChild(userInfo);
            userElement.appendChild(deleteBtn);
            userElement.onclick = () => renderTasks(user.id);
            userList.appendChild(userElement);

            const optionElement = document.createElement('option');
            optionElement.value = user.id;
            optionElement.textContent = `${user.username} (${user.role})`;
            assignUser.appendChild(optionElement);
        });
    }

    function deleteUser(userId) {
        if (confirm('Are you sure you want to delete this user and all their tasks?')) {
            // Remove user
            users = users.filter(user => user.id !== userId);
            
            // Remove user's tasks
            tasks = tasks.filter(task => task.userId !== userId);
            
            // Update localStorage
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            // Re-render
            renderUsers();
            renderTasks();
            
            showToast('User deleted successfully', 'success');
        }
    }

    function renderTasks(userId = null) {
        allTasksList.innerHTML = '';
        const filteredTasks = userId ? tasks.filter(t => t.userId === userId) : tasks;

        if (filteredTasks.length === 0) {
            allTasksList.innerHTML = '<div class="text-center text-muted py-4">No tasks found</div>';
            return;
        }

        filteredTasks.forEach(task => {
            const user = users.find(u => u.id === task.userId);
            const userName = user ? user.username : 'Unknown User';
            const assignedBy = task.assignedBy ? users.find(u => u.id === task.assignedBy)?.username || 'Unknown' : 'Self';
            
            const taskElement = document.createElement('div');
            taskElement.className = `list-group-item ${task.completed ? 'completed-task' : ''}`;
            
            const priorityBadge = task.priority === 'high' ? 'danger' : 
                                 task.priority === 'medium' ? 'warning' : 'secondary';
            
            const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
            
            taskElement.innerHTML = `
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <div class="fw-bold ${task.completed ? 'text-decoration-line-through' : ''}">${task.text}</div>
                        <small class="text-muted">
                            <i class="fas fa-user me-1"></i>${userName} | 
                            <i class="fas fa-user-tag me-1"></i>Assigned by: ${assignedBy}
                            ${task.dueDate ? ` | <i class="fas fa-calendar me-1"></i>${new Date(task.dueDate).toLocaleDateString()}` : ''}
                            ${isOverdue ? ' <span class="text-danger"><i class="fas fa-exclamation-triangle"></i> Overdue</span>' : ''}
                        </small>
                        ${task.completedAt ? `<div><small class="text-success"><i class="fas fa-check me-1"></i>Completed: ${new Date(task.completedAt).toLocaleString()}</small></div>` : ''}
                        ${task.notes ? `<div class="mt-2"><small><strong>Notes:</strong> ${task.notes}</small></div>` : ''}
                        ${task.fileName ? `<div><small><i class="fas fa-file me-1"></i>Attachment: ${task.fileName}</small></div>` : ''}
                    </div>
                    <div class="d-flex align-items-center">
                        <span class="badge bg-${priorityBadge} me-2">${task.priority}</span>
                        ${task.completed ? 
                            '<span class="badge bg-success">Completed</span>' : 
                            '<span class="badge bg-warning">Pending</span>'}
                        <button class="btn btn-danger btn-sm ms-2" onclick="deleteTask(${task.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
            allTasksList.appendChild(taskElement);
        });
    }

    function deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(task => task.id !== taskId);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
            showToast('Task deleted successfully', 'success');
        }
    }

    // Make deleteTask available globally
    window.deleteTask = deleteTask;

    // Task assignment form handler
    if (assignTaskForm) {
        assignTaskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const selectedUserId = parseInt(document.getElementById('assignUser').value);
            const taskText = document.getElementById('assignTaskText').value;
            const priority = document.getElementById('assignPriority').value;
            const dueDate = document.getElementById('assignDueDate').value;

            if (!selectedUserId || !taskText) {
                showToast('Please fill in all required fields', 'error');
                return;
            }

            const newTask = {
                id: Date.now(),
                userId: selectedUserId,
                text: taskText,
                priority: priority,
                dueDate: dueDate,
                completed: false,
                createdAt: new Date().toISOString(),
                assignedBy: loggedInUser.id,
                notes: '',
                fileName: null,
                fileContent: null
            };

            tasks.push(newTask);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            renderTasks();
            assignTaskForm.reset();
            showToast('Task assigned successfully', 'success');
        });
    }

    // Toast notification function
    function showToast(message, type = 'info') {
        // Create toast container if it doesn't exist
        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            toastContainer.style.zIndex = '9999';
            document.body.appendChild(toastContainer);
        }

        const toastId = 'toast_' + Date.now();
        const bgColor = type === 'success' ? 'bg-success' : 
                       type === 'error' ? 'bg-danger' : 'bg-info';

        const toastHTML = `
            <div id="${toastId}" class="toast show" role="alert">
                <div class="toast-header ${bgColor} text-white">
                    <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'} me-2"></i>
                    <strong class="me-auto">Admin Panel</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHTML);

        // Auto-hide after 3 seconds
        setTimeout(() => {
            const toastElement = document.getElementById(toastId);
            if (toastElement) {
                toastElement.remove();
            }
        }, 3000);
    }

    // Initialize the admin panel
    renderUsers();
    renderTasks();
});
