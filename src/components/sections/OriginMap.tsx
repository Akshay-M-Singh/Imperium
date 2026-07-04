// OriginMap — asymmetric 7/5 layout with illustrated Italy + routes
// (DESIGN.md §9.03, Roadmap Phase 3.1).

import { Section } from "@/components/layout";
import { SectionHeader } from "@/components/ui";
import { ScrollReveal } from "@/components/motion";
import styles from "./OriginMap.module.css";

const MAP_TITLE =
  "Illustrated map of Italy with fabric delivery routes to Dubai, Riyadh, London, and Mumbai";

export function OriginMap() {
  return (
    <ScrollReveal amount={0.2} as="section">
      <Section id="origin" ariaLabelledby="origin-heading" background="pietra">
        <div className={styles.grid}>
          <div className={styles.map}>
            <svg
              viewBox="0 0 600 420"
              width="100%"
              role="img"
              aria-label={MAP_TITLE}
              className={styles.svg}
            >
              <title>{MAP_TITLE}</title>

              {/* Italy — hand-drawn-feeling outline */}
              <path
                className={styles.italy}
                d="M245,78
                   C258,75 270,82 278,94
                   C285,86 296,84 305,91
                   C312,85 322,88 328,96
                   C338,94 346,103 344,114
                   C352,118 356,128 352,138
                   C358,146 356,158 348,165
                   C354,174 350,186 342,192
                   C348,202 342,214 332,218
                   C338,230 330,242 318,244
                   C324,256 316,270 304,272
                   C308,284 300,296 290,298
                   C292,310 284,322 274,324
                   C276,336 268,348 258,350
                   C254,360 244,366 234,364
                   C226,372 214,374 204,368
                   C194,372 184,366 180,356
                   C170,354 164,344 166,334
                   C160,326 162,314 170,308
                   C166,298 172,288 182,286
                   C180,276 188,268 198,268
                   C198,258 206,250 216,250
                   C218,240 226,232 236,232
                   C238,222 246,214 256,214
                   C258,204 266,196 276,196
                   C278,186 286,178 296,178
                   C298,168 306,160 316,160
                   C318,150 326,142 336,142
                   C338,132 346,124 356,124
                   C358,114 366,106 376,106
                   C378,96 386,88 396,88
                   C400,80 410,76 420,78
                   C418,86 410,94 400,96
                   C398,104 390,110 380,110
                   C378,118 370,124 360,124
                   C358,132 350,138 340,138
                   C338,146 330,152 320,152
                   C318,160 310,166 300,166"
              />

              {/* Sicily */}
              <path
                className={styles.italy}
                d="M210,385
                   C220,382 230,388 236,396
                   C244,394 252,400 254,408
                   C250,416 240,420 230,418
                   C220,422 210,418 204,410
                   C198,406 198,396 204,390
                   C206,386 208,384 210,385 Z"
              />

              {/* Routes */}
              <path className={styles.route} d="M290,185 Q360,180 430,250" />
              <path className={styles.route} d="M285,195 Q340,210 395,270" />
              <path className={styles.route} d="M245,95 Q180,80 115,105" />
              <path className={styles.routeFuture} d="M295,190 Q380,160 475,250" />

              {/* City pins */}
              <circle className={styles.pin} cx="430" cy="250" r="3" />
              <circle className={styles.pin} cx="395" cy="270" r="3" />
              <circle className={styles.pin} cx="115" cy="105" r="3" />
              <circle className={styles.pinFuture} cx="475" cy="250" r="3" />

              {/* Italy origin pin */}
              <circle className={styles.originPin} cx="270" cy="210" r="6" />

              {/* Labels */}
              <text className={styles.label} x="440" y="254">
                Dubai
              </text>
              <text className={styles.label} x="405" y="274">
                Riyadh
              </text>
              <text className={styles.label} x="80" y="100">
                London
              </text>
              <text className={styles.label} x="485" y="254">
                Mumbai
              </text>
            </svg>
          </div>

          <div className={styles.content}>
            <SectionHeader
              id="origin-heading"
              eyebrow="Our reach"
              headline={
                <>
                  {"Born in Italy."}
                  <br />
                  {"Delivered to the world."}
                </>
              }
              subline="From the mills of Italy to the ateliers and hotels of the UAE — we bridge the distance between craft and client."
            />
          </div>
        </div>
      </Section>
    </ScrollReveal>
  );
}

export default OriginMap;
