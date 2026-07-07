// FabricCard — 4:5 portrait image + tagline + italic title + body + CTA
// (DESIGN.md §9.04, amended by client direction: a short promise line sits
// beneath the image where the material-tag strip was; tags stay in the
// data model for the future filterable library). TiltCard motion wrapper
// applied in Phase 5.6 (MOTION_SPEC.md §3.1).

import Image from "next/image";
import type { CollectionCard } from "@/types/collections";
import { TiltCard, TiltCardImage } from "@/components/motion/TiltCard";
import { TextLink } from "./TextLink";
import { cn } from "@/lib/utils";
import styles from "./FabricCard.module.css";

export interface FabricCardProps {
  collection: CollectionCard;
  /** "stack" = image above text (default). "spread" = editorial panel,
   *  image beside text — used by the desktop pinned showcase. */
  layout?: "stack" | "spread";
}

export function FabricCard({ collection, layout = "stack" }: FabricCardProps) {
  const { tagline, tagAccent, title, body, cta, image } = collection;

  return (
    <TiltCard className={cn(styles.card, layout === "spread" && styles.spread)}>
      <article className={styles.article}>
        <div className={styles.imageWrap}>
          <TiltCardImage>
            <Image
              src={image.src}
              alt={image.alt}
              width={400}
              height={500}
              loading="lazy"
              sizes="(min-width: 1024px) 460px, 76vw"
              className={styles.image}
            />
          </TiltCardImage>
        </div>
        <div className={styles.content}>
          <p className={cn(styles.tagline, tagAccent === "oro-antico" && styles.taglineAccent)}>
            {tagline}
          </p>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.body}>{body}</p>
          <div className={styles.cta}>
            <span className={styles.ctaInner}>
              <TextLink href={cta.href}>{cta.label} →</TextLink>
            </span>
          </div>
        </div>
      </article>
    </TiltCard>
  );
}

export default FabricCard;
