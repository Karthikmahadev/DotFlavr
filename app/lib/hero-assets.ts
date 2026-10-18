export type HeroAsset = {
  /** Path inside /public, e.g. "/hero-table.jpg". `null` renders a placeholder block. */
  src: string | null;
  alt: string;
  caption?: string;
  /** CSS object-position, controls which part of the photo survives the crop. */
  objectPosition?: string;
};

export const HERO_ASSETS: { primary: HeroAsset; secondary: HeroAsset } = {
  // The strongest, largest image. Landscape or square works best.
  primary: {
    src: null,
    alt: "Describe what this image actually shows",
    caption: "Fig. 01 — Describe the image here",
    objectPosition: "50% 50%",
  },
  // A smaller image that overlaps the primary's edge. A portrait crop works best.
  secondary: {
    src: null,
    alt: "Describe what this image actually shows",
    objectPosition: "50% 50%",
  },
};