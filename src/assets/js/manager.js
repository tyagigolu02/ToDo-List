document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in and has manager role
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    // TEMPORARILY COMMENTED OUT FOR DEVELOPMENT
    // if (!loggedInUser || loggedInUser.role !== 'manager') {
    //     window.location.href = "../auth/auth.html";
    //     return;
    // }

    // Set manager name (with fallback for development)
    const managerNameElement = document.getElementById("managerName");
    if (managerNameElement) {
        managerNameElement.textContent = loggedInUser ? loggedInUser.username : "Development Mode";
    }

    // DOM elements
    const addEmployeeForm = document.getElementById("addEmployeeForm");
    const assignTaskForm = document.getElementById("assignTaskForm");
    const assignEmployee = document.getElementById("assignEmployee");
    const taskDescription = document.getElementById("taskDescription");
    const taskPriority = document.getElementById("taskPriority");
    const taskDueDate = document.getElementById("taskDueDate");
    const employeeList = document.getElementById("employeeList");
    const tasksOverview = document.getElementById("tasksOverview");
    const logoutBtn = document.getElementById("logoutBtn");

    // Employee details panel elements
    const employeeDetailsPanel = document.getElementById("employeeDetailsPanel");
    const allTasksPanel = document.getElementById("allTasksPanel");
    const closeEmployeeDetails = document.getElementById("closeEmployeeDetails");
    const selectedEmployeeName = document.getElementById("selectedEmployeeName");
    const employeeUsername = document.getElementById("employeeUsername");
    const employeeEmail = document.getElementById("employeeEmail");
    const employeeTotalTasks = document.getElementById("employeeTotalTasks");
    const employeeCompletedTasks = document.getElementById("employeeCompletedTasks");
    const employeePendingTasks = document.getElementById("employeePendingTasks");
    const employeeTasksList = document.getElementById("employeeTasksList");

    // New employee form elements
    const newEmployeeUsername = document.getElementById("newEmployeeUsername");
    const newEmployeePassword = document.getElementById("newEmployeePassword");
    const newEmployeeEmail = document.getElementById("newEmployeeEmail");

    // Statistics elements
    const totalEmployees = document.getElementById("totalEmployees");
    const totalTasks = document.getElementById("totalTasks");
    const completedTasks = document.getElementById("completedTasks");
    const pendingTasks = document.getElementById("pendingTasks");

    // Filter buttons
    const filterButtons = document.querySelectorAll('[data-filter]');
    const employeeFilterButtons = document.querySelectorAll('[data-employee-filter]');
    let currentFilter = 'all';
    let currentEmployeeFilter = 'all';
    let selectedEmployeeId = null;

    // Profile and Settings elements
    const profileForm = document.getElementById("profileForm");
    const saveProfileBtn = document.getElementById("saveProfileBtn");
    const saveSettingsBtn = document.getElementById("saveSettingsBtn");
    const exportDataBtn = document.getElementById("exportDataBtn");
    const generateReportBtn = document.getElementById("generateReportBtn");
    const reportPeriod = document.getElementById("reportPeriod");
    const customDateRange = document.getElementById("customDateRange");
    const backupNowBtn = document.getElementById("backupNowBtn");
    const clearDataBtn = document.getElementById("clearDataBtn");

    // Initialize
    loadEmployees();
    loadTasks();
    updateStatistics();
    loadManagerSettings();
    
    // Fix positioning issues
    fixModalPositioning();
    initializeBootstrapComponents();
    
    // Add resize event listener
    window.addEventListener('resize', handleWindowResize);
    
    // Initialize tooltips for better UX
    function initializeTooltips() {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            // Dispose existing tooltip if any
            const existingTooltip = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
            if (existingTooltip) {
                existingTooltip.dispose();
            }
            return new bootstrap.Tooltip(tooltipTriggerEl, {
                placement: 'top',
                trigger: 'hover'
            });
        });
    }
    
    initializeTooltips();

    // Event listeners
    addEmployeeForm.addEventListener("submit", handleAddEmployee);
    assignTaskForm.addEventListener("submit", handleAssignTask);
    logoutBtn.addEventListener("click", handleLogout);
    closeEmployeeDetails.addEventListener("click", closeEmployeeDetailsPanel);

    // Filter event listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            currentFilter = e.target.dataset.filter;
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            loadTasks();
        });
    });

    // Employee filter event listeners
    employeeFilterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            currentEmployeeFilter = e.target.dataset.employeeFilter;
            employeeFilterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            if (selectedEmployeeId) {
                loadEmployeeTasks(selectedEmployeeId);
            }
        });
    });

    // Report period change handler (using event delegation)
    document.addEventListener('change', function(e) {
        if (e.target && e.target.id === 'reportPeriod') {
            const customDateRange = document.getElementById('customDateRange');
            if (customDateRange) {
                if (e.target.value === "custom") {
                    customDateRange.classList.remove('custom-date-range-hidden');
                    customDateRange.classList.add('custom-date-range-visible');
                } else {
                    customDateRange.classList.remove('custom-date-range-visible');
                    customDateRange.classList.add('custom-date-range-hidden');
                }
            }
        }
    });

    function handleAddEmployee(e) {
        e.preventDefault();
        
        const username = newEmployeeUsername.value.trim();
        const password = newEmployeePassword.value.trim();
        const email = newEmployeeEmail.value.trim();

        if (!username || !password) {
            showEmployeeToast("Please fill in username and password.", "error");
            return;
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const existingUser = users.find(user => user.username === username);

        if (existingUser) {
            showEmployeeToast("Username already exists. Please choose a different username.", "error");
            return;
        }

        // Create new employee
        const newEmployee = {
            id: Date.now().toString(),
            username: username,
            password: password,
            email: email || null,
            role: 'employee',
            createdBy: loggedInUser.id,
            createdAt: new Date().toISOString()
        };

        users.push(newEmployee);
        localStorage.setItem("users", JSON.stringify(users));

        // Show credentials to manager
        const credentials = `Username: ${username}\nPassword: ${password}`;
        showEmployeeToast(`Employee account created successfully!\n\nCredentials:\n${credentials}\n\nPlease share these credentials with the employee.`, "success");

        // Reset form
        addEmployeeForm.reset();
        
        // Reload data
        loadEmployees();
        updateStatistics();
    }

    function loadEmployees() {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const employees = users.filter(user => user.role === 'employee');
        
        // Update employee select dropdown
        assignEmployee.innerHTML = '<option value="">Choose an employee...</option>';
        employees.forEach(employee => {
            const option = document.createElement('option');
            option.value = employee.id;
            option.textContent = employee.username;
            assignEmployee.appendChild(option);
        });

        // Update employee list with clickable items
        employeeList.innerHTML = '';
        employees.forEach(employee => {
            const employeeTasks = getTasksForUser(employee.id);
            const completedCount = employeeTasks.filter(task => task.completed).length;
            const pendingCount = employeeTasks.filter(task => !task.completed).length;

            const listItem = document.createElement('div');
            listItem.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center employee-item border-0 mb-2';
            listItem.style.cssText = `
                cursor: pointer;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                transition: all 0.3s ease;
            `;
            listItem.dataset.employeeId = employee.id;
            
            // Add hover effect
            listItem.addEventListener('mouseenter', () => {
                listItem.style.background = 'rgba(255, 255, 255, 0.15)';
                listItem.style.transform = 'translateY(-2px)';
                listItem.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            });
            
            listItem.addEventListener('mouseleave', () => {
                listItem.style.background = 'rgba(255, 255, 255, 0.1)';
                listItem.style.transform = 'translateY(0)';
                listItem.style.boxShadow = 'none';
            });
            
            listItem.innerHTML = `
                <div>
                    <h6 class="mb-1 text-white"><i class="fas fa-user me-2 text-primary"></i>${employee.username}</h6>
                    <small class="text-light">
                        ${employee.email ? `<i class="fas fa-envelope me-1"></i>${employee.email} | ` : ''}
                        <span class="badge bg-primary bg-opacity-75 me-1">${employeeTasks.length}</span>Total
                        <span class="badge bg-success bg-opacity-75 me-1">${completedCount}</span>Completed
                        <span class="badge bg-warning bg-opacity-75">${pendingCount}</span>Pending
                    </small>
                </div>
                <div class="d-flex align-items-center">
                    <span class="badge bg-light bg-opacity-75 text-dark me-2">${employee.role}</span>
                    <button class="btn btn-sm btn-outline-danger delete-employee border-0" 
                            data-employee-id="${employee.id}"
                            style="background: rgba(220, 53, 69, 0.1); color: #dc3545;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            // Add click event to show employee details
            listItem.addEventListener('click', (e) => {
                if (!e.target.closest('.delete-employee')) {
                    showEmployeeDetails(employee.id);
                }
            });

            // Add delete event
            const deleteBtn = listItem.querySelector('.delete-employee');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteEmployee(employee.id, employee.username);
            });

            employeeList.appendChild(listItem);
        });

        // Update total employees count
        totalEmployees.textContent = employees.length;
    }

    function showEmployeeDetails(employeeId) {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const employee = users.find(user => user.id === employeeId);
        
        if (!employee) return;

        selectedEmployeeId = employeeId;
        
        // Update employee info
        selectedEmployeeName.textContent = `${employee.username}'s Details`;
        employeeUsername.textContent = employee.username;
        employeeEmail.textContent = employee.email || 'Not provided';
        
        // Calculate task statistics
        const employeeTasks = getTasksForUser(employeeId);
        const completedCount = employeeTasks.filter(task => task.completed).length;
        const pendingCount = employeeTasks.filter(task => !task.completed).length;
        const progressPercentage = employeeTasks.length > 0 ? Math.round((completedCount / employeeTasks.length) * 100) : 0;
        
        employeeTotalTasks.textContent = employeeTasks.length;
        employeeCompletedTasks.textContent = completedCount;
        employeePendingTasks.textContent = pendingCount;
        
        // Add progress bar after statistics
        const progressContainer = document.querySelector('#employeeDetailsPanel .info-card:last-child');
        let progressBar = progressContainer.querySelector('.progress-wrapper');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'progress-wrapper mt-3';
            progressBar.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <strong><i class="fas fa-chart-line me-2"></i>Progress:</strong>
                    <span class="badge bg-info">${progressPercentage}%</span>
                </div>
                <div class="progress" style="height: 8px;">
                    <div class="progress-bar bg-success" role="progressbar" style="width: ${progressPercentage}%"></div>
                </div>
            `;
            progressContainer.appendChild(progressBar);
        } else {
            // Update existing progress bar
            progressBar.querySelector('.badge').textContent = `${progressPercentage}%`;
            progressBar.querySelector('.progress-bar').style.width = `${progressPercentage}%`;
        }
        
        // Show employee details panel and hide all tasks panel
        employeeDetailsPanel.classList.remove('employee-details-panel-hidden');
        allTasksPanel.style.display = 'none';
        
        // Load employee tasks
        loadEmployeeTasks(employeeId);
        
        // Reset employee filter
        currentEmployeeFilter = 'all';
        employeeFilterButtons.forEach(btn => btn.classList.remove('active'));
        employeeFilterButtons[0].classList.add('active');
        
        // Reinitialize tooltips for new content
        setTimeout(() => {
            initializeTooltips();
        }, 100);
    }

    function closeEmployeeDetailsPanel() {
        employeeDetailsPanel.classList.add('employee-details-panel-hidden');
        allTasksPanel.style.display = 'block';
        selectedEmployeeId = null;
    }

    function loadEmployeeTasks(employeeId) {
        const tasks = getTasksForUser(employeeId);
        let filteredTasks = tasks;

        // Apply employee filter
        switch(currentEmployeeFilter) {
            case 'pending':
                filteredTasks = tasks.filter(task => !task.completed);
                break;
            case 'completed':
                filteredTasks = tasks.filter(task => task.completed);
                break;
            default:
                filteredTasks = tasks;
        }

        employeeTasksList.innerHTML = '';
        
        if (filteredTasks.length === 0) {
            const filterName = currentEmployeeFilter === 'all' ? 'tasks' : `${currentEmployeeFilter} tasks`;
            employeeTasksList.innerHTML = `
                <div class="text-center py-5">
                    <div class="mb-3">
                        <i class="fas fa-tasks fa-4x text-muted opacity-50"></i>
                    </div>
                    <h6 class="text-muted mb-2">No ${filterName} found</h6>
                    <p class="text-muted small">This employee doesn't have any ${filterName} yet.</p>
                </div>
            `;
            return;
        }

        filteredTasks.forEach(task => {
            const isTaskOverdue = isOverdue(task);
            
            const taskElement = document.createElement('div');
            taskElement.className = `employee-task-item task-priority-${task.priority} ${task.completed ? 'completed' : ''}`;
            
            const priorityColors = {
                high: 'danger',
                medium: 'warning', 
                low: 'success'
            };

            const priorityIcons = {
                high: '🔴',
                medium: '🟡',
                low: '🟢'
            };

            taskElement.innerHTML = `
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center mb-2">
                            <span class="badge bg-${priorityColors[task.priority]} me-2">${priorityIcons[task.priority]} ${task.priority.toUpperCase()}</span>
                            ${task.completed ? '<span class="badge bg-success ms-2"><i class="fas fa-check me-1"></i>Completed</span>' : ''}
                            ${isTaskOverdue && !task.completed ? '<span class="badge bg-danger ms-2"><i class="fas fa-exclamation-triangle me-1"></i>Overdue</span>' : ''}
                        </div>
                        <h6 class="mb-2 ${task.completed ? 'text-decoration-line-through text-muted' : 'text-dark'}">${task.text}</h6>
                        <div class="task-meta">
                            <span><i class="fas fa-calendar-plus me-1"></i>Created: ${new Date(task.createdAt).toLocaleDateString()}</span>
                            ${task.dueDate ? `<span><i class="fas fa-calendar-check me-1"></i>Due: ${new Date(task.dueDate).toLocaleDateString()}</span>` : ''}
                            ${task.completed && task.completedAt ? `<span><i class="fas fa-calendar-check me-1"></i>Completed: ${new Date(task.completedAt).toLocaleDateString()}</span>` : ''}
                        </div>
                        ${task.description ? `<div class="mt-2 text-muted"><strong><i class="fas fa-sticky-note me-1"></i>Notes:</strong> ${task.description}</div>` : ''}
                        ${task.file ? `<div class="mt-2"><strong><i class="fas fa-paperclip me-1"></i>Attachment:</strong> <a href="${task.file.url}" target="_blank" class="text-decoration-none">${task.file.name}</a></div>` : ''}
                    </div>
                    <div class="text-end">
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteTask('${task.id}')" data-bs-toggle="tooltip" title="Delete Task">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            employeeTasksList.appendChild(taskElement);
        });
    }

    function deleteEmployee(employeeId, employeeUsername) {
        if (confirm(`Are you sure you want to delete employee "${employeeUsername}"? This will also delete all their tasks.`)) {
            // Remove employee from users
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const updatedUsers = users.filter(user => user.id !== employeeId);
            localStorage.setItem("users", JSON.stringify(updatedUsers));
            
            // Remove all tasks assigned to this employee
            const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            const updatedTasks = tasks.filter(task => task.userId !== employeeId);
            localStorage.setItem("tasks", JSON.stringify(updatedTasks));
            
            showEmployeeToast(`Employee "${employeeUsername}" and all their tasks have been deleted.`, "success");
            
            // Close employee details if this employee was selected
            if (selectedEmployeeId === employeeId) {
                closeEmployeeDetailsPanel();
            }
            
            // Reload data
            loadEmployees();
            loadTasks();
            updateStatistics();
        }
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        let filteredTasks = tasks;

        // Apply filter
        switch(currentFilter) {
            case 'pending':
                filteredTasks = tasks.filter(task => !task.completed);
                break;
            case 'completed':
                filteredTasks = tasks.filter(task => task.completed);
                break;
            case 'overdue':
                filteredTasks = tasks.filter(task => isOverdue(task) && !task.completed);
                break;
            default:
                filteredTasks = tasks;
        }

        tasksOverview.innerHTML = '';
        if (filteredTasks.length === 0) {
            tasksOverview.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-tasks fa-3x text-muted mb-3"></i>
                    <p class="text-muted">No tasks found for the selected filter.</p>
                </div>
            `;
            return;
        }

        filteredTasks.forEach(task => {
            const user = getUserById(task.userId);
            const assignedBy = task.assignedByName || (task.assignedBy ? getUserById(task.assignedBy)?.username : 'System');
            const isTaskOverdue = isOverdue(task);
            
            const taskElement = document.createElement('div');
            taskElement.className = `task-item mb-3 p-3 border rounded ${isTaskOverdue && !task.completed ? 'border-danger' : 'border-light'}`;
            
            const priorityColors = {
                high: 'danger',
                medium: 'warning', 
                low: 'success'
            };

            const priorityIcons = {
                high: '🔴',
                medium: '🟡',
                low: '🟢'
            };

            taskElement.innerHTML = `
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center mb-2">
                            <span class="badge bg-${priorityColors[task.priority]} me-2">${priorityIcons[task.priority]} ${task.priority.toUpperCase()}</span>
                            <strong class="text-primary employee-link" data-employee-id="${task.userId}" style="cursor: pointer;">${user ? user.username : 'Unknown User'}</strong>
                            ${task.completed ? '<span class="badge bg-success ms-2">✓ Completed</span>' : ''}
                            ${isTaskOverdue && !task.completed ? '<span class="badge bg-danger ms-2">⚠ Overdue</span>' : ''}
                        </div>
                        <p class="mb-2 ${task.completed ? 'text-decoration-line-through text-muted' : ''}">${task.text}</p>
                        <small class="text-muted">
                            <i class="fas fa-user me-1"></i>Assigned by: ${assignedBy} |
                            <i class="fas fa-calendar-alt me-1"></i>Created: ${new Date(task.createdAt).toLocaleDateString()}
                            ${task.dueDate ? ` | Due: ${new Date(task.dueDate).toLocaleDateString()}` : ''}
                            ${task.completed && task.completedAt ? ` | Completed: ${new Date(task.completedAt).toLocaleDateString()}` : ''}
                        </small>
                        ${task.description ? `<p class="mt-2 text-muted"><strong>Notes:</strong> ${task.description}</p>` : ''}
                        ${task.file ? `<p class="mt-2"><strong>Attachment:</strong> <a href="${task.file.url}" target="_blank">${task.file.name}</a></p>` : ''}
                    </div>
                    <div class="text-end">
                        <button class="btn btn-sm btn-outline-info me-1" onclick="showEmployeeDetails('${task.userId}')" 
                                title="View Employee Details" data-bs-toggle="tooltip">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteTask('${task.id}')" 
                                title="Delete Task" data-bs-toggle="tooltip">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
            // Add click event to employee name
            const employeeLink = taskElement.querySelector('.employee-link');
            employeeLink.addEventListener('click', () => {
                showEmployeeDetails(task.userId);
            });
            
            tasksOverview.appendChild(taskElement);
        });
        
        // Initialize tooltips after adding elements
        initializeTooltips();
    }

    function handleAssignTask(e) {
        e.preventDefault();
        
        const employeeId = assignEmployee.value;
        const description = taskDescription.value.trim();
        const priority = taskPriority.value;
        const dueDate = taskDueDate.value;

        if (!employeeId || !description) {
            showToast("Please fill in all required fields.", "error");
            return;
        }

        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const newTask = {
            id: Date.now().toString(),
            userId: employeeId,
            text: description,
            priority: priority,
            dueDate: dueDate || null,
            completed: false,
            createdAt: new Date().toISOString(),
            assignedBy: loggedInUser.id,
            assignedByName: loggedInUser.username
        };

        tasks.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(tasks));

        // Reset form
        assignTaskForm.reset();
        
        // Reload data
        loadEmployees();
        loadTasks();
        updateStatistics();
        
        // If employee details is open, refresh it
        if (selectedEmployeeId) {
            loadEmployeeTasks(selectedEmployeeId);
        }

        const employee = getUserById(employeeId);
        showToast(`Task assigned to ${employee.username} successfully!`, "success");
    }

    function showEmployeeToast(message, type = "success") {
        const toast = document.getElementById("employeeToast");
        const toastBody = toast.querySelector(".toast-body");
        const toastHeader = toast.querySelector(".toast-header");
        
        if (type === "error") {
            toastHeader.innerHTML = `
                <i class="fas fa-exclamation-circle text-danger me-2"></i>
                <strong class="me-auto">Error</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            `;
        } else {
            toastHeader.innerHTML = `
                <i class="fas fa-user-plus text-success me-2"></i>
                <strong class="me-auto">Employee Management</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            `;
        }
        
        // Handle line breaks in message
        toastBody.innerHTML = message.replace(/\n/g, '<br>');
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }

    function updateStatistics() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const employees = users.filter(user => user.role === 'employee');
        
        const completed = tasks.filter(task => task.completed).length;
        const pending = tasks.filter(task => !task.completed).length;

        totalEmployees.textContent = employees.length;
        totalTasks.textContent = tasks.length;
        completedTasks.textContent = completed;
        pendingTasks.textContent = pending;
    }

    function getTasksForUser(userId) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        return tasks.filter(task => task.userId === userId);
    }

    function getUserById(userId) {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        return users.find(user => user.id === userId);
    }

    function isOverdue(task) {
        if (!task.dueDate) return false;
        const today = new Date();
        const dueDate = new Date(task.dueDate);
        today.setHours(0, 0, 0, 0);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate < today;
    }

    function handleLogout() {
        sessionStorage.removeItem("loggedInUser");
        // TEMPORARILY COMMENTED OUT FOR DEVELOPMENT
        // window.location.href = "../auth/auth.html";
        alert("Logout functionality temporarily disabled for development");
    }

    function showToast(message, type = "success") {
        const toast = document.getElementById("taskToast");
        const toastBody = toast.querySelector(".toast-body");
        const toastHeader = toast.querySelector(".toast-header");
        
        if (type === "error") {
            toastHeader.innerHTML = `
                <i class="fas fa-exclamation-circle text-danger me-2"></i>
                <strong class="me-auto">Error</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            `;
        } else {
            toastHeader.innerHTML = `
                <i class="fas fa-check-circle text-success me-2"></i>
                <strong class="me-auto">Success</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            `;
        }
        
        toastBody.textContent = message;
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }

    function generateReportData(reportType, period) {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        
        return {
            type: reportType,
            period: period,
            generatedBy: loggedInUser.username,
            generatedAt: new Date().toISOString(),
            data: {
                totalEmployees: users.filter(u => u.role === 'employee').length,
                totalTasks: tasks.length,
                completedTasks: tasks.filter(t => t.completed).length,
                pendingTasks: tasks.filter(t => !t.completed).length,
                overdueTasks: tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length
            }
        };
    }

    function downloadReport(data, type, format) {
        let content, mimeType, extension;
        
        if (format === 'json') {
            content = JSON.stringify(data, null, 2);
            mimeType = 'application/json';
            extension = 'json';
        } else if (format === 'csv') {
            content = convertToCSV(data);
            mimeType = 'text/csv';
            extension = 'csv';
        } else {
            // For PDF and Excel, we'll create a simple text version
            content = `${type.toUpperCase()} REPORT\n\nGenerated: ${data.generatedAt}\nBy: ${data.generatedBy}\n\nSummary:\nTotal Employees: ${data.data.totalEmployees}\nTotal Tasks: ${data.data.totalTasks}\nCompleted: ${data.data.completedTasks}\nPending: ${data.data.pendingTasks}\nOverdue: ${data.data.overdueTasks}`;
            mimeType = 'text/plain';
            extension = 'txt';
        }
        
        const blob = new Blob([content], {type: mimeType});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${type}_report_${new Date().toISOString().split('T')[0]}.${extension}`;
        link.click();
    }

    function convertToCSV(data) {
        return `Report Type,${data.type}\nPeriod,${data.period}\nGenerated By,${data.generatedBy}\nGenerated At,${data.generatedAt}\n\nMetric,Value\nTotal Employees,${data.data.totalEmployees}\nTotal Tasks,${data.data.totalTasks}\nCompleted Tasks,${data.data.completedTasks}\nPending Tasks,${data.data.pendingTasks}\nOverdue Tasks,${data.data.overdueTasks}`;
    }

    // Load manager profile data
    function loadManagerProfile() {
        const managerProfile = JSON.parse(localStorage.getItem(`profile_${loggedInUser.id}`)) || {};
        
        // Update display name in header and dropdown
        let displayName = loggedInUser.username;
        if (managerProfile.firstName || managerProfile.lastName) {
            const fullName = `${managerProfile.firstName || ''} ${managerProfile.lastName || ''}`.trim();
            if (fullName) {
                displayName = fullName;
            }
        }
        
        // Update all profile name displays
        const managerNameElements = [
            document.getElementById("managerName"),
            document.getElementById("managerDisplayName"),
            document.getElementById("dropdownManagerName")
        ];
        
        managerNameElements.forEach(element => {
            if (element) {
                element.textContent = displayName;
            }
        });
        
        // Load profile form fields when modal is opened
        const profileModal = document.getElementById('profileModal');
        if (profileModal) {
            profileModal.addEventListener('shown.bs.modal', function () {
                const formFields = {
                    profileFirstName: managerProfile.firstName || "",
                    profileLastName: managerProfile.lastName || "",
                    profileEmail: managerProfile.email || loggedInUser.email || "",
                    profilePhone: managerProfile.phone || "",
                    profileDepartment: managerProfile.department || "",
                    profileJobTitle: managerProfile.jobTitle || "",
                    profileCompany: managerProfile.company || "",
                    profileLocation: managerProfile.location || "",
                    profileBio: managerProfile.bio || ""
                };
                
                Object.keys(formFields).forEach(fieldId => {
                    const element = document.getElementById(fieldId);
                    if (element) {
                        element.value = formFields[fieldId];
                    }
                });
                
                // Update profile avatar display if needed
                updateProfileAvatarDisplay(managerProfile);
            });
        }
    }
    
    // Update profile avatar display
    function updateProfileAvatarDisplay(profile) {
        const avatarDisplay = document.getElementById('profileAvatarDisplay');
        if (avatarDisplay && profile.firstName) {
            const initials = getInitials(profile.firstName, profile.lastName);
            if (initials) {
                avatarDisplay.innerHTML = `
                    <div class="profile-initials">${initials}</div>
                    <div class="profile-avatar-overlay">
                        <i class="fas fa-camera"></i>
                    </div>
                `;
            }
        }
    }
    
    // Get initials from name
    function getInitials(firstName, lastName) {
        const first = firstName ? firstName.charAt(0).toUpperCase() : '';
        const last = lastName ? lastName.charAt(0).toUpperCase() : '';
        return first + last;
    }

    // Load settings data
    function loadManagerSettings() {
        const settings = JSON.parse(localStorage.getItem(`settings_${loggedInUser.id}`)) || {
            notifications: {
                taskCompletion: true,
                overdue: true,
                newEmployee: false
            },
            security: {
                sessionTimeout: "60",
                requirePassword: false
            },
            appearance: {
                theme: "default",
                layout: "default"
            },
            dataManagement: {
                autoBackup: "daily"
            }
        };
        
        // Load settings when modal is opened
        const settingsModal = document.getElementById('settingsModal');
        if (settingsModal) {
            settingsModal.addEventListener('shown.bs.modal', function () {
                // Notification settings
                const taskCompletionCheck = document.getElementById("notifyTaskCompletion");
                const overdueCheck = document.getElementById("notifyOverdue");
                const newEmployeeCheck = document.getElementById("notifyNewEmployee");
                
                if (taskCompletionCheck) taskCompletionCheck.checked = settings.notifications.taskCompletion;
                if (overdueCheck) overdueCheck.checked = settings.notifications.overdue;
                if (newEmployeeCheck) newEmployeeCheck.checked = settings.notifications.newEmployee;
                
                // Security settings
                const sessionTimeoutSelect = document.getElementById("sessionTimeout");
                const requirePasswordCheck = document.getElementById("requirePassword");
                
                if (sessionTimeoutSelect) sessionTimeoutSelect.value = settings.security.sessionTimeout;
                if (requirePasswordCheck) requirePasswordCheck.checked = settings.security.requirePassword;
                
                // Appearance settings
                const themeSelect = document.getElementById("themeSelect");
                const layoutSelect = document.getElementById("dashboardLayout");
                
                if (themeSelect) themeSelect.value = settings.appearance.theme;
                if (layoutSelect) layoutSelect.value = settings.appearance.layout;
                
                // Data management settings
                const autoBackupSelect = document.getElementById("autoBackup");
                if (autoBackupSelect) autoBackupSelect.value = settings.dataManagement.autoBackup;
            });
        }
    }

    // Initialize profile and settings
    loadManagerProfile();
    loadManagerSettings();

    // Profile form submission - using event delegation for reliability
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'saveProfileBtn') {
            e.preventDefault();
            
            const profileData = {
                firstName: document.getElementById("profileFirstName")?.value || "",
                lastName: document.getElementById("profileLastName")?.value || "",
                email: document.getElementById("profileEmail")?.value || "",
                phone: document.getElementById("profilePhone")?.value || "",
                department: document.getElementById("profileDepartment")?.value || "",
                jobTitle: document.getElementById("profileJobTitle")?.value || "",
                company: document.getElementById("profileCompany")?.value || "",
                location: document.getElementById("profileLocation")?.value || "",
                bio: document.getElementById("profileBio")?.value || "",
                updatedAt: new Date().toISOString()
            };

            localStorage.setItem(`profile_${loggedInUser.id}`, JSON.stringify(profileData));
            
            // Update display names throughout the interface
            let displayName = loggedInUser.username;
            if (profileData.firstName || profileData.lastName) {
                const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();
                if (fullName) {
                    displayName = fullName;
                }
            }
            
            // Update all profile name displays
            const managerNameElements = [
                document.getElementById("managerName"),
                document.getElementById("managerDisplayName"), 
                document.getElementById("dropdownManagerName")
            ];
            
            managerNameElements.forEach(element => {
                if (element) {
                    element.textContent = displayName;
                }
            });
            
            // Update profile avatar display
            updateProfileAvatarDisplay(profileData);

            // Close modal with animation
            const profileModal = document.getElementById('profileModal');
            if (profileModal) {
                const modal = bootstrap.Modal.getInstance(profileModal) || new bootstrap.Modal(profileModal);
                modal.hide();
            }
            
            // Show success message with profile info
            const successMessage = profileData.firstName ? 
                `Profile updated successfully! Welcome, ${displayName}!` : 
                "Profile updated successfully!";
            showToast(successMessage, "success");
        }
        
        // Settings form submission
        if (e.target && e.target.id === 'saveSettingsBtn') {
            e.preventDefault();
            
            const settings = {
                notifications: {
                    taskCompletion: document.getElementById("notifyTaskCompletion")?.checked || false,
                    overdue: document.getElementById("notifyOverdue")?.checked || false,
                    newEmployee: document.getElementById("notifyNewEmployee")?.checked || false
                },
                security: {
                    sessionTimeout: document.getElementById("sessionTimeout")?.value || "60",
                    requirePassword: document.getElementById("requirePassword")?.checked || false
                },
                appearance: {
                    theme: document.getElementById("themeSelect")?.value || "default",
                    layout: document.getElementById("dashboardLayout")?.value || "default"
                },
                dataManagement: {
                    autoBackup: document.getElementById("autoBackup")?.value || "daily"
                },
                updatedAt: new Date().toISOString()
            };

            localStorage.setItem(`settings_${loggedInUser.id}`, JSON.stringify(settings));
            
            // Close modal
            const settingsModal = document.getElementById('settingsModal');
            if (settingsModal) {
                const modal = bootstrap.Modal.getInstance(settingsModal) || new bootstrap.Modal(settingsModal);
                modal.hide();
            }
            
            showToast("Settings saved successfully!", "success");
        }
        
        // Export data
        if (e.target && e.target.id === 'exportDataBtn') {
            e.preventDefault();
            
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            const profile = JSON.parse(localStorage.getItem(`profile_${loggedInUser.id}`)) || {};
            
            const exportData = {
                exportDate: new Date().toISOString(),
                manager: loggedInUser.username,
                users: users.filter(user => user.role === 'employee'),
                tasks: tasks,
                profile: profile
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `manager_data_${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            showToast("Data exported successfully!", "success");
        }
        
        // Generate report
        if (e.target && e.target.id === 'generateReportBtn') {
            e.preventDefault();
            
            const reportType = document.getElementById("reportType")?.value;
            const period = document.getElementById("reportPeriod")?.value;
            const format = document.getElementById("reportFormat")?.value;
            
            if (!reportType || !period || !format) {
                showToast("Please fill in all required fields", "error");
                return;
            }

            // Generate mock report data
            const reportData = generateReportData(reportType, period);
            downloadReport(reportData, reportType, format);
            
            const reportModal = document.getElementById('reportModal');
            if (reportModal) {
                const modal = bootstrap.Modal.getInstance(reportModal) || new bootstrap.Modal(reportModal);
                modal.hide();
            }
            
            showToast(`${reportType} report generated successfully!`, "success");
        }
    });

    // Fix modal and dropdown positioning issues
    function fixModalPositioning() {
        // Ensure all modals have proper z-index and positioning
        const modals = document.querySelectorAll('.modal');
        modals.forEach((modal, index) => {
            modal.style.zIndex = 1055 + (index * 5);
        });
        
        // Fix dropdown positioning
        const dropdowns = document.querySelectorAll('.dropdown-menu');
        dropdowns.forEach(dropdown => {
            dropdown.style.position = 'absolute';
            dropdown.style.zIndex = '1050';
        });
    }

    // Initialize Bootstrap components properly
    function initializeBootstrapComponents() {
        // Initialize all tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl, {
                placement: 'top',
                trigger: 'hover'
            });
        });

        // Initialize all dropdowns
        const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
        dropdownElementList.map(function (dropdownToggleEl) {
            return new bootstrap.Dropdown(dropdownToggleEl);
        });

        // Initialize all modals
        const modalElementList = [].slice.call(document.querySelectorAll('.modal'));
        modalElementList.map(function (modalEl) {
            return new bootstrap.Modal(modalEl, {
                backdrop: true,
                keyboard: true,
                focus: true
            });
        });
    }

    // Fix positioning on window resize
    function handleWindowResize() {
        fixModalPositioning();
        
        // Ensure dropdowns reposition correctly
        const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
        openDropdowns.forEach(dropdown => {
            const dropdownInstance = bootstrap.Dropdown.getInstance(dropdown.previousElementSibling);
            if (dropdownInstance) {
                dropdownInstance.update();
            }
        });
    }

    // Initialize Bootstrap components
    initializeBootstrapComponents();

    // Debug function to verify modal functionality
    window.debugManagerProfile = function() {
        console.log("=== Manager Profile Debug Info ===");
        console.log("Logged in user:", loggedInUser);
        console.log("Profile modal element:", document.getElementById('profileModal'));
        console.log("Save profile button:", document.getElementById('saveProfileBtn'));
        console.log("Manager name element:", document.getElementById('managerName'));
        
        const savedProfile = JSON.parse(localStorage.getItem(`profile_${loggedInUser.id}`)) || {};
        console.log("Saved profile data:", savedProfile);
        
        console.log("=== Form Elements ===");
        console.log("First name input:", document.getElementById("profileFirstName"));
        console.log("Last name input:", document.getElementById("profileLastName"));
        console.log("Email input:", document.getElementById("profileEmail"));
        
        return "Debug info logged to console";
    };

    // Add a simple test function
    window.testProfileSave = function() {
        const testData = {
            firstName: "Test",
            lastName: "Manager",
            email: "test@example.com",
            phone: "123-456-7890",
            department: "it",
            bio: "Test bio"
        };
        
        localStorage.setItem(`profile_${loggedInUser.id}`, JSON.stringify(testData));
        document.getElementById("managerName").textContent = "Test Manager";
        
        return "Test profile saved and name updated";
    };

    // Fix modal and dropdown positioning issues
    fixModalPositioning();
    
    // Handle window resize for positioning
    window.addEventListener('resize', handleWindowResize);
    
    // ...existing code...
});
