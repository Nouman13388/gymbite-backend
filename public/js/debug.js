class DebugLogger {
    constructor() {
        this.logContent = document.getElementById('debugLog');
        this.clear();
    }

    log(message, type = 'info', data = null) {
        const entry = document.createElement('div');
        entry.className = `debug-entry ${type}`;
        
        const timestamp = document.createElement('span');
        timestamp.className = 'debug-timestamp';
        timestamp.textContent = new Date().toLocaleTimeString();
        
        const messageSpan = document.createElement('span');
        messageSpan.className = 'debug-message';
        messageSpan.textContent = message;
        
        entry.appendChild(timestamp);
        entry.appendChild(messageSpan);
        
        if (data) {
            const dataSpan = document.createElement('pre');
            dataSpan.className = 'debug-data';
            dataSpan.textContent = JSON.stringify(data, null, 2);
            entry.appendChild(dataSpan);
        }
        
        this.logContent.appendChild(entry);
        this.logContent.scrollTop = this.logContent.scrollHeight;
    }

    clear() {
        this.logContent.innerHTML = '';
    }
}

export const debugLogger = new DebugLogger(); 