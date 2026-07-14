import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Contact } from "@/components/sections/Contact";
import { contact } from "@/data/contact";

describe("Contact", () => {
  it("renders the English headline and form fields by default", () => {
    render(<Contact />);
    expect(screen.getByText(contact.en.headline)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: contact.en.submitLabel })).toBeInTheDocument();
  });

  it("renders the structured consent line with a working privacy link, not the old split() hack", () => {
    const { container } = render(<Contact />);
    const link = screen.getByRole("link", { name: contact.en.consent.linkLabel });
    expect(link).toHaveAttribute("href", "/privacy");
    const note = container.querySelector('p[class*="formNote"]');
    expect(note?.textContent).toContain(contact.en.consent.before.trim());
    expect(note?.textContent).toContain(contact.en.formNote);
  });

  it("includes a hidden locale field matching the rendered locale", () => {
    const { container } = render(<Contact />);
    const localeField = container.querySelector('input[name="locale"]');
    expect(localeField).toHaveAttribute("value", "en");
  });

  it("renders Arabic form labels and consent when locale is ar", () => {
    render(<Contact locale="ar" />);
    expect(screen.getByText(contact.ar.headline)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: contact.ar.submitLabel })).toBeInTheDocument();

    const link = screen.getByRole("link", { name: contact.ar.consent.linkLabel });
    expect(link).toHaveAttribute("href", "/ar/privacy");

    expect(
      screen.getByRole("link", { name: new RegExp(contact.ar.whatsappButtonLabel) }),
    ).toBeInTheDocument();

    for (const field of Object.values(contact.ar.formFields)) {
      expect(screen.getAllByText(field.label).length).toBeGreaterThan(0);
    }
    for (const option of contact.ar.formFields.role?.options ?? []) {
      expect(screen.getAllByText(option.label).length).toBeGreaterThan(0);
    }
  });
});
