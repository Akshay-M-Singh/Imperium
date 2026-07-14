import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Navigation } from "@/components/layout/Navigation";
import { navigation } from "@/data/navigation";
import { SITE } from "@/lib/site";

// Navigation no longer queries matchMedia — desktop and mobile markup are
// always present in the DOM and CSS gates visibility by viewport. jsdom does
// not apply CSS, so every element is queryable regardless of viewport.

describe("Navigation", () => {
  afterEach(() => {
    document.body.style.overflow = "";
  });

  it("renders the wordmark without an establishment year", () => {
    const { container } = render(<Navigation />);
    expect(screen.getByText("Imperium Italian Textile")).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/Est\.|20\d\d/);
  });

  it("keeps the wordmark home link scoped to the current locale", () => {
    const { unmount } = render(<Navigation />);
    expect(screen.getByRole("link", { name: "Imperium Italian Textile — home" })).toHaveAttribute(
      "href",
      "/",
    );
    unmount();

    render(<Navigation locale="ar" />);
    expect(
      screen.getByRole("link", { name: "إمبريوم للأقمشة الإيطالية — الصفحة الرئيسية" }),
    ).toHaveAttribute("href", "/ar");
  });

  it("renders the three nav links in both the desktop nav and mobile overlay", () => {
    expect(navigation.en.links.map((l) => l.label)).toEqual(["Fabrics", "About", "Contact"]);
    const { container } = render(<Navigation />);
    const navs = container.querySelectorAll('nav[aria-label="Primary"]');
    expect(navs).toHaveLength(2);
    const [desktopNav, mobileNav] = navs;
    expect(desktopNav!.querySelectorAll("a")).toHaveLength(navigation.en.links.length);
    expect(mobileNav!.querySelectorAll("a")).toHaveLength(navigation.en.links.length);
    for (const link of navigation.en.links) {
      const desktop = desktopNav!.querySelectorAll("a");
      expect(Array.from(desktop).some((a) => a.textContent === link.label)).toBe(true);
      const mobile = mobileNav!.querySelectorAll("a");
      expect(Array.from(mobile).some((a) => a.textContent === link.label)).toBe(true);
    }
  });

  it("renders the Request Samples CTA pointing at its href", () => {
    render(<Navigation />);
    const cta = screen.getByRole("link", { name: /Request Samples/i });
    expect(cta).toHaveAttribute("href", navigation.en.cta.href);
  });

  it("renders EN/AR toggle links (desktop + mobile) with English marked active via aria-current", () => {
    const { container } = render(<Navigation />);
    // Mobile overlay markup is aria-hidden/inert until opened, so query the
    // DOM directly rather than via role (same pattern as the nav-links test).
    const enLinks = Array.from(
      container.querySelectorAll<HTMLAnchorElement>('a[aria-label="Switch to English"]'),
    );
    const arLinks = Array.from(
      container.querySelectorAll<HTMLAnchorElement>('a[aria-label="التبديل إلى العربية"]'),
    );
    expect(enLinks).toHaveLength(2);
    expect(arLinks).toHaveLength(2);
    for (const link of enLinks) {
      expect(link).toHaveAttribute("aria-current", "true");
      expect(link).toHaveAttribute("data-active", "true");
      expect(link).toHaveAttribute("href", "/");
    }
    for (const link of arLinks) {
      expect(link).not.toHaveAttribute("aria-current");
      expect(link).not.toHaveAttribute("data-active");
      expect(link).toHaveAttribute("href", "/ar");
    }
  });

  it("renders Arabic labels when locale is ar, and marks the AR toggle active", () => {
    const { container } = render(<Navigation locale="ar" />);
    const links = screen.getAllByText(navigation.ar.links[0]!.label);
    expect(links.length).toBeGreaterThan(0);

    const enLinks = Array.from(
      container.querySelectorAll<HTMLAnchorElement>('a[aria-label="Switch to English"]'),
    );
    const arLinks = Array.from(
      container.querySelectorAll<HTMLAnchorElement>('a[aria-label="التبديل إلى العربية"]'),
    );
    expect(enLinks).toHaveLength(2);
    expect(arLinks).toHaveLength(2);
    // AR toggle should now be active; EN toggle should point back to "/" and
    // not be marked current.
    for (const link of arLinks) {
      expect(link).toHaveAttribute("aria-current", "true");
      expect(link).toHaveAttribute("href", "/ar");
    }
    for (const link of enLinks) {
      expect(link).toHaveAttribute("href", "/");
      expect(link).not.toHaveAttribute("aria-current");
    }
  });

  it("renders the hamburger button with aria-expanded false initially", () => {
    render(<Navigation />);
    const toggle = screen.getByRole("button", { name: /Open menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveAttribute("aria-controls", "mobile-menu");
  });

  it("hamburger toggles the overlay open and reveals the WhatsApp link", async () => {
    const user = userEvent.setup();
    render(<Navigation />);

    const toggle = screen.getByRole("button", { name: /Open menu/i });
    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAttribute("aria-label", "Close menu");

    const overlay = document.getElementById("mobile-menu");
    expect(overlay).toHaveAttribute("data-open", "true");
    expect(overlay).not.toHaveAttribute("inert");

    const whatsapp = within(overlay!).getByRole("link", { name: /WhatsApp/i });
    expect(whatsapp.getAttribute("href")).toContain("wa.me");
    expect(whatsapp.getAttribute("href")).toContain(SITE.whatsapp);
  });

  it("closes the overlay on Escape (aria-expanded back to false)", async () => {
    const user = userEvent.setup();
    render(<Navigation />);
    const toggle = screen.getByRole("button", { name: /Open menu/i });
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(document, { key: "Escape" });

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById("mobile-menu")).toHaveAttribute("data-open", "false");
  });
});
