// Contact — contact details + form configuration (Roadmap Phase 4.17).

export type ContactFieldType = "text" | "email" | "tel" | "textarea" | "select";

export interface ContactFieldConfig {
  label: string;
  type: ContactFieldType;
  required: boolean;
  options?: { value: string; label: string }[];
}

export interface ContactData {
  eyebrow: string;
  headline: string;
  subline: string;
  location: string;
  email: string;
  instagramHandle: string;
  whatsappButtonLabel: string;
  whatsappPrefill: string;
  instagramLinkLabel: string;
  consentMicrocopy: string;
  formNote: string;
  loadingText: string;
  successText: string;
  errorText: string;
  formFields: Record<string, ContactFieldConfig>;
}

export const contact: ContactData = {
  eyebrow: "Contact",
  headline: "Let's talk fabric.",
  subline:
    "Tell us what you're making. We'll bring samples, prices and timelines to the conversation.",
  location: "Dubai, UAE · Italy",
  email: "hello@imperiumitaliantextile.com",
  instagramHandle: "@imperiumitaliantextile",
  whatsappButtonLabel: "Chat on WhatsApp",
  whatsappPrefill: "Hello Imperium — I'd like to ask about fabrics.",
  instagramLinkLabel: "Follow our journey",
  consentMicrocopy: "We use your details only to respond to your inquiry. See our Privacy Policy.",
  formNote: "We respond within one business day.",
  loadingText: "Sending…",
  successText: "Thank you. We'll be in touch shortly.",
  errorText: "Something went wrong. Please try WhatsApp or email us directly.",
  formFields: {
    name: { label: "Your name", type: "text", required: true },
    email: { label: "Email", type: "email", required: true },
    company: { label: "Company", type: "text", required: false },
    phone: { label: "Phone / WhatsApp", type: "tel", required: false },
    role: {
      label: "Your role",
      type: "select",
      required: true,
      options: [
        { value: "tailor", label: "Tailor" },
        { value: "hospitality", label: "Hospitality group" },
        { value: "designer", label: "Designer" },
        { value: "other", label: "Other" },
      ],
    },
    project: { label: "Tell us about your project", type: "textarea", required: true },
  },
};
