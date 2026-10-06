import type { Gender, Religion } from "@/lib/biodata";
import type { Lang } from "@/lib/i18n";

export type Topic =
  | "home"
  | "format"
  | "girl"
  | "boy"
  | "guide"
  | "samples"
  | "hindu"
  | "jain"
  | "buddhist"
  | "muslim"
  | "christian"
  | "sikh"
  | "brahmin"
  | "maratha"
  | "secondMarriage"
  | "withoutPhoto"
  | "expectations"
  | "horoscopeGuide"
  | "familyDetails"
  | "tools"
  | ToolId
  | "templates"
  | "create";

/** Interactive tools; each has a page per language with the tool embedded above the article. */
export type ToolId = "gunaMilan" | "birthChart" | "whatsapp" | "typing" | "height" | "ageGap" | "muhurat" | "invitation";
export const TOOL_IDS: ToolId[] = ["gunaMilan", "birthChart", "invitation", "muhurat", "whatsapp", "typing", "height", "ageGap"];

export type PageContent = {
  lang: Lang;
  topic: Topic;
  /** "" for the language home page. */
  slug: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  /** Hero sample. `noPhoto` hides the photo frame (e.g. the "without photo" page). */
  sample: { gender?: Gender; religion?: Religion; templateId?: string; noPhoto?: boolean };
  /** Light markdown: blank-line paragraphs, "## " / "### " headings, "- " bullets, "1. " steps, **bold**. */
  body: string;
  faqs: { q: string; a: string }[];
  updated: string;
  /** Renders this interactive tool at the top of the page (tool pages only). */
  tool?: ToolId;
};
