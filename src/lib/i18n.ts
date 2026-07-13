// i18n — locale primitives (Architecture §8). Two locales, hand-rolled:
// no i18n library earns its place for a two-language brochure site.

export const LOCALES = ["en", "ar"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function dirFor(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

/** Map the current pathname to its equivalent in the target locale.
 *  EN lives unprefixed ("/", "/privacy"); AR lives under "/ar". */
export function switchLocalePath(pathname: string, target: Locale): string {
  const bare = pathname.replace(/^\/ar(?=\/|$)/, "") || "/";
  if (target === "en") return bare;
  return bare === "/" ? "/ar" : `/ar${bare}`;
}
