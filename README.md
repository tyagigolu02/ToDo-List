# Multi-User ToDo List Application

A modern, responsive ToDo List application with user authentication and role-based access control.

## Features

### 🔐 Authentication System
- User registration and login
- Role-based access (Owner/User)
- Secure session management
- Password validation

### 👑 Owner Dashboard
- View all users and their tasks
- Create and manage user accounts
- Assign tasks to users
- Monitor task completion across all users
- View comprehensive statistics
- Filter and sort tasks by status, priority, and user

### 👤 User Dashboard
- Personal task management
- Add, edit, and delete tasks
- Set task priorities (High, Medium, Low)
- Set due dates with overdue notifications
- Filter tasks by status (All, Active, Completed, Overdue)
- Progress tracking with visual indicators
- Real-time notifications

### 🎨 Modern UI/UX
- Glass-morphism design
- Animated backgrounds with floating shapes
- Responsive design for all devices
- Dark theme with glassmorphism effects
- Smooth animations and transitions
- Interactive elements with hover effects

## Getting Started

### 1. Initial Setup
1. Open `login.html` in your browser
2. The system will automatically create a default owner account:
   - **Email**: owner@todolist.com
   - **Password**: owner123

### 2. Owner Account Setup
1. Login with the default owner credentials
2. Go to the Owner Dashboard
3. Create user accounts for your team members
4. Assign tasks to users as needed

### 3. User Registration
Users can register themselves by:
1. Clicking "Create Account" on the login page
2. Selecting "Regular User" as account type
3. Filling in their details

### 4. Owner Registration
To register as an owner:
1. Click "Create Account" on the login page
2. Select "Owner/Manager" as account type
3. Enter the owner code: **OWNER2024**

## File Structure

```
ToDo List/
├── login.html              # Login and registration page
├── index.html              # User dashboard
├── owner-dashboard.html    # Owner/Manager dashboard
├── styles.css              # All styles and animations
├── auth.js                 # Authentication system
├── user-script.js          # User dashboard functionality
├── owner-dashboard.js      # Owner dashboard functionality
└── README.md               # This file
```

## User Roles

### Owner/Manager
- Can view all users and their tasks
- Can create new user accounts
- Can assign tasks to any user
- Can delete users and their tasks
- Has access to comprehensive analytics
- Can monitor team productivity

### Regular User
- Can manage their own tasks
- Can create, edit, and delete personal tasks
- Can set priorities and due dates
- Can view their own statistics
- Cannot access other users' tasks
- Cannot create new user accounts

## Key Features Explained

### Task Management
- **Priorities**: High (red), Medium (yellow), Low (green)
- **Due Dates**: Optional with overdue notifications
- **Status**: Pending or Completed
- **Progress Tracking**: Visual progress ring showing completion percentage

### Data Storage
- All data is stored in browser localStorage
- Separate storage for users and tasks
- Automatic data synchronization
- Persistent sessions with "Remember Me" option

### Notifications
- Real-time notifications for actions
- Due date reminders
- Task completion celebrations
- Error handling with user feedback

### Security Features
- Password validation (minimum 6 characters)
- Email validation
- Session management
- Role-based access control
- Owner code protection

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Usage Tips

1. **For Owners**: Use the dashboard to monitor team progress and assign tasks efficiently
2. **For Users**: Set realistic due dates and use priority levels to organize your work
3. **Notifications**: Enable browser notifications for due date reminders
4. **Mobile**: The app is fully responsive and works great on mobile devices

## Customization

You can customize the application by:
- Changing the owner code in `auth.js`
- Modifying colors and themes in `styles.css`
- Adding new task fields in the authentication system
- Extending the dashboard with additional statistics

## Support

For issues or questions, check the browser console for error messages. The application includes comprehensive error handling and user feedback.

---

**Note**: This is a client-side application using localStorage. For production use, consider implementing a backend API with proper database storage and security measures.
