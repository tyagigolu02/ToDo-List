// Task component for rendering task items
class TaskComponent {
    constructor(task, options = {}) {
        this.task = task;
        this.options = {
            showEmployee: false,
            showActions: true,
            compact: false,
            ...options
        };
    }

    render() {
        const { task, options } = this;
        const isOverdue = AppUtils.isOverdue(task.dueDate);
        const priorityClass = AppUtils.getPriorityClass(task.priority);
        
        return `
            <div class="task-item ${task.completed ? 'completed' : ''} ${isOverdue && !task.completed ? 'overdue' : ''}" 
                 data-task-id="${task.id}">
                <div class="task-content">
                    <div class="task-header">
                        <div class="d-flex align-items-center">
                            ${options.showActions ? `
                                <div class="form-check me-3">
                                    <input class="form-check-input task-checkbox" type="checkbox" 
                                           ${task.completed ? 'checked' : ''} 
                                           data-task-id="${task.id}">
                                </div>
                            ` : ''}
                            <div class="task-priority-badge">
                                <span class="badge ${priorityClass} priority-badge">
                                    ${task.priority.toUpperCase()}
                                </span>
                            </div>
                            ${options.showEmployee ? `
                                <div class="task-employee ms-2">
                                    <small class="text-muted">
                                        <i class="fas fa-user me-1"></i>
                                        ${task.assignedTo || 'Unassigned'}
                                    </small>
                                </div>
                            ` : ''}
                        </div>
                        ${task.dueDate ? `
                            <div class="task-due-date">
                                <small class="text-muted ${isOverdue && !task.completed ? 'text-danger' : ''}">
                                    <i class="fas fa-calendar-alt me-1"></i>
                                    ${AppUtils.formatDate(task.dueDate)}
                                    ${isOverdue && !task.completed ? ' (Overdue)' : ''}
                                </small>
                            </div>
                        ` : ''}
                    </div>
                    <div class="task-description">
                        <p class="mb-1">${task.description}</p>
                    </div>
                    ${task.createdAt ? `
                        <div class="task-meta">
                            <small class="text-muted">
                                Created: ${AppUtils.formatDate(task.createdAt)}
                                ${task.completedAt ? ` • Completed: ${AppUtils.formatDate(task.completedAt)}` : ''}
                            </small>
                        </div>
                    ` : ''}
                </div>
                ${options.showActions ? `
                    <div class="task-actions">
                        <button class="btn btn-sm btn-outline-danger delete-task-btn" 
                                data-task-id="${task.id}" 
                                data-bs-toggle="tooltip" 
                                title="Delete Task">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    static renderList(tasks, container, options = {}) {
        if (!container) return;
        
        if (!tasks.length) {
            container.innerHTML = `
                <div class="empty-state text-center py-4">
                    <i class="fas fa-tasks fa-3x text-muted mb-3"></i>
                    <p class="text-muted">No tasks found</p>
                </div>
            `;
            return;
        }

        const tasksHtml = tasks.map(task => {
            const taskComponent = new TaskComponent(task, options);
            return taskComponent.render();
        }).join('');

        container.innerHTML = tasksHtml;
    }
}

// Employee list component
class EmployeeComponent {
    constructor(employee, options = {}) {
        this.employee = employee;
        this.options = {
            showActions: true,
            showStats: true,
            ...options
        };
    }

    render() {
        const { employee, options } = this;
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const employeeTasks = tasks.filter(task => task.assignedTo === employee.username);
        const completedTasks = employeeTasks.filter(task => task.completed);
        
        return `
            <div class="employee-item" data-employee-id="${employee.id}">
                <div class="d-flex align-items-center justify-content-between">
                    <div class="employee-info d-flex align-items-center">
                        <div class="employee-avatar me-3">
                            <i class="fas fa-user-circle fa-2x text-primary"></i>
                        </div>
                        <div>
                            <h6 class="mb-1">${employee.username}</h6>
                            ${employee.email ? `<small class="text-muted">${employee.email}</small>` : ''}
                            ${options.showStats ? `
                                <div class="employee-stats mt-1">
                                    <span class="badge bg-secondary me-1">${employeeTasks.length} tasks</span>
                                    <span class="badge bg-success">${completedTasks.length} completed</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    ${options.showActions ? `
                        <div class="employee-actions">
                            <button class="btn btn-sm btn-outline-primary view-employee-btn" 
                                    data-employee-id="${employee.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    static renderList(employees, container, options = {}) {
        if (!container) return;
        
        if (!employees.length) {
            container.innerHTML = `
                <div class="empty-state text-center py-4">
                    <i class="fas fa-users fa-3x text-muted mb-3"></i>
                    <p class="text-muted">No employees found</p>
                </div>
            `;
            return;
        }

        const employeesHtml = employees.map(employee => {
            const employeeComponent = new EmployeeComponent(employee, options);
            return employeeComponent.render();
        }).join('');

        container.innerHTML = employeesHtml;
    }
}

// Make components globally available
window.TaskComponent = TaskComponent;
window.EmployeeComponent = EmployeeComponent;
