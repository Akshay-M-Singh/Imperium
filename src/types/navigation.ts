// Navigation types.

export interface NavLink {
  label: string;
  href: string;
}

export interface NavigationCta {
  label: string;
  href: string;
}

export interface LanguageToggle {
  en: string;
  ar: string;
}

export interface NavigationData {
  links: NavLink[];
  cta: NavigationCta;
  languageToggle: LanguageToggle;
}
