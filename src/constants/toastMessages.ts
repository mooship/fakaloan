// Centralized toast messages for authentication flows
export enum ToastMessages {
  LoginSuccess = 'Login successful!',
  LoginFailed = 'Login failed. Please try again.',
  RegistrationSuccess = 'Registration successful! Please log in.',
  RegistrationFailed = 'Registration failed. Please try again.',
  PasswordResetSent = 'Password reset email sent. Please check your inbox (and spam folder).',
  PasswordResetFailed = 'Password reset failed. Please try again.',
  LogoutSuccess = 'You have been logged out.',
  LogoutFailed = 'Logout failed. Please try again.',
  NetworkError = 'No internet connection. Please connect to the internet and try again.',
  PasswordUpdateSuccess = 'Password updated successfully.',
  PasswordUpdateFailed = 'Failed to update password. Please try again.',
}
