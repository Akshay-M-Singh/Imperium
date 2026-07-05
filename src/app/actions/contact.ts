"use server";

import { headers } from "next/headers";
import { contact } from "@/data/contact";
import { sendContactEmail } from "@/lib/email";
import type { ContactFormData, ContactFormResult } from "@/types/forms";

const HONEYPOT_FIELD = process.env.HONEYPOT_FIELD ?? "company_website";
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MIN_FILL_MS = 3000;

const ROLE_VALUES = new Set((contact.formFields.role?.options ?? []).map((option) => option.value));

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s+]*$/;

const rateLimits = new Map<string, number[]>();

function stripControlChars(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\x00-\x1F\x7F]/g, "");
}

function stripControlCharsKeepNewlines(value: string): string {
  // Keep tab (\x09), line feed (\x0A) and carriage return (\x0D).
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
}

function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export async function submitContactForm(
  _prevState: unknown,
  formData: FormData,
): Promise<ContactFormResult> {
  const rawTimestamp = String(formData.get("formTimestamp") ?? "");
  const timestamp = Number(rawTimestamp);
  if (!rawTimestamp || Number.isNaN(timestamp) || Date.now() - timestamp < MIN_FILL_MS) {
    return {
      ok: false,
      error: "Please take a moment before submitting.",
      fieldErrors: { formTimestamp: "Submitted too quickly." },
    };
  }

  const honeypot = String(formData.get(HONEYPOT_FIELD) ?? "");
  if (honeypot.length > 0) {
    console.log("[contact] honeypot filled — silent drop");
    return { ok: true };
  }

  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const realIp = h.get("x-real-ip");
  const ip = (forwarded ? forwarded.split(",")[0] : realIp)?.trim() ?? "unknown";

  if (ip !== "unknown") {
    const now = Date.now();
    const history = rateLimits.get(ip) ?? [];
    const recent = history.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (recent.length >= RATE_LIMIT_MAX) {
      return {
        ok: false,
        error: "Too many submissions. Please try again later.",
      };
    }
    recent.push(now);
    rateLimits.set(ip, recent);
  } else {
    console.log("[contact] no IP header — skipping rate limit");
  }

  const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};

  const rawName = String(formData.get("name") ?? "");
  const name = singleLine(stripControlChars(rawName));
  if (name.length === 0 || name.length > 100) {
    fieldErrors.name = "Please enter your name.";
  }

  const rawEmail = String(formData.get("email") ?? "");
  const email = singleLine(rawEmail);
  if (email.length === 0 || email.length > 254 || !EMAIL_REGEX.test(email)) {
    fieldErrors.email = "Please enter a valid email address.";
  }

  const rawCompany = String(formData.get("company") ?? "");
  const company = singleLine(stripControlChars(rawCompany));
  if (company.length > 100) {
    fieldErrors.company = "Company name is too long.";
  }

  const rawPhone = String(formData.get("phone") ?? "");
  const phone = singleLine(rawPhone);
  if (phone.length > 20 || (phone.length > 0 && !PHONE_REGEX.test(phone))) {
    fieldErrors.phone = "Please enter a valid phone number.";
  }

  const role = String(formData.get("role") ?? "");
  if (!ROLE_VALUES.has(role)) {
    fieldErrors.role = "Please select a valid role.";
  }

  const rawProject = String(formData.get("project") ?? "");
  const project = stripControlCharsKeepNewlines(rawProject);
  if (project.trim().length < 10 || project.length > 5000) {
    fieldErrors.project = "Please tell us more about your project (10–5000 characters).";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      error: "Please check the highlighted fields.",
      fieldErrors,
    };
  }

  const data: ContactFormData = {
    name,
    email,
    role,
    project,
  };
  if (company.length > 0) {
    data.company = company;
  }
  if (phone.length > 0) {
    data.phone = phone;
  }

  const result = await sendContactEmail({ data, to: process.env.RESEND_TO ?? "" });
  return result;
}
