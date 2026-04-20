// shared/toast.js
// This file provides a global toast notification system.
// It uses classes from style.css to be CSP-compliant (no inline styles).

function showToast(message, type = 'info') {
    // Remove existing toast if one is already showing
    const existing = document.getElementById('ks-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'ks-toast';
    toast.textContent = message;
    
    // Use CSS classes instead of inline style.cssText
    toast.className = `ks-toast ${type}`;

    document.body.appendChild(toast);

    // Auto-dismiss after 3.5 seconds
    setTimeout(() => {
        const currentToast = document.getElementById('ks-toast');
        if (currentToast && currentToast.parentNode) {
            currentToast.remove();
        }
    }, 3500);
}

// Make showToast globally accessible
window.showToast = showToast;
