document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");
    const loginToggle = document.getElementById("loginToggle");
    const signupToggle = document.getElementById("signupToggle");

    // Form switching functionality with animations
    if (loginToggle) {
        loginToggle.addEventListener("click", (e) => {
            e.preventDefault();
            switchToLogin();
        });
    }

    if (signupToggle) {
        signupToggle.addEventListener("click", (e) => {
            e.preventDefault();
            switchToSignup();
        });
    }

    function switchToLogin() {
        // Update toggle buttons
        loginToggle.classList.add("active");
        signupToggle.classList.remove("active");
        
        // Animate form transition
        signupForm.classList.add("fade-out");
        setTimeout(() => {
            signupForm.style.display = "none";
            loginForm.style.display = "block";
            loginForm.classList.remove("fade-out");
            loginForm.classList.add("fade-in");
            clearSignupError();
        }, 200);
    }

    function switchToSignup() {
        // Update toggle buttons
        signupToggle.classList.add("active");
        loginToggle.classList.remove("active");
        
        // Animate form transition
        loginForm.classList.add("fade-out");
        setTimeout(() => {
            loginForm.style.display = "none";
            signupForm.style.display = "block";
            signupForm.classList.remove("fade-out");
            signupForm.classList.add("fade-in");
            clearLoginError();
        }, 200);
    }

    function clearLoginError() {
        const errorElement = document.getElementById("loginErrorMessage");
        if (errorElement) {
            errorElement.textContent = "";
            errorElement.classList.add("d-none");
        }
    }

    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("signupUsername").value;
            const password = document.getElementById("signupPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const role = document.getElementById("userRole").value;

            if (password !== confirmPassword) {
                showSignupError("Passwords do not match.");
                return;
            }

            if (!role) {
                showSignupError("Please select a role.");
                return;
            }

            // In a real application, you would send this to a server.
            // For this demo, we'll use localStorage.
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const existingUser = users.find((user) => user.username === username);

            if (existingUser) {
                showSignupError("Username already exists.");
            } else {
                const newUser = { id: Date.now().toString(), username, password, role };
                users.push(newUser);
                localStorage.setItem("users", JSON.stringify(users));
                showSignupSuccess(`${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully! You can now login.`);
                
                // Clear form and switch to login
                signupForm.reset();
                setTimeout(() => {
                    switchToLogin();
                    clearSignupError();
                }, 2000);
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("loginUsername").value;
            const password = document.getElementById("loginPassword").value;

            const users = JSON.parse(localStorage.getItem("users")) || [];
            const user = users.find(
                (user) => user.username === username && user.password === password
            );

            if (user) {
                sessionStorage.setItem("loggedInUser", JSON.stringify(user));
                
                // Role-based redirection
                switch(user.role) {
                    case 'admin':
                        window.location.href = "admin.html";
                        break;
                    case 'manager':
                        window.location.href = "manager.html";
                        break;
                    case 'employee':
                        window.location.href = "index.html";
                        break;
                    default:
                        window.location.href = "index.html";
                }
            } else {
                showLoginError("Invalid username or password.");
            }
        });
    }

    function showLoginError(message) {
        const errorElement = document.getElementById("loginErrorMessage");
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove("d-none");
        }
    }

    function showSignupError(message) {
        const errorElement = document.getElementById("signupErrorMessage");
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove("d-none");
        }
    }

    function showSignupSuccess(message) {
        const errorElement = document.getElementById("signupErrorMessage");
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove("d-none", "text-danger");
            errorElement.classList.add("text-success");
        }
    }

    function clearSignupError() {
        const errorElement = document.getElementById("signupErrorMessage");
        if (errorElement) {
            errorElement.textContent = "";
            errorElement.classList.add("d-none");
            errorElement.classList.remove("text-success");
            errorElement.classList.add("text-danger");
        }
    }

    // Create default users if they don't exist
    const users = JSON.parse(localStorage.getItem("users")) || [];
    
    // Default Admin user
    const adminUser = users.find(user => user.username === 'admin');
    if (!adminUser) {
        users.push({ id: 'admin', username: 'admin', password: 'password', role: 'admin' });
    }
    
    // Default Manager user
    const managerUser = users.find(user => user.username === 'manager');
    if (!managerUser) {
        users.push({ id: 'manager', username: 'manager', password: 'password', role: 'manager' });
    }
    
    // Default Employee user
    const employeeUser = users.find(user => user.username === 'employee');
    if (!employeeUser) {
        users.push({ id: 'employee', username: 'employee', password: 'password', role: 'employee' });
    }
    
    localStorage.setItem('users', JSON.stringify(users));
});
