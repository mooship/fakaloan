export interface LoginFormValues {
  email?: string | null;
  password?: string | null;
}

export interface RegisterFormValues {
  name?: string | null;
  email?: string | null;
  password?: string | null;
  passwordConfirmation?: string | null;
}

export interface ForgotPasswordForm {
  email: string;
}
