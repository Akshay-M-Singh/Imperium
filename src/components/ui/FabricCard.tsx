// FabricCard — 4:5 portrait image + tag + italic title + body + CTA
// (DESIGN.md §9.04, Roadmap Phase 3.6). TiltCard motion wrapper applied
// in Phase 5.6 (MOTION_SPEC.md §3.1).

import Image from "next/image";
import type { CollectionCard } from "@/types/collections";
import { TiltCard, TiltCardImage } from "@/components/motion/TiltCard";
import { TextLink } from "./TextLink";
import { cn } from "@/lib/utils";
import styles from "./FabricCard.module.css";

export interface FabricCardProps {
  collection: CollectionCard;
}

export function FabricCard({ collection }: FabricCardProps) {
  const { tags, tagAccent, title, body, cta, image } = collection;

  return (
    <TiltCard className={styles.card}>
      <article className={styles.article}>
        <div className={styles.imageWrap}>
          <TiltCardImage>
            <Image
              src={image.src}
              alt={image.alt}
              width={400}
              height={500}
              loading="lazy"
              className={styles.image}
            />
          </TiltCardImage>
        </div>
        <div className={styles.content}>
          <p className={cn(styles.tags, tagAccent === "oro-antico" && styles.tagsAccent)}>
            {tags.join(" · ")}
          </p>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.body}>{body}</p>
          <div className={styles.cta}>
            <span className={styles.ctaInner}>
              <TextLink href={cta.href}>{cta.label}</TextLink>
            </span>
          </div>
        </div>
      </article>
    </TiltCard>
  );
}

export default FabricCard;
