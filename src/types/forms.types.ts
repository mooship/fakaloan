/**
 * Generic type for form values provided by VeeValidate's submit handler.
 * Used as a base type for all form submissions before casting to specific interfaces.
 *
 * This allows for consistent typing across all forms while maintaining
 * specific type interfaces for individual form handling.
 *
 * @example
 * ```ts
 * const handleSubmit = (values: GenericFormValues) => {
 *   loginWithEmail(values as LoginFormValues);
 * };
 * ```
 */
export type GenericFormValues = Record<string, unknown>;
