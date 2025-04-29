/**
 * Generic type for form values provided by VeeValidate's submit handler.
 * Serves as a base type for all form submissions before casting to specific interfaces.
 *
 * @example
 * import type { GenericFormValues } from '@/types/forms.types';
 * import type { LoginFormValues } from '@/interfaces/auth.interfaces';
 *
 * const handleSubmit = (values: GenericFormValues) => {
 *   // Cast to the specific form type for processing
 *   loginWithEmail(values as LoginFormValues);
 * };
 */
export type GenericFormValues = Record<string, unknown>;
