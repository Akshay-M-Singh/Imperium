"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { navigation } from "@/data/navigation";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import styles from "./Navigation.module.css";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [onDark, setOnDark] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 100);
      setOnDark(window.scrollY < window.innerHeight);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(styles.header, scrolled && styles.scrolled)}
        data-on-dark={onDark ? "true" : undefined}
      >
        <div className={styles.row}>
          <Link href="/" className={styles.wordmark} aria-label="Imperium Italian Textile — home">
            <span className={styles.wordmarkName}>{SITE.name}</span>
          </Link>

          <nav aria-label="Primary" className={styles.desktopNav}>
            {navigation.links.map((link) => (
              <a key={`${link.href}-${link.label}`} href={link.href} className={styles.desktopLink}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className={styles.desktopActions}>
            <a href={navigation.cta.href} className={styles.cta}>
              {navigation.cta.label} <span aria-hidden="true">→</span>
            </a>
            <span
              className={styles.lang}
              aria-label="Language: English selected, Arabic unavailable"
            >
              <span className={styles.langActive} data-active="true">
                {navigation.languageToggle.en}
              </span>
              <span className={styles.langSep} aria-hidden="true">
                ·
              </span>
              <span className={styles.langInactive}>{navigation.languageToggle.ar}</span>
            </span>
          </div>
        </div>
      </header>

      <button
        type="button"
        className={styles.hamburger}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        data-open={open ? "true" : "false"}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.lineTop} />
        <span className={styles.lineBottom} />
      </button>
      <div
        id="mobile-menu"
        className={styles.overlay}
        data-open={open ? "true" : "false"}
        aria-hidden={!open}
        inert={!open}
      >
        <nav aria-label="Primary" className={styles.mobileNav}>
          {navigation.links.map((link) => (
            <a
              key={`${link.href}-${link.label}`}
              href={link.href}
              className={styles.mobileLink}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          className={styles.whatsappCta}
          href={`https://wa.me/${SITE.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Chat on WhatsApp <span aria-hidden="true">→</span>
        </a>
      </div>
    </>
  );
}

export default Navigation;
