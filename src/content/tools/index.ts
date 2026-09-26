import type { PageContent } from "../types";
import { GUNA_MILAN } from "./guna-milan";
import { BIRTH_CHART } from "./birth-chart";
import { INVITATION } from "./invitation";
import { MUHURAT } from "./muhurat";
import { WHATSAPP } from "./whatsapp";
import { TYPING } from "./typing";
import { HEIGHT } from "./height";
import { AGE_GAP } from "./age-gap";
import { HUB } from "./hub";

/** Tool pages (calculators, typing, invitation maker…) and the tools hub, all languages. */
export const TOOL_PAGES: PageContent[] = [...GUNA_MILAN, ...BIRTH_CHART, ...INVITATION, ...MUHURAT, ...WHATSAPP, ...TYPING, ...HEIGHT, ...AGE_GAP, ...HUB];
