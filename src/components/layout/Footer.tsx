// Footer — site-wide dark full-stop (DESIGN.md §9.09).
// Full-width Carbone band with wordmark, footer links, legal line, and socials.

import { SITE } from "@/lib/site";
import { navigation } from "@/data/navigation";
import styles from "./Footer.module.css";

const footerLinks = [...navigation.links, { label: "Privacy Policy", href: "/privacy" }];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <p className={styles.wordmark}>{SITE.name}</p>
          <p className={styles.tagline}>{SITE.tagline}</p>
        </div>

        <nav aria-label="Footer" className={styles.middleRow}>
          <ul className={styles.linkList}>
            {footerLinks.map((link) => (
              <li key={link.href + link.label}>
                <a href={link.href} className={styles.link}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.bottomRow}>
          <p className={styles.legal}>
            © {currentYear} {SITE.name}. All rights reserved.
          </p>
          <div className={styles.socials}>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              {SITE.instagramHandle}
            </a>
            <span aria-hidden="true" className={styles.divider}>
              ·
            </span>
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
