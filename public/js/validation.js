// Validation rules
const validationRules = {
    name: {
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s\-']+$/,
        message: 'Name should be 2-50 characters long and contain only letters, spaces, hyphens, and apostrophes'
    },
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
    },
    role: {
        allowed: ['CLIENT', 'TRAINER'],
        message: 'Role must be either CLIENT or TRAINER'
    }
};

// Validation service
class ValidationService {
    validateUser(userData) {
        const errors = {};

        // Validate name
        if (!userData.name) {
            errors.name = 'Name is required';
        } else if (userData.name.length < validationRules.name.minLength) {
            errors.name = `Name must be at least ${validationRules.name.minLength} characters long`;
        } else if (userData.name.length > validationRules.name.maxLength) {
            errors.name = `Name must not exceed ${validationRules.name.maxLength} characters`;
        } else if (!validationRules.name.pattern.test(userData.name)) {
            errors.name = validationRules.name.message;
        }

        // Validate email
        if (!userData.email) {
            errors.email = 'Email is required';
        } else if (!validationRules.email.pattern.test(userData.email)) {
            errors.email = validationRules.email.message;
        }

        // Validate role
        if (!userData.role) {
            errors.role = 'Role is required';
        } else if (!validationRules.role.allowed.includes(userData.role)) {
            errors.role = validationRules.role.message;
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    formatValidationErrors(errors) {
        return Object.entries(errors)
            .map(([field, message]) => `${field}: ${message}`)
            .join('\n');
    }
}

export const validation = new ValidationService(); 