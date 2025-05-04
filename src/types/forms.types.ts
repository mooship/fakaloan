/**
 * Types for generic form values and editable fields in customer/user forms.
 */

/**
 * Generic form values for dynamic forms.
 */
export type GenericFormValues = Record<string, unknown>;

/**
 * Editable field names for customer/user forms.
 */
export type EditableField = 'name' | 'cellphoneNumber' | 'address';
