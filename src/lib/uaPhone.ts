export const UA_PHONE_PREFIX = "+380";
export const UA_PHONE_NATIONAL_LENGTH = 9;

/** Залишає лише 9 цифр національного номера (без 0 на початку, без 380). */
export function parseUaNationalPhoneDigits(raw: string): string {
  let digits = raw.replace(/\D/g, "");

  if (digits.startsWith("380")) {
    digits = digits.slice(3);
  }

  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  return digits.slice(0, UA_PHONE_NATIONAL_LENGTH);
}

/** Формат для поля вводу: 50 123 45 67 */
export function formatUaNationalPhone(digits: string): string {
  const d = digits.slice(0, UA_PHONE_NATIONAL_LENGTH);
  const parts = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean);
  return parts.join(" ");
}

export function isUaPhoneComplete(digits: string): boolean {
  return digits.length === UA_PHONE_NATIONAL_LENGTH;
}

export function toUaE164(digits: string): string {
  return `${UA_PHONE_PREFIX}${digits}`;
}
