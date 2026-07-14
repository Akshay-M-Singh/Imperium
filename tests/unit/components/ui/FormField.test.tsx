import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormField } from "@/components/ui/FormField";

describe("FormField", () => {
  const original = window.matchMedia;

  beforeEach(() => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(() => false),
    }));
  });

  afterEach(() => {
    window.matchMedia = original;
  });

  it("renders an associated label and input", () => {
    render(<FormField name="name" label="Your name" />);
    const input = screen.getByLabelText("Your name");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("name", "name");
  });

  it("renders a textarea for type textarea", () => {
    render(<FormField name="project" label="Project" type="textarea" />);
    expect(screen.getByLabelText("Project")).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("renders a select with options", () => {
    render(
      <FormField
        name="role"
        label="Your role"
        type="select"
        options={[
          { value: "tailor", label: "Tailor" },
          { value: "designer", label: "Designer" },
        ]}
      />,
    );
    const select = screen.getByLabelText("Your role") as HTMLSelectElement;
    expect(select).toBeInstanceOf(HTMLSelectElement);
    expect(screen.getByRole("option", { name: "Tailor" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Designer" })).toBeInTheDocument();
  });

  it("does not duplicate the field label as the select's placeholder text", () => {
    render(
      <FormField
        name="role"
        label="Your role"
        type="select"
        options={[{ value: "tailor", label: "Tailor" }]}
      />,
    );
    const select = screen.getByLabelText("Your role") as HTMLSelectElement;
    const placeholder = select.querySelector('option[value=""]');
    expect(placeholder).not.toBeNull();
    // The placeholder option must be empty so it doesn't echo the floating label.
    expect(placeholder?.textContent).toBe("");
  });

  it("exposes aria-invalid and error message when an error is provided", () => {
    render(<FormField name="email" label="Email" error="Invalid email" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "email-error");
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid email");
  });

  it("disables the control when disabled is true", () => {
    render(<FormField name="name" label="Your name" disabled />);
    expect(screen.getByLabelText("Your name")).toBeDisabled();
  });

  it("uses a placeholder space so CSS :placeholder-shown detection works", () => {
    render(<FormField name="name" label="Your name" />);
    expect(screen.getByLabelText("Your name")).toHaveAttribute("placeholder", " ");
  });

  it("tracks value state so the label floats after typing", async () => {
    render(<FormField name="name" label="Your name" />);
    const input = screen.getByLabelText("Your name");
    await userEvent.type(input, "Sofia");
    expect(input).toHaveValue("Sofia");
  });
});
