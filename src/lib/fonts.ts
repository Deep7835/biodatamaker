import { Amita, Martel, Mukta, Playfair_Display, Rozha_One, Tiro_Devanagari_Hindi, Tiro_Devanagari_Marathi, Yatra_One } from "next/font/google";

// Two weights only: medium falls back to 400, bold to 600 (each Devanagari weight is ~65 KB on mobile).
const mukta = Mukta({ subsets: ["devanagari", "latin"], weight: ["400", "600"], variable: "--font-mukta", display: "swap" });
const tiroMr = Tiro_Devanagari_Marathi({ subsets: ["devanagari", "latin"], weight: "400", variable: "--font-tiro-mr", display: "swap", preload: false });
const tiroHi = Tiro_Devanagari_Hindi({ subsets: ["devanagari", "latin"], weight: "400", variable: "--font-tiro-hi", display: "swap", preload: false });
const rozha = Rozha_One({ subsets: ["devanagari", "latin"], weight: "400", variable: "--font-rozha", display: "swap", preload: false });
const yatra = Yatra_One({ subsets: ["devanagari", "latin"], weight: "400", variable: "--font-yatra", display: "swap", preload: false });
const martel = Martel({ subsets: ["devanagari", "latin"], weight: ["400", "700"], variable: "--font-martel", display: "swap", preload: false });
const amita = Amita({ subsets: ["devanagari", "latin"], weight: ["400", "700"], variable: "--font-amita", display: "swap", preload: false });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap", preload: false });

export const fontVars = [mukta, tiroMr, tiroHi, rozha, yatra, martel, amita, playfair].map((f) => f.variable).join(" ");
