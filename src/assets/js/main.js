// Main Application JavaScript
// This file contains common functionality shared across all pages

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main initialization function
function initializeApp() {
    // Initialize tooltips
    initializeTooltips();
    
    // Initialize common event listeners
    initializeCommonEvents();
    
    // Initialize floating animations
    initializeFloatingAnimations();
    
    // Check for page-specific initialization
    const currentPage = getCurrentPage();
    if (currentPage) {
        console.log(`Initializing ${currentPage} page`);
        initializePageSpecific(currentPage);
    }
}

// Initialize Bootstrap tooltips
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Initialize common event listeners
function initializeCommonEvents() {
    // Handle logout functionality (if logout button exists)
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Handle navigation back to main portal
    const backToPortalBtns = document.querySelectorAll('.back-to-portal');
    backToPortalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            window.location.href = '../../../index.html';
        });
    });

    // Handle keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Initialize floating animations
function initializeFloatingAnimations() {
    // Animate floating shapes
    const shapes = document.querySelectorAll('.floating-shapes .shape');
    shapes.forEach((shape, index) => {
        // Add random animation delay
        shape.style.animationDelay = `${Math.random() * 5}s`;
        
        // Add random animation duration
        const duration = 15 + Math.random() * 10; // 15-25 seconds
        shape.style.animationDuration = `${duration}s`;
    });

    // Animate floating particles
    const particles = document.querySelectorAll('.floating-particles .particle');
    particles.forEach((particle, index) => {
        particle.style.animationDelay = `${Math.random() * 3}s`;
        const duration = 8 + Math.random() * 6; // 8-14 seconds
        particle.style.animationDuration = `${duration}s`;
    });

    // Animate gradient orbs
    const orbs = document.querySelectorAll('.gradient-orbs .orb');
    orbs.forEach((orb, index) => {
        orb.style.animationDelay = `${Math.random() * 4}s`;
        const duration = 20 + Math.random() * 10; // 20-30 seconds
        orb.style.animationDuration = `${duration}s`;
    });
}

// Get current page identifier
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('auth')) return 'auth';
    if (path.includes('employee')) return 'employee';
    if (path.includes('manager')) return 'manager';
    if (path.includes('admin')) return 'admin';
    return null;
}

// Initialize page-specific functionality
function initializePageSpecific(page) {
    switch(page) {
        case 'auth':
            if (typeof initializeAuthPage === 'function') {
                initializeAuthPage();
            }
            break;
        case 'employee':
            if (typeof initializeEmployeePage === 'function') {
                initializeEmployeePage();
            }
            break;
        case 'manager':
            if (typeof initializeManagerPage === 'function') {
                initializeManagerPage();
            }
            break;
        case 'admin':
            if (typeof initializeAdminPage === 'function') {
                initializeAdminPage();
            }
            break;
    }
}

// Handle logout functionality
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear any stored user data
        localStorage.removeItem('currentUser');
        sessionStorage.clear();
        
        // Show logout message
        showNotification('Logged out successfully', 'info');
        
        // Redirect to auth page after a short delay
        setTimeout(() => {
            window.location.href = '../auth/auth.html';
        }, 1000);
    }
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + H: Go to home/portal
    if ((event.ctrlKey || event.metaKey) && event.key === 'h') {
        event.preventDefault();
        window.location.href = '../../../index.html';
    }
    
    // Escape: Close modals
    if (event.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal.show');
        openModals.forEach(modal => {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }
        });
    }
    
    // Ctrl/Cmd + S: Save (prevent default and trigger save if available)
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        const saveBtn = document.querySelector('[id*="save"], [class*="save"]');
        if (saveBtn && saveBtn.click) {
            saveBtn.click();
        }
    }
}

// Show notification function
function showNotification(message, type = 'info', duration = 3000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        max-width: 400px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    `;
    
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${getIconForType(type)} me-2"></i>
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, duration);
}

// Get icon for notification type
function getIconForType(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle',
        'danger': 'times-circle'
    };
    return icons[type] || 'info-circle';
}

// Utility function to format dates
function formatDate(dateString, includeTime = false) {
    if (!dateString) return 'No date';
    
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    
    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }
    
    return date.toLocaleDateString('en-US', options);
}

// Utility function to check if date is overdue
function isOverdue(dateString) {
    if (!dateString) return false;
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    return dueDate < today;
}

// Utility function to generate random ID
function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Utility function for local storage with error handling
const storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    },
    
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Storage error:', error);
            return null;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    },
    
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    }
};

// Make utilities globally available
window.AppMain = {
    showNotification,
    formatDate,
    isOverdue,
    generateId,
    storage,
    getCurrentPage
};

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Add loading state management
window.setLoadingState = function(element, isLoading) {
    if (!element) return;
    
    if (isLoading) {
        element.disabled = true;
        const originalText = element.textContent;
        element.dataset.originalText = originalText;
        element.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
    } else {
        element.disabled = false;
        element.textContent = element.dataset.originalText || 'Submit';
    }
};

// Console welcome message
console.log('%c🚀 ToDo List Management System', 'font-size: 20px; font-weight: bold; color: #667eea;');
console.log('%cWelcome to the application! Use Ctrl+H to go to home.', 'color: #666;');
