/**
 * Login form values for authentication.
 */
export interface LoginFormValues {
  email: string;
  password: string;
}

/**
 * Registration form values for new user sign-up.
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
 */
export interface ForgotPasswordForm {
  email: string;
}
