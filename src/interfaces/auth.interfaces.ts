/**
 * Login form values for authentication.
 */
export interface LoginFormValues {
  email?: string | null;
  password?: string | null;
}

/**
 * Registration form values for new user sign-up.
 */
export interface RegisterFormValues {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  password?: string | null;
  passwordConfirmation?: string | null;
}

/**
 * Forgot password form values.
 */
export interface ForgotPasswordForm {
  email: string;
}
