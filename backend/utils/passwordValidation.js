const COMMON_WEAK_PASSWORDS = new Set([
  "password",
  "12345678",
  "qwerty123",
  "admin123",
  "password123",
]);

const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?\/\\]/;

const validatePassword = (password) => {
  const errors = [];

  if (typeof password !== "string" || !password) {
    errors.push("Password is required.");
    return { valid: false, errors };
  }

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }

  if (password.length > 64) {
    errors.push("Password must not exceed 64 characters.");
  }

  if (/\s/.test(password)) {
    errors.push("Password must not contain spaces.");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter.");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter.");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number.");
  }

  if (!SPECIAL_CHAR_REGEX.test(password)) {
    errors.push("Password must contain at least one special character.");
  }

  if (COMMON_WEAK_PASSWORDS.has(password.toLowerCase())) {
    errors.push("Password is too common. Choose a stronger password.");
  }

  return { valid: errors.length === 0, errors };
};

module.exports = { validatePassword };