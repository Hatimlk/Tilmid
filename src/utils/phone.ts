// Moroccan phone helpers. Numbers can be typed or stored in many shapes
// ("+2127 7810 4220", "0778104220", "+212 6 12 34 56 78"), so every value is
// reduced to its digits before building a tel: link or checking the format.

const MA_NATIONAL = /^[5-7]\d{8}$/;

// Digits of the national part (9 digits, starting with 5, 6 or 7 for mobile/landline).
const toNationalDigits = (raw: string): string | null => {
  const digits = raw.replace(/\D/g, '');
  const national = digits.startsWith('212') ? digits.slice(3) : digits.startsWith('0') ? digits.slice(1) : digits;
  return MA_NATIONAL.test(national) ? national : null;
};

/** True when the value is a plausible Moroccan number (+212, 00212 or 0 prefix optional). */
export const isValidMaPhone = (raw: string): boolean => toNationalDigits(raw) !== null;

/** tel: URL with E.164-style international format, e.g. tel:+212778104220 */
export const toTelHref = (raw: string): string => {
  const national = toNationalDigits(raw);
  return national ? `tel:+212${national}` : `tel:${raw.replace(/[^\d+]/g, '')}`;
};

/** Human-friendly display, e.g. "+212 778 104 220". Falls back to the raw value when unparseable. */
export const formatMaPhone = (raw: string): string => {
  const national = toNationalDigits(raw);
  if (!national) return raw;
  return `+212 ${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6)}`;
};
