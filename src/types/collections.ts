// Collections types.

export type TagAccent = "sabbia" | "oro-antico";

export interface CollectionCard {
  id: string;
  tags: string[];
  tagAccent?: TagAccent;
  title: string;
  titleItalic?: boolean;
  body: string;
  cta: { label: string; href: string };
  image: { src: string; alt: string };
}

export type CollectionsData = CollectionCard[];
