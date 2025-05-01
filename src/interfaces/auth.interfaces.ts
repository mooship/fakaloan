/**
 * Login form values for authentication.
 * @typedef {Object} LoginFormValues
 * @property {string} email - User's email address
 * @property {string} password - User's password
 */
export interface LoginFormValues {
  email: string;
  password: string;
}

/**
 * Registration form values for new user sign-up.
 * @typedef {Object} RegisterFormValues
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {string} email - User's email address
 * @property {string} password - User's password
 * @property {string} passwordConfirmation - Confirmation of password
 */
export interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

/**
 * Forgot password form values.
 * @typedef {Object} ForgotPasswordForm
 * @property {string} email - User's email address
 */
export interface ForgotPasswordForm {
  email: string;
}
