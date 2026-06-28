// Testimonials — conditional render. If this array is empty, the
// Testimonials section does not render. No placeholder "[Name]" text ever
// appears live (DESIGN.md §9.07, Roadmap Phase 4.7).

export interface Testimonial {
  quote: string;
  attribution: string;
}

export const testimonials: Testimonial[] = [
  // Add real testimonials here once confirmed. Leave empty until then.
];
