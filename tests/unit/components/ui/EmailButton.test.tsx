import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmailButton } from "@/components/ui/EmailButton";

describe("EmailButton", () => {
  it("renders a mailto link with the localized subject prefilled", () => {
    render(<EmailButton />);
    const link = screen.getByRole("link", { name: "Email Us" });
    expect(link).toHaveAttribute(
      "href",
      `mailto:imperium.italian.textile@gmail.com?subject=${encodeURIComponent(
        "Fabric inquiry — Imperium Italian Textile",
      )}`,
    );
    // mailto must open the mail client in place, never a blank tab
    expect(link).not.toHaveAttribute("target");
  });

  it("renders the Arabic label for locale ar", () => {
    render(<EmailButton locale="ar" />);
    expect(screen.getByRole("link", { name: "راسلنا عبر البريد الإلكتروني" })).toBeInTheDocument();
  });
});
