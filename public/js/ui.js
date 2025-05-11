// UI Utilities
export const ui = {
    formatDate(date) {
        return new Date(date || Date.now()).toLocaleString();
    },

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.textContent = message;
        
        const container = document.getElementById('toastContainer');
        container.appendChild(toast);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('toast--fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    setLoading(isLoading) {
        const userList = document.getElementById('userList');
        const submitButton = document.getElementById('submitButton');
        
        if (userList) userList.classList.toggle('loading', isLoading);
        if (submitButton) {
            submitButton.disabled = isLoading;
            submitButton.textContent = isLoading ? 'Loading...' : 'Create User';
        }
    },

    displayUsers(users) {
        const userList = document.getElementById('userList');
        userList.innerHTML = '';

        if (users.length === 0) {
            userList.innerHTML = '<p class="text-center">No users found</p>';
            return;
        }
        
        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';
            
            // Create a safe stringified version of the user object
            const safeUserData = JSON.stringify(user).replace(/"/g, '&quot;');
            
            userCard.innerHTML = `
                <div class="user-card__header">
                    <div class="user-card__title">
                        <h3 class="user-card__name">${user.name}</h3>
                        <span class="user-card__id">ID: ${user.id}</span>
                    </div>
                    <span class="user-card__role user-card__role--${user.role.toLowerCase()}">${user.role}</span>
                </div>
                <div class="user-card__details hidden" id="details-${user.id}">
                    <p><strong>ID:</strong> ${user.id}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Role:</strong> ${user.role}</p>
                    <p><strong>Created:</strong> ${this.formatDate(user.createdAt)}</p>
                    <p><strong>Last Updated:</strong> ${this.formatDate(user.updatedAt)}</p>
                    <div class="action-buttons">
                        <button class="button button--edit" data-user='${safeUserData}'>Edit</button>
                        <button class="button button--delete" data-user-id="${user.id}">Delete</button>
                    </div>
                </div>
            `;

            // Add click handler for the card
            userCard.addEventListener('click', (e) => {
                // Don't toggle if clicking on action buttons
                if (e.target.closest('.action-buttons')) return;
                
                const details = document.getElementById(`details-${user.id}`);
                if (details) {
                    details.classList.toggle('hidden');
                }
            });

            // Add click handlers for the buttons
            const editButton = userCard.querySelector('.button--edit');
            const deleteButton = userCard.querySelector('.button--delete');

            editButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click
                const userData = JSON.parse(editButton.dataset.user);
                this.showEditMode(userData);
            });

            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click
                const userId = deleteButton.dataset.userId;
                if (window.userUI && window.userUI.deleteUser) {
                    window.userUI.deleteUser(userId);
                }
            });

            userList.appendChild(userCard);
        });
    },

    resetForm() {
        const form = document.getElementById('userForm');
        if (form) {
            form.reset();
            document.getElementById('userId').value = '';
            document.getElementById('submitButton').textContent = 'Create User';
            document.getElementById('cancelEdit').classList.remove('visible');
            form.classList.remove('form--edit-mode');
        }
    },

    showEditMode(user) {
        const form = document.getElementById('userForm');
        if (form) {
            form.classList.add('form--edit-mode');
            document.getElementById('userId').value = user.id;
            document.getElementById('name').value = user.name;
            document.getElementById('email').value = user.email;
            document.getElementById('role').value = user.role;
            document.getElementById('submitButton').textContent = 'Update User';
            document.getElementById('cancelEdit').classList.add('visible');
        }
    }
};

// Add styles for better visual feedback
const style = document.createElement('style');
style.textContent = `
    .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    }

    .toast.info {
        background-color: #2196f3;
    }

    .toast.success {
        background-color: #4caf50;
    }

    .toast.error {
        background-color: #f44336;
    }

    .toast.fade-out {
        animation: fadeOut 0.3s ease-out forwards;
    }

    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes fadeOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }

    .user-card {
        background-color: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 15px;
        margin: 10px 0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        transition: all 0.3s ease;
    }

    .user-card:hover {
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        transform: translateY(-2px);
    }

    .user-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 10px;
    }

    .user-title {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .user-title h3 {
        margin: 0;
        color: #333;
    }

    .user-id {
        font-size: 0.8em;
        color: #666;
        font-family: monospace;
    }

    .user-role {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8em;
        font-weight: 500;
    }

    .user-role.client {
        background-color: #e3f2fd;
        color: #1976d2;
    }

    .user-role.trainer {
        background-color: #e8f5e9;
        color: #2e7d32;
    }

    .user-details {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid #e0e0e0;
    }

    .user-details p {
        margin: 5px 0;
        color: #666;
    }

    .user-details strong {
        color: #333;
    }

    .action-buttons {
        margin-top: 15px;
        display: flex;
        gap: 10px;
    }

    .button {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.2s;
    }

    .button.edit {
        background-color: #2196f3;
        color: white;
    }

    .button.edit:hover {
        background-color: #1976d2;
    }

    .button.delete {
        background-color: #f44336;
        color: white;
    }

    .button.delete:hover {
        background-color: #d32f2f;
    }

    .no-users {
        text-align: center;
        color: #666;
        padding: 20px;
        background-color: #f5f5f5;
        border-radius: 4px;
        margin: 20px 0;
    }

    .edit-mode {
        background-color: #e3f2fd;
        padding: 20px;
        border-radius: 8px;
        border: 2px solid #2196f3;
        margin: 20px 0;
    }
`;
document.head.appendChild(style); 