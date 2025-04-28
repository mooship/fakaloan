/**
 * Represents form values for user login
 * Used by the login form and authentication methods
 */
export interface LoginFormValues {
  email?: string | null;
  password?: string | null;
}

/**
 * Represents form values for user registration
 * Used by the registration form and authentication methods
 * Includes password confirmation for validation
 */
export interface RegisterFormValues {
  name?: string | null;
  email?: string | null;
  password?: string | null;
  passwordConfirmation?: string | null;
}

/**
 * Represents form values for password reset request
 * Used by the forgot password form and authentication methods
 */
export interface ForgotPasswordForm {
  email: string;
}
