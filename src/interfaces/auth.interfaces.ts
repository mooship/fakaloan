// form value interfaces for authentication flows
export interface LoginFormValues {
  email?: string | null;
  password?: string | null;
}

export interface RegisterFormValues {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  password?: string | null;
  passwordConfirmation?: string | null;
}

export interface ForgotPasswordForm {
  email: string;
}
