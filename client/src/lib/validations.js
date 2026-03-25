// Password validation regex patterns
export const PASSWORD_PATTERNS = {
  hasUpperCase: /[A-Z]/,
  hasNumber: /[0-9]/,
  hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
  minLength: 6,
};

/**
 * Validates if a password meets all requirements
 * @param {string} password - The password to validate
 * @returns {object} - Object with validation results
 */
export const validatePassword = (password) => {
  return {
    hasMinLength: password.length >= PASSWORD_PATTERNS.minLength,
    hasUpperCase: PASSWORD_PATTERNS.hasUpperCase.test(password),
    hasNumber: PASSWORD_PATTERNS.hasNumber.test(password),
    hasSpecialChar: PASSWORD_PATTERNS.hasSpecialChar.test(password),
    isValid: 
      password.length >= PASSWORD_PATTERNS.minLength &&
      PASSWORD_PATTERNS.hasUpperCase.test(password) &&
      PASSWORD_PATTERNS.hasNumber.test(password) &&
      PASSWORD_PATTERNS.hasSpecialChar.test(password),
  };
};

/**
 * Gets error messages for password validation
 * @param {object} validation - Result from validatePassword
 * @returns {string[]} - Array of error messages
 */
export const getPasswordErrors = (validation) => {
  const errors = [];
  
  if (!validation.hasMinLength) {
    errors.push('Mínimo 6 caracteres');
  }
  if (!validation.hasUpperCase) {
    errors.push('Al menos 1 mayúscula');
  }
  if (!validation.hasNumber) {
    errors.push('Al menos 1 número');
  }
  if (!validation.hasSpecialChar) {
    errors.push('Al menos 1 carácter especial (!@#$%^&*)');
  }
  
  return errors;
};

/**
 * Validates email format
 * @param {string} email - The email to validate
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
