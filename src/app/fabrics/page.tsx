// Fabrics — light V1 detail page backing the collection-card CTAs.
// Deep anchors (/fabrics#tessuti-italiani etc.) land on each block.
// Footer and WhatsApp bar render from the root layout.

import type { Metadata } from "next";
import Image from "next/image";
import { Navigation } from "@/components/layout";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextLink } from "@/components/ui/TextLink";
import { collections } from "@/data/collections";
import { seo } from "@/data/seo";
import { cn } from "@/lib/utils";
import styles from "./fabrics.module.css";

export const metadata: Metadata = {
  title: seo.fabrics.title,
  description: seo.fabrics.description,
  alternates: { canonical: seo.fabrics.canonical },
};

export default function FabricsPage() {
  return (
    <>
      <Navigation />
      <main id="main">
        <Section>
          <header className={styles.pageHeader}>
            <Eyebrow>Our collections</Eyebrow>
            <h1 className={styles.pageTitle}>Fabric Collections</h1>
          </header>
        </Section>
        {collections.map((collection, index) => (
          <Section
            key={collection.id}
            id={collection.id}
            background={index % 2 === 0 ? "gesso" : "pietra"}
            ariaLabelledby={`${collection.id}-heading`}
          >
            <div className={cn(styles.row, index % 2 === 1 && styles.reversed)}>
              <div className={styles.imageFrame}>
                <Image
                  src={collection.image.src}
                  alt={collection.image.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className={styles.image}
                />
              </div>
              <div className={styles.text}>
                <p className={styles.tagline}>{collection.tagline}</p>
                <h2
                  id={`${collection.id}-heading`}
                  className={cn(styles.title, collection.titleItalic && styles.titleItalic)}
                >
                  {collection.title}
                </h2>
                <p className={styles.body}>{collection.body}</p>
                <TextLink href="/#contact">Request a sample →</TextLink>
              </div>
            </div>
          </Section>
        ))}
      </main>
    </>
  );
}
