import { computed, type Ref } from 'vue';

/**
 * Computes password strength and provides a label and color for UI feedback.
 * @param password - A ref to the password string.
 * @returns An object with score, label, and color for the password strength.
 */
export function usePasswordStrength(password: Ref<string>) {
  const score = computed(() => {
    let s = 0;
    if (!password.value) {
      return 0;
    }
    if (password.value.length >= 8) {
      s++;
    }
    if (/[A-Z]/.test(password.value)) {
      s++;
    }
    if (/[0-9]/.test(password.value)) {
      s++;
    }
    if (/[^A-Za-z0-9]/.test(password.value)) {
      s++;
    }

    return s;
  });

  const label = computed(() => {
    switch (score.value) {
      case 0:
        return '';
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return '';
    }
  });

  const color = computed(() => {
    switch (score.value) {
      case 1:
        return 'text-error';
      case 2:
        return 'text-warning';
      case 3:
        return 'text-primary';
      case 4:
        return 'text-success';
      default:
        return 'text-on-surface/60';
    }
  });

  return { score, label, color };
}
