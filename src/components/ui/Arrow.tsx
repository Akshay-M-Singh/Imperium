import styles from "./Arrow.module.css";

// Decorative directional arrow. Mirrors under [dir="rtl"] so "forward"
// always points in the reading direction (Architecture §8: no hardcoded
// directional glyphs).
export function Arrow() {
  return (
    <span aria-hidden="true" className={styles.arrow}>
      →
    </span>
  );
}

export default Arrow;
