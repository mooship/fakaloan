/**
 * Login form values.
 */
export interface LoginFormValues {
  email: string;
  password: string;
}

/**
 * Registration form values.
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
