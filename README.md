# ToDo List Management System

A comprehensive task management solution designed for teams and individuals, featuring role-based access control and collaborative workflows.

## 🚀 Features

- **Multi-User System**: Support for Employee, Manager, and Admin roles
- **Task Management**: Create, assign, track, and complete tasks
- **Team Collaboration**: Managers can assign tasks to team members
- **Real-time Updates**: Dynamic task status updates
- **Data Export**: Export task data in various formats
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with animations

## 📁 Project Structure

```
ToDo List/
├── index.html                 # Main entry point
├── README.md                  # Project documentation
├── config/                    # Configuration files
│   └── project.json          # Project configuration
├── docs/                      # Documentation
├── src/                       # Source code
│   ├── assets/               # Static assets
│   │   ├── css/             # Stylesheets
│   │   │   └── styles.css   # Main stylesheet
│   │   ├── js/              # JavaScript files
│   │   │   ├── employee.js  # Employee dashboard logic
│   │   │   ├── manager.js   # Manager dashboard logic
│   │   │   ├── admin.js     # Admin panel logic
│   │   │   ├── auth.js      # Authentication logic
│   │   │   └── celebration.js # Task completion animations
│   │   └── images/          # Image assets
│   ├── components/          # Reusable components
│   └── pages/              # HTML pages
│       ├── auth/           # Authentication
│       │   └── auth.html   # Login/Register page
│       ├── employee/       # Employee portal
│       │   └── index.html  # Employee dashboard
│       ├── manager/        # Manager portal
│       │   └── manager.html # Manager dashboard
│       └── admin/          # Admin portal
│           └── admin.html  # Admin panel
```

## 🎯 User Roles

### Employee
- View personal task list
- Mark tasks as complete
- Filter tasks by status
- Celebrate task completion with animations

### Manager
- Add new employees
- Assign tasks to team members
- Monitor employee progress
- View task statistics
- Generate reports
- Export data

### Admin
- System administration
- User management
- Global settings
- Data backup and restore

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Framework**: Bootstrap 5.3.0
- **Icons**: Font Awesome 6.0.0
- **Fonts**: Google Fonts (Poppins)
- **Animations**: Canvas Confetti
- **Storage**: Local Storage (Browser)

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation
1. Clone or download the project
2. Open `index.html` in your web browser
3. Navigate to the appropriate portal based on your role

### Quick Start
1. **Access the system**: Open `index.html`
2. **Choose your role**: Select Employee, Manager, or Admin portal
3. **Authentication**: Use the Login/Sign Up page if needed
4. **Start managing tasks**: Begin creating and organizing your tasks

## 📖 Usage Guide

### For Employees
1. Open the Employee Portal
2. View your assigned tasks
3. Use filters to organize your view
4. Mark tasks as complete when finished
5. Enjoy the completion celebration!

### For Managers
1. Access the Manager Portal
2. Add new employees to your team
3. Create and assign tasks
4. Monitor team progress
5. Generate reports and export data

### For Administrators
1. Enter the Admin Portal
2. Manage system users
3. Configure global settings
4. Perform data operations

## 🎨 Design Features

- **Glassmorphism UI**: Modern glass-like design elements
- **Gradient Backgrounds**: Beautiful color gradients
- **Floating Animations**: Subtle background animations
- **Responsive Layout**: Adapts to all screen sizes
- **Accessibility**: ARIA labels and keyboard navigation

## 🔧 Configuration

The project configuration can be found in `config/project.json`. This file contains:
- Project metadata
- File structure information
- External dependencies
- Feature flags

## 📱 Browser Compatibility

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code comments
- Create an issue for bugs or feature requests

## 🔄 Version History

- **v1.0.0**: Initial release with core functionality
  - Multi-user role system
  - Task management features
  - Responsive design
  - Modern UI/UX

---

**Happy Task Managing! 🎉**

## ✨ Features

- **Modern Glassmorphism UI** - Beautiful glass-like interface with blur effects
- **Responsive Design** - Works perfectly on all devices
- **Priority System** - High, Medium, and Low priority tasks
- **Due Date Tracking** - Optional due dates with overdue detection
- **Smart Filtering** - Filter by All, Active, Completed, or Overdue tasks
- **Local Storage** - All tasks persist between sessions
- **Real-time Statistics** - Live task counters and progress tracking
- **Smooth Animations** - Floating shapes, particles, and gradient orbs
- **Progress Ring** - Visual completion indicator
- **Toast Notifications** - Feedback for all user actions
- **Task Management** - Add, edit, delete, and mark tasks as complete
- **Bulk Operations** - Clear all completed tasks at once

## � Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables, animations, and glassmorphism effects
- **JavaScript (ES6+)** - Modern JavaScript with classes and modules
- **Bootstrap 5** - Responsive grid system and components
- **Font Awesome** - Beautiful icons
- **Google Fonts** - Poppins font family
- **Local Storage API** - Data persistence

## 🎨 Design Features

- **Gradient Backgrounds** - Beautiful color transitions
- **Floating Animation Elements** - Dynamic shapes, particles, and orbs
- **Glassmorphism Effect** - Frosted glass appearance with backdrop blur
- **Smooth Transitions** - Hover effects and micro-interactions
- **Color-coded Priorities** - Visual priority indicators
- **Progress Visualization** - Animated progress ring
- **Mobile-first Design** - Optimized for all screen sizes

## 🛠️ Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone git@github.com:tyagigolu02/ToDo-List.git
   cd ToDo-List
   ```

2. **Open the application:**

   - Open `index.html` in your web browser
   - Or use a local server (recommended):

     ```bash
     # Using Python
     python -m http.server 8000

     # Using Node.js
     npx serve
     ```

3. **Access the application:**
   - Open `http://localhost:8000` in your browser

## 📱 Usage

### Adding Tasks

1. Enter task description in the input field
2. Select priority level (Low, Medium, High)
3. Optionally set a due date
4. Click "Add" button or press Enter

### Managing Tasks

- **Complete Tasks**: Click the checkbox to mark as complete
- **Edit Tasks**: Click the edit icon (pencil) to modify task text
- **Delete Tasks**: Click the delete icon (trash) to remove tasks
- **Filter Tasks**: Use filter buttons to view specific task types

### Bulk Operations

- **Clear Completed**: Remove all completed tasks with one click
- **Progress Tracking**: View real-time statistics and progress ring

## 🎯 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📊 Project Structure

```
todo-list/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript functionality
├── README.md           # Project documentation
└── .gitignore          # Git ignore file
```

## 🔧 Customization

### Colors

Modify CSS variables in `:root` to change the color scheme:

```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
}
```

### Animations

Adjust animation durations and effects in the CSS file:

```css
.shape {
  animation: float 20s infinite ease-in-out;
}
```

## 🚀 Future Enhancements

- [ ] Task categories and tags
- [ ] Multiple todo lists
- [ ] Task search functionality
- [ ] Export/Import tasks
- [ ] Dark/Light theme toggle
- [ ] Task reminders and notifications
- [ ] Drag and drop task reordering
- [ ] Task sharing functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Tyagi Golu**

- GitHub: [@tyagigolu02](https://github.com/tyagigolu02)
- Project: [ToDo-List](https://github.com/tyagigolu02/ToDo-List)

## 🙏 Acknowledgments

- Bootstrap team for the excellent CSS framework
- Font Awesome for beautiful icons
- Google Fonts for the Poppins font family
- Inspiration from modern web design trends

---

⭐ **If you found this project helpful, please give it a star!** ⭐

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
