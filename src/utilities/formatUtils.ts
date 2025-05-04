import {
  DISPLAY_PHONE_NUMBER_REGEX,
  GROUP_3_4_REGEX,
  WHITESPACE_REGEX,
} from '@/constants/regex.constants';

export function formatPhoneNumber(phone: string | null): string {
  if (!phone) {
    return '';
  }

  const digits = phone.replace(WHITESPACE_REGEX, '');
  const match = digits.match(DISPLAY_PHONE_NUMBER_REGEX);

  if (match) {
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`.trim();
  }

  return digits.replace(GROUP_3_4_REGEX, '$1 ').trim();
}
