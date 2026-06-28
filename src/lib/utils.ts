// Utils — small, framework-free helpers. Composition glue only.
// (Architecture §1: minimal dependencies. No lodash, no ramda.)

/**
 * Conditionally join class names. Falsy values are skipped.
 * Used in CSS Modules composition where `styles.foo` may be undefined.
 */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

/**
 * Build a wa.me link from an international number (no "+", no spaces).
 */
export function waLink(number: string, message?: string): string {
  const base = `https://wa.me/${number.replace(/[^\d]/g, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
