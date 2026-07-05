"use client";

import {
  useActionState,
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FormField } from "@/components/ui/FormField";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { TextLink } from "@/components/ui/TextLink";
import { Button } from "@/components/ui/Button";
import { ValidationMorph } from "@/components/motion/ValidationMorph";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { contact } from "@/data/contact";
import { SITE } from "@/lib/site";
import { submitContactForm } from "@/app/actions/contact";
import type { ContactFormData, ContactFormResult } from "@/types/forms";
import styles from "./Contact.module.css";

const HONEYPOT_NAME = "company_website";
const MIN_PROJECT_LENGTH = 10;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = Partial<Record<keyof ContactFormData, string>>;

function validateClient(formData: FormData): FieldErrors {
  const errors: FieldErrors = {};

  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    errors.name = "Please enter your name.";
  }

  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    errors.email = "Please enter your email.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  const role = String(formData.get("role") ?? "");
  if (!role) {
    errors.role = "Please select your role.";
  }

  const project = String(formData.get("project") ?? "");
  if (!project) {
    errors.project = "Please tell us about your project.";
  } else if (project.trim().length < MIN_PROJECT_LENGTH) {
    errors.project = "Please write at least 10 characters.";
  }

  return errors;
}

function vibrateOnSubmit() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(8);
  }
}

export function Contact(): ReactNode {
  const [state, formAction, isPending] = useActionState<ContactFormResult | null, FormData>(
    async (_prevState, formData) => submitContactForm(_prevState, formData),
    null,
  );
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const reduced = useReducedMotion();

  const success = state?.ok === true;
  const serverErrors = state && !state.ok ? (state.fieldErrors ?? {}) : ({} as FieldErrors);
  const topError = state && !state.ok ? state.error : null;

  useEffect(() => {
    if (state && !state.ok) {
      setClientErrors(serverErrors);
    }
  }, [state, serverErrors]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      vibrateOnSubmit();
      const form = event.currentTarget;
      const formData = new FormData(form);
      const errors = validateClient(formData);
      setClientErrors(errors);

      if (Object.keys(errors).length > 0) {
        const firstInvalid = form.querySelector<HTMLElement>("[aria-invalid='true']");
        firstInvalid?.focus();
        return;
      }

      formAction(formData);
    },
    [formAction],
  );

  const getFieldError = (name: keyof FieldErrors): string | undefined => {
    return clientErrors[name];
  };

  const buttonVariants = {
    idle: { scale: 1 },
    success: { scale: reduced ? 1 : [1, 1.03, 1], transition: springs.snap },
  };

  return (
    <ScrollReveal amount={0.15}>
      <Section id="contact" ariaLabelledby="contact-heading">
        <div className={styles.grid}>
          <div className={styles.content}>
            <SectionHeader
              eyebrow={contact.eyebrow}
              headline={contact.headline}
              subline={contact.subline}
              id="contact-heading"
            />
            <address className={styles.details}>
              <p className={styles.location}>{contact.location}</p>
              <p>
                <TextLink href={`mailto:${contact.email}`}>{contact.email}</TextLink>
              </p>
              <p className={styles.whatsapp}>
                <WhatsAppButton />
              </p>
              <p>
                <a href={SITE.instagram} className={styles.instagram}>
                  {contact.instagramLinkLabel} → {contact.instagramHandle}
                </a>
              </p>
            </address>
          </div>

          <div className={styles.formCard}>
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              {Object.entries(contact.formFields).map(([name, config]) => (
                <FormField
                  key={name}
                  name={name}
                  label={config.label}
                  type={config.type}
                  required={config.required}
                  options={config.options}
                  error={getFieldError(name)}
                  disabled={success}
                />
              ))}

              <input
                type="hidden"
                name="formTimestamp"
                defaultValue={Date.now()}
                suppressHydrationWarning
              />
              <input
                type="text"
                name={HONEYPOT_NAME}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className={styles.honeypot}
                defaultValue=""
              />

              {topError ? <ValidationMorph state="error" message={topError} /> : null}

              <div className={styles.submit}>
                <motion.div
                  animate={success ? "success" : "idle"}
                  variants={buttonVariants}
                  style={{ width: "100%" }}
                >
                  <Button
                    variant="filled"
                    type="submit"
                    loading={isPending && !success}
                    disabled={success}
                  >
                    <AnimatePresence mode="sync" initial={false}>
                      {success ? (
                        <motion.span
                          key="success"
                          className={styles.buttonContent}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={reduced ? { duration: 0 } : { duration: 0.3 }}
                        >
                          <ValidationMorph state="success" message="Thank you" />
                        </motion.span>
                      ) : isPending ? (
                        <motion.span
                          key="pending"
                          className={styles.buttonContent}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={reduced ? { duration: 0 } : { duration: 0.3 }}
                        >
                          {contact.loadingText}
                          <span className={styles.loadingLine} aria-hidden="true" />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="idle"
                          className={styles.buttonContent}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={reduced ? { duration: 0 } : { duration: 0.3 }}
                        >
                          Send inquiry
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </div>

              <p className={styles.formNote}>
                {contact.consentMicrocopy.split("Privacy Policy")[0]}
                <TextLink href="/privacy">Privacy Policy</TextLink>. {contact.formNote}
              </p>
            </form>
          </div>
        </div>
      </Section>
    </ScrollReveal>
  );
}

export default Contact;
