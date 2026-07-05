// Testimonials — conditionally rendered when data is available
// (DESIGN.md §9.07, Roadmap Phase 4.6–4.7).
// If `data/testimonials.ts` exports an empty array, this section does not
// render. No placeholder "[Name]" text ever appears live.

import { Section } from "@/components/layout/Section";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { testimonials } from "@/data/testimonials";
import styles from "./Testimonials.module.css";

export function Testimonials() {
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <ScrollReveal amount={0.2}>
      <Section id="testimonials" ariaLabelledby="testimonials-heading">
        <h2 id="testimonials-heading" className="visually-hidden">
          Trusted by those who know the difference.
        </h2>
        <div className={styles.inner}>
          <div className={styles.list}>
            {testimonials.map((testimonial, index) => (
              <article key={index} className={styles.block}>
                <blockquote className={styles.quote}>{testimonial.quote}</blockquote>
                <p className={styles.attribution}>{testimonial.attribution}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>
    </ScrollReveal>
  );
}

export default Testimonials;
