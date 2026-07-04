const COMMON_WEAK_PASSWORDS = new Set([
  "password",
  "12345678",
  "qwerty123",
  "admin123",
  "password123",
]);

const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?\/\\]/;

export const getPasswordChecks = (password = "") => [
  { key: "length", label: "8 to 64 characters", valid: password.length >= 8 && password.length <= 64 },
  { key: "uppercase", label: "At least one uppercase letter", valid: /[A-Z]/.test(password) },
  { key: "lowercase", label: "At least one lowercase letter", valid: /[a-z]/.test(password) },
  { key: "number", label: "At least one number", valid: /[0-9]/.test(password) },
  { key: "special", label: "At least one special character", valid: SPECIAL_CHAR_REGEX.test(password) },
  { key: "spaces", label: "No spaces", valid: !/\s/.test(password) },
  { key: "common", label: "Not a common weak password", valid: !COMMON_WEAK_PASSWORDS.has(password.toLowerCase()) },
];

export const validatePassword = (password = "") => {
  const errors = [];

  if (password.length < 8) errors.push("Password must be at least 8 characters long.");
  if (password.length > 64) errors.push("Password must not exceed 64 characters.");
  if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter.");
  if (!/[a-z]/.test(password)) errors.push("Password must contain at least one lowercase letter.");
  if (!/[0-9]/.test(password)) errors.push("Password must contain at least one number.");
  if (!SPECIAL_CHAR_REGEX.test(password)) errors.push("Password must contain at least one special character.");
  if (/\s/.test(password)) errors.push("Password must not contain spaces.");
  if (COMMON_WEAK_PASSWORDS.has(password.toLowerCase())) errors.push("Password is too common. Choose a stronger password.");

  return { valid: errors.length === 0, errors };
};