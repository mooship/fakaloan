export interface LoginFormValues {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
}

export interface RegisterFormValues {
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
  /** Confirmation of user's password */
  passwordConfirmation: string;
}

export interface ForgotPasswordForm {
  /** Email address for password reset */
  email: string;
}
