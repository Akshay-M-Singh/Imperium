import type { Metadata } from "next";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SITE } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <main id="main">
      <Section>
        <div className={styles.container}>
          <SectionHeader
            eyebrow="Legal"
            headline="Privacy Policy"
            subline={`${SITE.name} respects your privacy. This policy explains how we handle the information you share with us.`}
          />

          <div className={styles.body}>
            <p>
              We collect only the information you voluntarily provide through our contact form —
              your name, email address, company, phone number, role, and project details. We use
              this information solely to respond to your inquiry and arrange samples or
              consultations.
            </p>

            <p>
              We do not sell, rent, or share your personal information with third parties. Your
              details are stored securely and retained only for as long as necessary to fulfil your
              request or comply with legal obligations.
            </p>

            <p>
              If you have any questions about this policy or how we handle your data, please email
              us at{" "}
              <a href={`mailto:${SITE.email}`} className={styles.email}>
                {SITE.email}
              </a>
              .
            </p>
          </div>
        </div>
      </Section>
    </main>
  );
}
