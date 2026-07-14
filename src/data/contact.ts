// Contact — contact details + form configuration (Roadmap Phase 4.17).

import type { Locale } from "@/lib/i18n";

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
  consent: { before: string; linkLabel: string; after: string };
  formNote: string;
  loadingText: string;
  successText: string;
  errorText: string;
  submitLabel: string;
  validation: {
    name: string;
    emailMissing: string;
    emailInvalid: string;
    companyTooLong: string;
    phoneInvalid: string;
    roleMissing: string;
    roleInvalid: string;
    projectMissing: string;
    projectTooShort: string;
    projectLength: string;
    checkFields: string;
    tooFast: string;
    tooFastField: string;
    tooMany: string;
    thankYou: string;
  };
  formFields: Record<string, ContactFieldConfig>;
}

export const contact: Record<Locale, ContactData> = {
  en: {
    eyebrow: "Contact",
    headline: "Let's talk fabric.",
    subline:
      "Tell us what you're making. We'll bring samples, prices and timelines to the conversation.",
    location: "Dubai, UAE · Italy",
    email: "imperium.italian.textile@gmail.com",
    instagramHandle: "@imperiumitaliantextile",
    whatsappButtonLabel: "Chat on WhatsApp",
    whatsappPrefill: "Hello Imperium — I'd like to ask about fabrics.",
    instagramLinkLabel: "Follow our journey",
    consent: {
      before: "We use your details only to respond to your inquiry. See our ",
      linkLabel: "Privacy Policy",
      after: ".",
    },
    formNote: "We respond within one business day.",
    loadingText: "Sending…",
    successText: "Thank you. We'll be in touch shortly.",
    errorText: "Something went wrong. Please try WhatsApp or email us directly.",
    submitLabel: "Send inquiry",
    validation: {
      name: "Please enter your name.",
      emailMissing: "Please enter your email.",
      emailInvalid: "Please enter a valid email address.",
      companyTooLong: "Company name is too long.",
      phoneInvalid: "Please enter a valid phone number.",
      roleMissing: "Please select your role.",
      roleInvalid: "Please select a valid role.",
      projectMissing: "Please tell us about your project.",
      projectTooShort: "Please write at least 10 characters.",
      projectLength: "Please tell us more about your project (10–5000 characters).",
      checkFields: "Please check the highlighted fields.",
      tooFast: "Please take a moment before submitting.",
      tooFastField: "Submitted too quickly.",
      tooMany: "Too many submissions. Please try again later.",
      thankYou: "Thank you",
    },
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
  },
  ar: {
    eyebrow: "تواصل",
    headline: "لنتحدث عن الأقمشة.",
    subline: "أخبرنا بما تصنعه، وسنأتي إلى الحوار بالعيّنات والأسعار والجداول الزمنية.",
    location: "دبي، الإمارات العربية المتحدة · إيطاليا",
    email: "imperium.italian.textile@gmail.com",
    instagramHandle: "@imperiumitaliantextile",
    whatsappButtonLabel: "تحدّث معنا عبر واتساب",
    whatsappPrefill: "مرحبًا إمبريوم — أودّ الاستفسار عن الأقمشة.",
    instagramLinkLabel: "تابِع رحلتنا",
    consent: {
      before: "نستخدم بياناتك للرد على استفسارك فقط. راجع ",
      linkLabel: "سياسة الخصوصية",
      after: ".",
    },
    formNote: "نردّ خلال يوم عمل واحد.",
    loadingText: "جارٍ الإرسال…",
    successText: "شكرًا لك. سنتواصل معك قريبًا.",
    errorText: "حدث خطأ ما. يُرجى المحاولة عبر واتساب أو مراسلتنا مباشرة بالبريد الإلكتروني.",
    submitLabel: "إرسال الاستفسار",
    validation: {
      name: "يُرجى إدخال اسمك.",
      emailMissing: "يُرجى إدخال بريدك الإلكتروني.",
      emailInvalid: "يُرجى إدخال بريد إلكتروني صالح.",
      companyTooLong: "اسم الشركة طويل جدًا.",
      phoneInvalid: "يُرجى إدخال رقم هاتف صالح.",
      roleMissing: "يُرجى اختيار مجال عملك.",
      roleInvalid: "يُرجى اختيار مجال عمل صالح.",
      projectMissing: "يُرجى إخبارنا عن مشروعك.",
      projectTooShort: "يُرجى كتابة 10 أحرف على الأقل.",
      projectLength: "يُرجى إخبارنا بالمزيد عن مشروعك (10–5000 حرف).",
      checkFields: "يُرجى مراجعة الحقول المحدّدة.",
      tooFast: "يُرجى الانتظار لحظة قبل الإرسال.",
      tooFastField: "تم الإرسال بسرعة كبيرة.",
      tooMany: "عدد كبير من المحاولات. يُرجى المحاولة لاحقًا.",
      thankYou: "شكرًا لك",
    },
    formFields: {
      name: { label: "الاسم", type: "text", required: true },
      email: { label: "البريد الإلكتروني", type: "email", required: true },
      company: { label: "الشركة", type: "text", required: false },
      phone: { label: "الهاتف / واتساب", type: "tel", required: false },
      role: {
        label: "مجال عملك",
        type: "select",
        required: true,
        options: [
          { value: "tailor", label: "خيّاط" },
          { value: "hospitality", label: "مجموعة ضيافة" },
          { value: "designer", label: "مصمّم" },
          { value: "other", label: "غير ذلك" },
        ],
      },
      project: { label: "حدّثنا عن مشروعك", type: "textarea", required: true },
    },
  },
};
