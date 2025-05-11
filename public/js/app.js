import { userApi } from './api.js';
import { validation } from './validation.js';
import { ui } from './ui.js';

// State Management
let isEditMode = false;
let originalUserData = null;

// DOM Elements
const elements = {
    form: document.getElementById('userForm'),
    userList: document.getElementById('userList'),
    submitButton: document.getElementById('submitButton'),
    cancelEditButton: document.getElementById('cancelEdit')
};

// Event Handlers
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        role: document.getElementById('role').value
    };

    const errors = validation.validateUserForm(userData);
    if (errors.length > 0) {
        ui.showToast(errors.join('\n'), 'error');
        return;
    }

    try {
        ui.setLoading(true);
        const userId = document.getElementById('userId').value;
        
        if (userId) {
            await userApi.updateUser(userId, userData);
            ui.showToast('User updated successfully!');
        } else {
            await userApi.createUser(userData);
            ui.showToast('User created successfully!');
        }
        
        resetForm();
        await loadUsers();
    } catch (error) {
        ui.showToast(error.message, 'error');
    } finally {
        ui.setLoading(false);
    }
}

// UI Functions
function resetForm() {
    elements.form.reset();
    document.getElementById('userId').value = '';
    elements.submitButton.textContent = 'Create User';
    elements.cancelEditButton.style.display = 'none';
    elements.form.classList.remove('edit-mode');
    isEditMode = false;
    originalUserData = null;
}

function cancelEdit() {
    if (originalUserData) {
        document.getElementById('name').value = originalUserData.name || '';
        document.getElementById('email').value = originalUserData.email;
        document.getElementById('role').value = originalUserData.role;
    }
    resetForm();
}

async function loadUsers() {
    try {
        ui.setLoading(true);
        const users = await userApi.getUsers();
        ui.displayUsers(users);
    } catch (error) {
        ui.showToast(error.message, 'error');
    } finally {
        ui.setLoading(false);
    }
}

function toggleUserDetails(userId) {
    const detailsElement = document.getElementById(`details-${userId}`);
    if (detailsElement) {
        detailsElement.style.display = detailsElement.style.display === 'none' ? 'block' : 'none';
    }
}

function startEdit(user) {
    originalUserData = { ...user };
    
    document.getElementById('userId').value = user.id;
    document.getElementById('name').value = user.name || '';
    document.getElementById('email').value = user.email;
    document.getElementById('role').value = user.role;
    
    elements.submitButton.textContent = 'Update User';
    elements.cancelEditButton.style.display = 'inline-block';
    elements.form.classList.add('edit-mode');
    isEditMode = true;
    
    elements.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('name').focus();
}

async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }
    
    try {
        ui.setLoading(true);
        await userApi.deleteUser(id);
        ui.showToast('User deleted successfully!');
        await loadUsers();
    } catch (error) {
        ui.showToast(error.message, 'error');
    } finally {
        ui.setLoading(false);
    }
}

// Initialize
function init() {
    elements.form.addEventListener('submit', handleFormSubmit);
    elements.cancelEditButton.addEventListener('click', cancelEdit);
    document.addEventListener('DOMContentLoaded', loadUsers);
}

// Export functions that need to be globally accessible
window.userUI = {
    toggleUserDetails,
    startEdit,
    deleteUser
};

// Start the application
init(); 