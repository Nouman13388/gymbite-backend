import { api } from './api.js';
import { ui } from './ui.js';
import { debugLogger } from './debug.js';
import { validation } from './validation.js';

class UserApp {
    constructor() {
        this.initializeEventListeners();
        this.loadUsers();
    }

    initializeEventListeners() {
        // Form submission
        document.getElementById('userForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Reset button
        document.getElementById('resetButton').addEventListener('click', () => {
            this.resetForm();
        });

        // Refresh button
        document.getElementById('refreshButton').addEventListener('click', () => {
            this.loadUsers();
        });

        // Cancel edit button
        document.getElementById('cancelEdit').addEventListener('click', () => {
            this.resetForm();
        });

        // Clear debug log
        document.getElementById('clearDebugLog').addEventListener('click', () => {
            debugLogger.clear();
        });

        // Add input validation feedback
        const inputs = document.querySelectorAll('#userForm input, #userForm select');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateInput(input);
            });
            input.addEventListener('blur', () => {
                this.validateInput(input);
            });
        });
    }

    validateInput(input) {
        const userData = {
            [input.id]: input.value
        };
        const { errors } = validation.validateUser(userData);
        
        // Remove existing error message
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Remove error class
        input.classList.remove('input--error');

        // Add error if exists
        if (errors[input.id]) {
            input.classList.add('input--error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errors[input.id];
            input.parentElement.appendChild(errorDiv);
        }
    }

    async loadUsers() {
        try {
            ui.setLoading(true);
            const users = await api.getUsers();
            ui.displayUsers(users);
            debugLogger.log('Users loaded successfully', 'success', { count: users.length });
        } catch (error) {
            debugLogger.log('Error loading users', 'error', error);
            ui.showToast('Error loading users', 'error');
        } finally {
            ui.setLoading(false);
        }
    }

    async handleFormSubmit() {
        const userId = document.getElementById('userId').value;
        const userData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            role: document.getElementById('role').value
        };

        // Validate user data
        const { isValid, errors } = validation.validateUser(userData);
        if (!isValid) {
            const errorMessage = validation.formatValidationErrors(errors);
            debugLogger.log('Validation failed', 'error', errors);
            ui.showToast(errorMessage, 'error');
            return;
        }

        try {
            ui.setLoading(true);
            if (userId) {
                await api.updateUser(userId, userData);
                debugLogger.log('User updated successfully', 'success', { userId, userData });
                ui.showToast('User updated successfully', 'success');
            } else {
                await api.createUser(userData);
                debugLogger.log('User created successfully', 'success', { userData });
                ui.showToast('User created successfully', 'success');
            }
            this.resetForm();
            this.loadUsers();
        } catch (error) {
            debugLogger.log('Error saving user', 'error', error);
            ui.showToast('Error saving user', 'error');
        } finally {
            ui.setLoading(false);
        }
    }

    resetForm() {
        ui.resetForm();
        // Clear any error messages
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.input--error').forEach(el => el.classList.remove('input--error'));
    }

    startEdit(user) {
        ui.showEditMode(user);
    }

    async deleteUser(userId) {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            ui.setLoading(true);
            await api.deleteUser(userId);
            debugLogger.log('User deleted successfully', 'success', { userId });
            ui.showToast('User deleted successfully', 'success');
            this.loadUsers();
        } catch (error) {
            debugLogger.log('Error deleting user', 'error', error);
            ui.showToast('Error deleting user', 'error');
        } finally {
            ui.setLoading(false);
        }
    }
}

// Initialize the application
const app = new UserApp();

// Make app methods available globally for the user card buttons
window.userUI = {
    startEdit: (user) => app.startEdit(user),
    deleteUser: (userId) => app.deleteUser(userId)
}; 