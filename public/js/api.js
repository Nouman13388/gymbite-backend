// API Configuration
const API_BASE = '/api/users';

// Debug Logger
const debugLogger = {
    log(message, data = null) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${message}`);
        if (data) {
            console.log('Data:', data);
        }
        this.addToDebugLog('info', message, data);
    },
    error(message, error = null) {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] ERROR: ${message}`);
        if (error) {
            console.error('Error details:', error);
            if (error.stack) {
                console.error('Stack trace:', error.stack);
            }
        }
        this.addToDebugLog('error', message, error);
    },
    success(message, data = null) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] SUCCESS: ${message}`);
        if (data) {
            console.log('Data:', data);
        }
        this.addToDebugLog('success', message, data);
    },
    addToDebugLog(type, message, data = null) {
        const debugLog = document.getElementById('debugLog');
        if (!debugLog) return;

        const entry = document.createElement('div');
        entry.className = `debug-entry ${type}`;

        const timestamp = document.createElement('span');
        timestamp.className = 'debug-timestamp';
        timestamp.textContent = new Date().toLocaleTimeString();
        entry.appendChild(timestamp);

        const messageSpan = document.createElement('span');
        messageSpan.className = 'debug-message';
        messageSpan.textContent = message;
        entry.appendChild(messageSpan);

        if (data) {
            const dataDiv = document.createElement('div');
            dataDiv.className = 'debug-data';
            if (typeof data === 'object') {
                dataDiv.textContent = JSON.stringify(data, null, 2);
            } else {
                dataDiv.textContent = String(data);
            }
            entry.appendChild(dataDiv);
        }

        debugLog.appendChild(entry);
        debugLog.scrollTop = debugLog.scrollHeight;
    },
    clear() {
        const debugLog = document.getElementById('debugLog');
        if (debugLog) {
            debugLog.innerHTML = '';
        }
    }
};

// Make debugLogger available globally
window.debugLogger = debugLogger;

// API Service
class ApiService {
    constructor() {
        this.baseUrl = '/api/users';
    }

    async getUsers() {
        const response = await fetch(this.baseUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.statusText}`);
        }
        return response.json();
    }

    async createUser(userData) {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error(`Failed to create user: ${response.statusText}`);
        }

        return response.json();
    }

    async updateUser(userId, userData) {
        const response = await fetch(`${this.baseUrl}/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error(`Failed to update user: ${response.statusText}`);
        }

        return response.json();
    }

    async deleteUser(userId) {
        const response = await fetch(`${this.baseUrl}/${userId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Failed to delete user: ${response.statusText}`);
        }

        // For DELETE requests that return 204 No Content
        if (response.status === 204) {
            return null;
        }

        return response.json();
    }
}

// Create and export a single instance
export const api = new ApiService(); 