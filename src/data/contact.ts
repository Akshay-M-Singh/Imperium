// Contact — contact details + form configuration (Roadmap Phase 4.17).

export interface ContactData {
  eyebrow: string;
  headline: string;
  subline: string;
  location: string;
  email: string;
  instagramHandle: string;
  formNote: string;
  formFields: {
    name: { label: string; type: "text"; required: true };
    company: { label: string; type: "text"; required: false };
    role: {
      label: string;
      type: "select";
      required: true;
      options: { value: string; label: string }[];
    };
    project: { label: string; type: "textarea"; required: true };
  };
}

export const contact: ContactData = {
  eyebrow: "Contact",
  headline: "Let's talk fabric.",
  subline: "Placeholder subline from PRD.",
  location: "Dubai, UAE · Italy",
  email: "hello@imperiumitaliantextile.com",
  instagramHandle: "@imperiumitaliantextile",
  formNote: "We respond within 24 hours.",
  formFields: {
    name: { label: "Your name", type: "text", required: true },
    company: { label: "Company", type: "text", required: false },
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
