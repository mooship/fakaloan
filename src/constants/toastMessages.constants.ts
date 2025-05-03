/**
 * Toast messages for user notifications.
 *
 * @enum {string}
 */
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
  // General
  UnknownError = 'An unexpected error occurred. Please try again.',
  ActionSuccess = 'Action completed successfully.',
  ActionFailed = 'Action failed. Please try again.',
  ValidationError = 'Please check the form for errors.',
  AuthRequired = 'You must be logged in to perform this action.',
  // Customer
  CustomerAddSuccess = 'Customer added successfully!',
  CustomerAddFailed = 'Failed to add customer.',
  CustomerUpdateSuccess = 'Customer updated successfully!',
  CustomerUpdateFailed = 'Failed to update customer.',
  CustomerDeleteSuccess = 'Customer deleted successfully!',
  CustomerDeleteFailed = 'Failed to delete customer.',
  // Transaction
  TransactionAddSuccess = 'Transaction added successfully!',
  TransactionAddFailed = 'Failed to add transaction.',
  TransactionUpdateSuccess = 'Transaction updated successfully!',
  TransactionUpdateFailed = 'Failed to update transaction.',
  TransactionDeleteSuccess = 'Transaction deleted successfully!',
  TransactionDeleteFailed = 'Failed to delete transaction.',
  // Profile
  ProfileUpdateSuccess = 'Profile updated successfully!',
  ProfileUpdateFailed = 'Failed to update profile.',
  // Theme
  ThemeUpdateSuccess = 'Theme updated successfully.',
  ThemeUpdateFailed = 'Failed to update theme.',
  // Subscription
  SubscriptionCancelSuccess = 'Subscription cancelled successfully.',
  SubscriptionCancelFailed = 'Failed to cancel subscription.',
}
