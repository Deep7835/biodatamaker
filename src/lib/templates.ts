export type Layout = "classic" | "centered" | "sidebar" | "banner" | "minimal" | "royal" | "twocol";
export type Frame = "double" | "ornate" | "corners" | "mandala" | "none" | "arch" | "toran" | "paisley" | "jharokha" | "rangoli";
export type PhotoShape = "rect" | "round" | "arch";
export type FontPair = "traditional" | "elegant" | "modern" | "decorative";

export type Palette = {
  id: string;
  name: string;
  bg: string;
  paper: string;
  ink: string;
  muted: string;
  accent: string;
  accent2: string;
  line: string;
  dark?: boolean;
};

export type Template = {
  id: string;
  name: string;
  layout: Layout;
  frame: Frame;
  palette: Palette;
  fonts: FontPair;
  photo: PhotoShape;
  premium: boolean;
  tags: string[];
};

export const PALETTES: Record<string, Palette> = {
  kesari: { id: "kesari", name: "Kesari", bg: "#FFF9F0", paper: "#FFFDF8", ink: "#3B2415", muted: "#7A5A43", accent: "#C0561B", accent2: "#D9A441", line: "#E7C58F" },
  maroon: { id: "maroon", name: "Maroon Gold", bg: "#FFF8F2", paper: "#FFFCF7", ink: "#2E1A1A", muted: "#6E4B45", accent: "#7F1D2D", accent2: "#B8893B", line: "#DCC08A" },
  peacock: { id: "peacock", name: "Peacock", bg: "#F3FAF9", paper: "#FBFEFD", ink: "#10302F", muted: "#40615F", accent: "#0E6B6B", accent2: "#C79A3B", line: "#A9D1C9" },
  rose: { id: "rose", name: "Rose", bg: "#FFF6F7", paper: "#FFFCFC", ink: "#3A1F27", muted: "#7B5360", accent: "#B23A5B", accent2: "#D8A0A9", line: "#EFC4CC" },
  royalblue: { id: "royalblue", name: "Royal Blue", bg: "#F5F7FD", paper: "#FCFDFF", ink: "#16213E", muted: "#4A5578", accent: "#23408E", accent2: "#C9A24B", line: "#C3CDEB" },
  emerald: { id: "emerald", name: "Emerald", bg: "#F4FAF5", paper: "#FCFEFC", ink: "#15291C", muted: "#48604F", accent: "#1F6B3A", accent2: "#C2A14B", line: "#B7D6BF" },
  lavender: { id: "lavender", name: "Lavender", bg: "#F8F6FD", paper: "#FDFCFF", ink: "#2A2140", muted: "#625880", accent: "#6A4C9C", accent2: "#C7A6D9", line: "#D8CDEE" },
  charcoal: { id: "charcoal", name: "Charcoal", bg: "#FAFAF9", paper: "#FFFFFF", ink: "#1F1F1F", muted: "#5F5F5F", accent: "#2B2B2B", accent2: "#9C8A6B", line: "#DADADA" },
  haldi: { id: "haldi", name: "Haldi", bg: "#FFFBEA", paper: "#FFFEF6", ink: "#3A2C06", muted: "#6D5A1F", accent: "#B7791F", accent2: "#E3B53B", line: "#EFD98B" },
  mehndi: { id: "mehndi", name: "Mehndi", bg: "#F7F8EE", paper: "#FDFDF7", ink: "#2B2E14", muted: "#5D6134", accent: "#5E6B1E", accent2: "#B08D3C", line: "#D4D8A8" },
  nightteal: { id: "nightteal", name: "Night Teal", bg: "#0F3B3E", paper: "#123F43", ink: "#F5EBD3", muted: "#CDBF9C", accent: "#E4B85C", accent2: "#E4B85C", line: "#6E8C7E", dark: true },
  wine: { id: "wine", name: "Wine", bg: "#4A0E1C", paper: "#521222", ink: "#FBEFD9", muted: "#E2C9A6", accent: "#E9BE62", accent2: "#E9BE62", line: "#8A4A4F", dark: true },
  sindoor: { id: "sindoor", name: "Sindoor", bg: "#FFF7F3", paper: "#FFFBF8", ink: "#3A1410", muted: "#7A4A40", accent: "#B3261E", accent2: "#D4A017", line: "#EBC9A8" },
  champagne: { id: "champagne", name: "Champagne", bg: "#FAF5EC", paper: "#FCF8F1", ink: "#3B3024", muted: "#7A6A55", accent: "#9C7A3C", accent2: "#C9A96E", line: "#E6D8BD" },
  blush: { id: "blush", name: "Blush", bg: "#FFF5F4", paper: "#FFF9F8", ink: "#3D2A2E", muted: "#80636A", accent: "#B5646F", accent2: "#D9A77C", line: "#F0D3D2" },
  marigold: { id: "marigold", name: "Marigold", bg: "#FFF8EC", paper: "#FFFBF2", ink: "#3A2508", muted: "#7A5B2E", accent: "#C2410C", accent2: "#F59E0B", line: "#F3D29B" },
  emeraldnight: { id: "emeraldnight", name: "Emerald Night", bg: "#0E3325", paper: "#113A2B", ink: "#F3EBD6", muted: "#CBBF9F", accent: "#D8B35B", accent2: "#D8B35B", line: "#4F7A64", dark: true },
  royalpurple: { id: "royalpurple", name: "Royal Purple", bg: "#2A1740", paper: "#2F1B48", ink: "#F4ECDD", muted: "#CEC0DA", accent: "#E0B860", accent2: "#E0B860", line: "#6A5288", dark: true },
  navy: { id: "navy", name: "Midnight", bg: "#141C3A", paper: "#17214A", ink: "#F1EAD8", muted: "#C7BFA6", accent: "#D9B45A", accent2: "#D9B45A", line: "#4A5588", dark: true },
};

type Spec = [id: string, name: string, layout: Layout, frame: Frame, palette: keyof typeof PALETTES, fonts: FontPair, photo: PhotoShape, premium: boolean, tags: string[]];

const SPECS: Spec[] = [
  ["kesari-classic", "Kesari Classic", "classic", "double", "kesari", "traditional", "rect", false, ["traditional", "marathi", "hindi"]],
  ["maroon-heritage", "Maroon Heritage", "classic", "ornate", "maroon", "traditional", "rect", false, ["traditional"]],
  ["peacock-grace", "Peacock Grace", "classic", "corners", "peacock", "elegant", "arch", false, ["elegant"]],
  ["rose-petal", "Rose Petal", "centered", "corners", "rose", "elegant", "round", false, ["girl", "elegant"]],
  ["haldi-mangal", "Haldi Mangal", "centered", "mandala", "haldi", "decorative", "round", false, ["traditional", "festive"]],
  ["royal-blue-sidebar", "Royal Blue", "sidebar", "none", "royalblue", "modern", "round", false, ["modern", "boy"]],
  ["simple-minimal", "Simple Minimal", "minimal", "none", "charcoal", "modern", "rect", false, ["simple", "modern"]],
  ["emerald-band", "Emerald Band", "banner", "none", "emerald", "modern", "round", false, ["modern"]],
  ["lavender-bloom", "Lavender Bloom", "centered", "arch", "lavender", "elegant", "arch", false, ["girl", "elegant"]],
  ["mehndi-leaf", "Mehndi Leaf", "classic", "corners", "mehndi", "traditional", "rect", false, ["traditional"]],
  ["night-teal-royal", "Night Teal Royal", "royal", "ornate", "nightteal", "decorative", "round", true, ["royal", "premium"]],
  ["wine-royal", "Wine Royal", "royal", "mandala", "wine", "decorative", "arch", true, ["royal", "premium"]],
  ["midnight-gold", "Midnight Gold", "royal", "double", "navy", "elegant", "rect", true, ["royal", "premium"]],
  ["maroon-sidebar", "Maroon Sidebar", "sidebar", "none", "maroon", "traditional", "rect", false, ["modern"]],
  ["kesari-band", "Kesari Band", "banner", "none", "kesari", "decorative", "round", false, ["festive"]],
  ["peacock-minimal", "Peacock Minimal", "minimal", "none", "peacock", "elegant", "round", false, ["simple"]],
  ["rose-classic", "Rose Classic", "classic", "double", "rose", "elegant", "rect", false, ["girl"]],
  ["royal-blue-classic", "Royal Blue Classic", "classic", "ornate", "royalblue", "traditional", "rect", false, ["boy", "traditional"]],
  ["emerald-mandala", "Emerald Mandala", "centered", "mandala", "emerald", "traditional", "round", true, ["premium", "traditional"]],
  ["haldi-sidebar", "Haldi Sidebar", "sidebar", "none", "haldi", "elegant", "arch", true, ["premium", "modern"]],
  ["lavender-minimal", "Lavender Minimal", "minimal", "none", "lavender", "modern", "round", false, ["simple", "girl"]],
  ["charcoal-classic", "Charcoal Formal", "classic", "double", "charcoal", "modern", "rect", false, ["simple", "boy"]],
  ["maroon-arch", "Maroon Arch", "centered", "arch", "maroon", "decorative", "arch", true, ["premium", "traditional"]],
  ["mehndi-band", "Mehndi Band", "banner", "none", "mehndi", "elegant", "round", false, ["modern"]],
  // Premium collection: Indian motifs (toran, paisley, jharokha, rangoli) and the two-column layout.
  ["marigold-toran", "Marigold Toran", "classic", "toran", "marigold", "traditional", "rect", true, ["premium", "traditional"]],
  ["sindoor-toran", "Sindoor Toran", "centered", "toran", "sindoor", "decorative", "round", true, ["premium", "traditional", "girl"]],
  ["jharokha-gold", "Jharokha Gold", "centered", "jharokha", "champagne", "elegant", "arch", true, ["premium", "royal"]],
  ["emerald-jharokha", "Emerald Jharokha", "royal", "jharokha", "emeraldnight", "decorative", "arch", true, ["premium", "royal"]],
  ["paisley-wine", "Paisley Wine", "royal", "paisley", "wine", "decorative", "round", true, ["premium", "royal"]],
  ["purple-paisley", "Royal Purple Paisley", "royal", "paisley", "royalpurple", "elegant", "round", true, ["premium", "royal"]],
  ["rangoli-festive", "Rangoli Festive", "classic", "rangoli", "kesari", "traditional", "rect", true, ["premium", "traditional"]],
  ["blush-rangoli", "Blush Rangoli", "twocol", "rangoli", "blush", "elegant", "round", true, ["premium", "girl", "modern"]],
  ["champagne-duo", "Champagne Duo", "twocol", "double", "champagne", "elegant", "rect", true, ["premium", "modern", "simple"]],
  ["sindoor-paisley", "Sindoor Paisley", "twocol", "paisley", "sindoor", "traditional", "arch", true, ["premium", "traditional"]],
  ["marigold-sidebar", "Marigold Sidebar", "sidebar", "none", "marigold", "decorative", "arch", true, ["premium", "modern"]],
];

export const TEMPLATES: Template[] = SPECS.map(([id, name, layout, frame, palette, fonts, photo, premium, tags]) => ({
  id,
  name,
  layout,
  frame,
  palette: PALETTES[palette],
  fonts,
  photo,
  premium,
  tags,
}));

export function getTemplate(id: string | undefined): Template {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}

/** CSS font-family stacks per pair. Variables are defined by next/font in the root layout. */
export const FONT_STACKS: Record<FontPair, { heading: string; body: string }> = {
  traditional: { heading: "var(--font-rozha), var(--font-tiro), serif", body: "var(--font-tiro), var(--font-mukta), serif" },
  elegant: { heading: "var(--font-yatra), var(--font-playfair), serif", body: "var(--font-martel), var(--font-mukta), serif" },
  modern: { heading: "var(--font-mukta), sans-serif", body: "var(--font-mukta), sans-serif" },
  decorative: { heading: "var(--font-amita), var(--font-playfair), serif", body: "var(--font-tiro), var(--font-mukta), serif" },
};

const IMAGE_PREFIX = { en: "marriage-biodata-format", hi: "hindi-biodata-format", mr: "marathi-biodata-format" } as const;
const IMAGE_ALT = {
  en: (name: string) => `${name} – marriage biodata format with photo`,
  hi: (name: string) => `${name} – शादी का बायोडाटा फॉर्मेट (हिंदी) फोटो के साथ`,
  mr: (name: string) => `${name} – मराठी बायोडाटा फॉरमॅट लग्नासाठी फोटोसह`,
};

/** Pre-rendered preview (scripts/generate-assets.mjs) with an SEO-friendly filename, alt text and a small variant. */
export function templateImage(lang: keyof typeof IMAGE_PREFIX, t: Template) {
  const base = `/templates/${lang}/${IMAGE_PREFIX[lang]}-${t.id}`;
  return {
    src: `${base}.webp`,
    srcSet: `${base}-sm.webp 302w, ${base}.webp 596w`,
    alt: IMAGE_ALT[lang](t.name),
    width: 596,
    height: 842,
  };
}

/** Pre-rendered hero sample for a content page (lang + slug, "" = home). */
export const heroImage = (lang: string, slug: string) => `/hero/${lang}-${slug || "home"}.webp`;
