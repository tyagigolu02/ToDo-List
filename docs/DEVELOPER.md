# ToDo List Management System - Developer Documentation

## Architecture Overview

The ToDo List Management System is built as a client-side web application using vanilla JavaScript, HTML5, and CSS3. The application follows a modular architecture with clear separation of concerns.

### File Structure Explanation

```
├── index.html                 # Main entry point with portal selection
├── package.json              # Node.js project configuration
├── .gitignore                # Git ignore rules
├── README.md                 # Project documentation
├── config/
│   └── project.json          # Application configuration
├── docs/
│   └── DEVELOPER.md          # This file
├── src/
│   ├── assets/
│   │   ├── css/
│   │   │   └── styles.css    # Global styles with glassmorphism design
│   │   ├── js/               # JavaScript modules
│   │   │   ├── employee.js   # Employee dashboard functionality
│   │   │   ├── manager.js    # Manager dashboard functionality
│   │   │   ├── admin.js      # Admin panel functionality
│   │   │   ├── auth.js       # Authentication logic
│   │   │   └── celebration.js # Task completion animations
│   │   └── images/           # Static image assets
│   ├── components/           # Reusable JavaScript components
│   │   ├── utils.js          # Utility functions
│   │   └── components.js     # UI components (Task, Employee)
│   └── pages/               # HTML pages organized by user role
│       ├── auth/
│       ├── employee/
│       ├── manager/
│       └── admin/
```

## Data Storage

The application uses browser Local Storage for data persistence. Key storage objects:

### Users Collection
```javascript
{
  "users": [
    {
      "id": "unique_id",
      "username": "string",
      "password": "string", // In production, this would be hashed
      "email": "string",
      "role": "employee|manager|admin",
      "createdAt": "ISO_date_string"
    }
  ]
}
```

### Tasks Collection
```javascript
{
  "tasks": [
    {
      "id": "unique_id",
      "description": "string",
      "priority": "low|medium|high",
      "dueDate": "YYYY-MM-DD",
      "completed": boolean,
      "assignedTo": "username",
      "assignedBy": "manager_username",
      "createdAt": "ISO_date_string",
      "completedAt": "ISO_date_string|null"
    }
  ]
}
```

## Component System

### TaskComponent
Renders individual task items with different display options.

**Usage:**
```javascript
const task = { id: '1', description: 'Sample task', priority: 'high' };
const taskComponent = new TaskComponent(task, {
  showEmployee: true,
  showActions: true,
  compact: false
});
const html = taskComponent.render();
```

### EmployeeComponent
Renders employee list items with task statistics.

**Usage:**
```javascript
const employee = { id: '1', username: 'john_doe', email: 'john@example.com' };
const employeeComponent = new EmployeeComponent(employee, {
  showActions: true,
  showStats: true
});
const html = employeeComponent.render();
```

### AppUtils
Utility class with common functions:

- `formatDate(dateString)` - Format dates for display
- `isOverdue(dueDate)` - Check if task is overdue
- `getPriorityClass(priority)` - Get CSS class for priority
- `generateId()` - Generate unique IDs
- `showToast(message, type)` - Show notifications
- `storage.*` - Local storage helpers
- `exportToJSON(data, filename)` - Export data as JSON
- `exportToCSV(data, filename)` - Export data as CSV

## User Roles and Permissions

### Employee
- **Can access:** Employee dashboard (`src/pages/employee/index.html`)
- **Permissions:** View assigned tasks, mark tasks complete
- **Storage access:** Read tasks assigned to them

### Manager
- **Can access:** Manager dashboard (`src/pages/manager/manager.html`)
- **Permissions:** Create employees, assign tasks, view all tasks, generate reports
- **Storage access:** Read/write users and tasks

### Admin
- **Can access:** Admin panel (`src/pages/admin/admin.html`)
- **Permissions:** System administration, user management
- **Storage access:** Full access to all data

## Development Guidelines

### Adding New Features

1. **Create feature branch:** `git checkout -b feature/new-feature`
2. **Follow naming conventions:** Use camelCase for JavaScript, kebab-case for CSS
3. **Update documentation:** Add JSDoc comments for functions
4. **Test across browsers:** Ensure compatibility
5. **Update configuration:** Add to `config/project.json` if needed

### CSS Architecture

The project uses a modern glassmorphism design with:
- CSS Custom Properties (CSS Variables) for theming
- Responsive design with Bootstrap 5 grid system
- Smooth animations and transitions
- Glassmorphism effects with backdrop-filter

### JavaScript Patterns

- **Module Pattern:** Each JavaScript file is self-contained
- **Event Delegation:** Use event bubbling for dynamic content
- **Local Storage:** Consistent data access patterns
- **Error Handling:** Try-catch blocks for critical operations

## API Reference (Local Storage)

### User Management
```javascript
// Get all users
const users = AppUtils.storage.get('users') || [];

// Add new user
users.push(newUser);
AppUtils.storage.set('users', users);

// Find user by username
const user = users.find(u => u.username === username);
```

### Task Management
```javascript
// Get all tasks
const tasks = AppUtils.storage.get('tasks') || [];

// Add new task
tasks.push(newTask);
AppUtils.storage.set('tasks', tasks);

// Filter tasks by user
const userTasks = tasks.filter(t => t.assignedTo === username);
```

## Performance Considerations

1. **Local Storage Limits:** ~5-10MB per origin
2. **DOM Manipulation:** Use DocumentFragment for bulk operations
3. **Event Listeners:** Remove unused listeners to prevent memory leaks
4. **Image Optimization:** Compress images in `src/assets/images/`

## Security Notes

⚠️ **Important:** This is a demo application with simplified security:

- Passwords are stored in plain text (use hashing in production)
- No server-side validation
- No CSRF protection
- No input sanitization

For production use, implement:
- Server-side authentication
- Password hashing (bcrypt)
- Input validation and sanitization
- HTTPS encryption
- Session management

## Browser Support

- **Chrome:** 70+ ✅
- **Firefox:** 65+ ✅
- **Safari:** 12+ ✅
- **Edge:** 79+ ✅
- **IE:** Not supported ❌

## Troubleshooting

### Common Issues

1. **Tasks not saving:** Check browser console for Local Storage errors
2. **Styles not loading:** Verify CSS file paths are correct
3. **JavaScript errors:** Enable browser developer tools console
4. **Responsive issues:** Test with browser device emulation

### Debug Mode

Enable debug logging by adding to console:
```javascript
localStorage.setItem('debug', 'true');
```

## Deployment

### Static Hosting
The application can be deployed to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront

### Local Development Server
```bash
# Option 1: Using Python
python -m http.server 3000

# Option 2: Using Node.js
npx http-server . -p 3000

# Option 3: Using live-server (auto-reload)
npx live-server --port=3000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Future Enhancements

- [ ] Real-time collaboration with WebSockets
- [ ] Offline support with Service Workers
- [ ] Advanced reporting with charts
- [ ] Email notifications
- [ ] File attachments to tasks
- [ ] Team chat integration
- [ ] Mobile app (PWA)
- [ ] Dark mode theme
- [ ] Keyboard shortcuts
- [ ] Drag-and-drop task organization

---

For questions or support, please refer to the main README.md or create an issue in the repository.
