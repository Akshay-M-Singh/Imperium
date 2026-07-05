// Collections types.

export type TagAccent = "sabbia" | "oro-antico";

export interface CollectionCard {
  id: string;
  /** Material tags — kept on the model as groundwork for a future
   *  filterable library (PRD D-01c); the card renders `tagline` instead. */
  tags: string[];
  tagAccent?: TagAccent;
  title: string;
  titleItalic?: boolean;
  /** Short promise line rendered beneath the card image. */
  tagline: string;
  body: string;
  cta: { label: string; href: string };
  image: { src: string; alt: string };
}

export type CollectionsData = CollectionCard[];
