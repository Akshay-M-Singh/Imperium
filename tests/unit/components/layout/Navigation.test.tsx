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

  it("renders the three nav links in both the desktop nav and mobile overlay", () => {
    expect(navigation.links.map((l) => l.label)).toEqual(["Fabrics", "About", "Contact"]);
    const { container } = render(<Navigation />);
    const navs = container.querySelectorAll('nav[aria-label="Primary"]');
    expect(navs).toHaveLength(2);
    const [desktopNav, mobileNav] = navs;
    expect(desktopNav!.querySelectorAll("a")).toHaveLength(navigation.links.length);
    expect(mobileNav!.querySelectorAll("a")).toHaveLength(navigation.links.length);
    for (const link of navigation.links) {
      const desktop = desktopNav!.querySelectorAll("a");
      expect(Array.from(desktop).some((a) => a.textContent === link.label)).toBe(true);
      const mobile = mobileNav!.querySelectorAll("a");
      expect(Array.from(mobile).some((a) => a.textContent === link.label)).toBe(true);
    }
  });

  it("renders the Request Samples CTA pointing at its href", () => {
    render(<Navigation />);
    const cta = screen.getByRole("link", { name: /Request Samples/i });
    expect(cta).toHaveAttribute("href", navigation.cta.href);
  });

  it("renders the EN · AR toggle with English marked active", () => {
    render(<Navigation />);
    const toggle = screen.getByLabelText("Language: English selected, Arabic unavailable");
    const en = screen.getByText(navigation.languageToggle.en);
    const ar = screen.getByText(navigation.languageToggle.ar);
    const sep = screen.getByText("·");
    expect(toggle).toContainElement(en);
    expect(toggle).toContainElement(ar);
    expect(toggle).toContainElement(sep);
    expect(en).toHaveAttribute("data-active", "true");
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
