// Validation Utilities
export const validation = {
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    validateUserForm(data) {
        const errors = [];
        
        if (!data.name?.trim()) {
            errors.push('Name is required');
        }
        
        if (!data.email?.trim()) {
            errors.push('Email is required');
        } else if (!this.isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!data.role?.trim()) {
            errors.push('Role is required');
        }
        
        return errors;
    }
}; 