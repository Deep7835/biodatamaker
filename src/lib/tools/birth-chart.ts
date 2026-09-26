/**
 * Sidereal (Vedic) birth-chart maths for the Rashi / Nakshatra finder.
 *
 * Method, in short:
 * 1. Planet positions come from astronomy-engine (MIT; VSOP87 planets and a Brown-lunar-theory Moon,
 * about ±1 arcminute versus NOVAS/JPL). For each body we take the geocentric,
 *    light-time and aberration corrected vector (`GeoVector(..., true)`) and rotate it to the true
 *    ecliptic and equinox of date (`Ecliptic`). That is the apparent tropical longitude.
 * 2. Tropical → sidereal with the Lahiri (Chitrapaksha) ayanamsa. See `lahiriAyanamsa` below.
 * 3. Rahu is the MEAN lunar node (Meeus, Astronomical Algorithms ch. 47), Ketu = Rahu + 180°.
 *    Traditional Indian panchangs and the Lahiri ephemeris are built on the mean node; the true
 *    node wobbles ±1.3° around it, which only matters when Rahu sits right on a sign edge.
 * 4. Lagna (ascendant) from local apparent sidereal time, latitude and the true obliquity with the
 *    standard spherical-astronomy formula, then made sidereal with the same ayanamsa.
 * 5. Houses are whole-sign (रास = भाव), as drawn in a North Indian rashi chart.
 */
import type { Biodata, Kundali } from "@/lib/biodata";
import { Body, Ecliptic, GeoVector, MakeTime, SiderealTime, e_tilt, type AstroTime } from "astronomy-engine";

export const PLANET_KEYS = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn", "rahu", "ketu"] as const;
export type PlanetKey = (typeof PLANET_KEYS)[number];

const BODIES: Partial<Record<PlanetKey, Body>> = {
  sun: Body.Sun,
  moon: Body.Moon,
  mars: Body.Mars,
  mercury: Body.Mercury,
  jupiter: Body.Jupiter,
  venus: Body.Venus,
  saturn: Body.Saturn,
};

const norm = (deg: number) => ((deg % 360) + 360) % 360;
const RAD = Math.PI / 180;

/** Julian centuries of TT since J2000.0. */
const centuries = (t: AstroTime) => t.tt / 36525;

/**
 * IAU 1976 (Lieske) general precession in longitude p_A, in arcseconds, T in Julian centuries from J2000.
 * This is the precession model Swiss Ephemeris uses for its standard SE_SIDM_LAHIRI.
 */
function precessionInLongitude(T: number) {
  return 5029.0966 * T + 1.11113 * T * T - 0.000006 * T * T * T;
}

// Lahiri / Chitrapaksha definition (Indian Calendar Reform Committee, as revised in the Indian
// Astronomical Ephemeris 1985/89): true ayanamsa = 23°15′00.658″ at 1956-03-21 00:00 TT (JD 2435553.5).
// Removing that day's nutation in longitude (16.77″) gives the MEAN ayanamsa at the epoch,
// 23.245524743°, the exact constant used by Swiss Ephemeris (23.250182778 − 0.004658035).
const LAHIRI_T0 = (2435553.5 - 2451545.0) / 36525;
const LAHIRI_MEAN_AT_T0 = 23.250182778 - 0.004658035;

/**
 * Lahiri ayanamsa in degrees for a moment.
 * mean = value at the 1956 epoch + precession in longitude since then;
 * true = mean + nutation in longitude (what Jagannatha Hora / Swiss Ephemeris print as "Lahiri").
 * Checked against published values: 2000-01-01 true 23°51′12″ (mean 23°51′26″),
 * 2026-01-01 true 24°13′19″ (mean 24°13′13″); agreement within a few arcseconds.
 */
export function lahiriAyanamsa(date: Date, kind: "mean" | "true" = "true") {
  const t = MakeTime(date);
  const mean = LAHIRI_MEAN_AT_T0 + (precessionInLongitude(centuries(t)) - precessionInLongitude(LAHIRI_T0)) / 3600;
  return kind === "mean" ? mean : mean + e_tilt(t).dpsi / 3600;
}

/**
 * Mean longitude of the Moon's ascending node (Rahu), tropical, referred to the MEAN equinox of date.
 * Meeus, Astronomical Algorithms (2nd ed.), eq. 47.7.
 */
function meanNode(t: AstroTime) {
  const T = centuries(t);
  return norm(125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + (T * T * T) / 467441 - (T * T * T * T) / 60616000);
}

/** Apparent tropical ecliptic longitude (true equinox of date), degrees. */
function tropicalLongitude(body: Body, t: AstroTime) {
  return Ecliptic(GeoVector(body, t, true)).elon;
}

/** Sidereal (Lahiri) longitudes of the nine grahas, degrees 0–360. */
export function siderealLongitudes(date: Date): Record<PlanetKey, number> {
  const t = MakeTime(date);
  const ayanTrue = lahiriAyanamsa(date, "true");
  const ayanMean = lahiriAyanamsa(date, "mean");
  const out = {} as Record<PlanetKey, number>;
  for (const key of PLANET_KEYS) {
    const body = BODIES[key];
    if (body) out[key] = norm(tropicalLongitude(body, t) - ayanTrue);
  }
  // The mean node is referred to the mean equinox, so it takes the mean ayanamsa (nutation cancels).
  out.rahu = norm(meanNode(t) - ayanMean);
  out.ketu = norm(out.rahu + 180);
  return out;
}

/**
 * Sidereal ascendant (lagna) longitude, degrees.
 * RAMC θ = local apparent sidereal time; ε = true obliquity; φ = geographic latitude.
 * λ = atan2(−cos θ, sin ε·tan φ + cos ε·sin θ) + 180°  (tropical, true equinox of date).
 */
export function siderealAscendant(date: Date, lat: number, lon: number) {
  const t = MakeTime(date);
  const theta = norm(SiderealTime(t) * 15 + lon) * RAD;
  const eps = e_tilt(t).tobl * RAD;
  const phi = lat * RAD;
  const asc = Math.atan2(-Math.cos(theta), Math.sin(eps) * Math.tan(phi) + Math.cos(eps) * Math.sin(theta)) / RAD + 180;
  return norm(asc - lahiriAyanamsa(date, "true"));
}

/** Tropical (Western) Sun longitude, for the "Western sun sign". */
export function tropicalSun(date: Date) {
  return tropicalLongitude(Body.Sun, MakeTime(date));
}

/* ---------- Nakshatra helpers ---------- */

const NAK = 360 / 27; // 13°20′
const PADA = NAK / 4; // 3°20′

// Same mapping as src/lib/biodata.ts (GAN_OF / NADI_OF), which is not exported.
// Per nakshatra (Ashwini … Revati): gan 0 Dev · 1 Manushya · 2 Rakshas; nadi 0 Adya · 1 Madhya · 2 Antya.
export const GAN_OF = [0, 1, 2, 1, 0, 1, 0, 0, 2, 2, 1, 1, 0, 2, 0, 2, 0, 2, 2, 1, 1, 0, 2, 2, 1, 1, 0];
export const NADI_OF = [0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2];

export const rashiOf = (lon: number) => Math.floor(norm(lon) / 30); // 0 = Mesh
export const nakshatraOf = (lon: number) => Math.floor(norm(lon) / NAK); // 0 = Ashwini
export const charanOf = (lon: number) => Math.floor((norm(lon) % NAK) / PADA) + 1; // 1–4

/* ---------- Birth input → chart ---------- */

export type BirthInput = {
  year: number;
  month: number; // 1–12
  day: number;
  hour: number; // 0–23, local clock time
  minute: number;
  /** Local clock offset from UTC in minutes (IST = 330). */
  utcOffset: number;
  lat: number;
  lon: number; // east positive
  timeKnown: boolean;
};

export function birthInstant(b: Pick<BirthInput, "year" | "month" | "day" | "hour" | "minute" | "utcOffset">) {
  return new Date(Date.UTC(b.year, b.month - 1, b.day, b.hour, b.minute) - b.utcOffset * 60000);
}

export type PlanetPlace = { key: PlanetKey; lon: number; rashi: number; nakshatra: number; charan: number; house: number | null };

export type Chart = {
  instant: Date;
  ayanamsa: number;
  moon: { lon: number; rashi: number; nakshatra: number; charan: number; gan: number; nadi: number };
  sunRashi: number;
  westernSign: number;
  lagna: { lon: number; rashi: number } | null;
  planets: PlanetPlace[];
};

export function computeChart(b: BirthInput): Chart {
  const instant = birthInstant(b.timeKnown ? b : { ...b, hour: 12, minute: 0 });
  const lons = siderealLongitudes(instant);
  const lagnaLon = b.timeKnown ? siderealAscendant(instant, b.lat, b.lon) : null;
  const lagnaRashi = lagnaLon === null ? null : rashiOf(lagnaLon);
  const moonNak = nakshatraOf(lons.moon);
  return {
    instant,
    ayanamsa: lahiriAyanamsa(instant),
    moon: { lon: lons.moon, rashi: rashiOf(lons.moon), nakshatra: moonNak, charan: charanOf(lons.moon), gan: GAN_OF[moonNak], nadi: NADI_OF[moonNak] },
    sunRashi: rashiOf(lons.sun),
    westernSign: rashiOf(tropicalSun(instant)),
    lagna: lagnaLon === null || lagnaRashi === null ? null : { lon: lagnaLon, rashi: lagnaRashi },
    planets: PLANET_KEYS.map((key) => {
      const lon = lons[key];
      return {
        key,
        lon,
        rashi: rashiOf(lon),
        nakshatra: nakshatraOf(lon),
        charan: charanOf(lon),
        house: lagnaRashi === null ? null : ((rashiOf(lon) - lagnaRashi + 12) % 12) + 1,
      };
    }),
  };
}

/** Planet abbreviations per house (index 0 = house 1), in PLANET_KEYS order. */
export function housesFor(chart: Chart, abbr: string[]): string[] {
  const houses: string[][] = Array.from({ length: 12 }, () => []);
  chart.planets.forEach((p, i) => {
    if (p.house) houses[p.house - 1].push(abbr[i]);
  });
  return houses.map((h) => h.join(" "));
}

/**
 * Moments in [from, to) when the Moon's nakshatra (or rashi) changes, found by a 1-hour scan and
 * bisection to about 5 seconds. The Moon never crosses two nakshatras within an hour.
 */
export function moonChanges(from: Date, to: Date, unit: "nakshatra" | "rashi" = "nakshatra") {
  const idx = (d: Date) => {
    const lon = siderealLongitudes(d).moon;
    return unit === "nakshatra" ? nakshatraOf(lon) : rashiOf(lon);
  };
  const out: { at: Date; from: number; to: number }[] = [];
  const step = 3600_000;
  let a = from.getTime();
  let ia = idx(from);
  while (a < to.getTime()) {
    const b = Math.min(a + step, to.getTime());
    const ib = idx(new Date(b));
    if (ib !== ia) {
      let lo = a;
      let hi = b;
      while (hi - lo > 5000) {
        const mid = (lo + hi) / 2;
        if (idx(new Date(mid)) === ia) lo = mid;
        else hi = mid;
      }
      out.push({ at: new Date(hi), from: ia, to: ib });
    }
    a = b;
    ia = ib;
  }
  return out;
}

/** 83.5 → "23° 30′" within the sign. */
export function degInSign(lon: number) {
  const within = norm(lon) % 30;
  let d = Math.floor(within);
  let m = Math.round((within - d) * 60);
  if (m === 60) {
    d += 1;
    m = 0;
  }
  return `${d}° ${String(m).padStart(2, "0")}′`;
}

export function formatDms(deg: number) {
  const s = Math.round(deg * 3600);
  return `${Math.floor(s / 3600)}° ${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}′ ${String(s % 60).padStart(2, "0")}″`;
}

/* ---------- Writing into the saved biodata draft ---------- */

export type DraftKey = "rashi" | "nakshatra" | "charan" | "gan" | "nadi" | "dob" | "birthTime" | "birthPlace";
/** Birth details the user typed elsewhere in the editor are never replaced, only filled when blank. */
const FILL_ONLY: DraftKey[] = ["dob", "birthTime", "birthPlace"];

export type MergeReport = { updated: string[]; kept: string[]; missing: string[] };

const rowKey = (id: string) => id.split("-").slice(1).join("-");

function kundaliHasData(k: Kundali | undefined) {
  if (!k) return false;
  return k.mode === "image" ? !!k.image : k.lagna > 0 || k.houses.some((h) => h.trim());
}

/**
 * Merges computed values into a biodata (mutates and returns it). Rows are matched by id
 * ("horoscope-rashi" → "rashi"). Non-empty rows and an existing kundali are kept unless `overwrite`.
 */
export function mergeIntoBiodata(
  b: Biodata,
  values: Partial<Record<DraftKey, string>>,
  kundali: Kundali | null,
  overwrite: boolean,
): MergeReport {
  const report: MergeReport = { updated: [], kept: [], missing: [] };
  const rows = b.sections.flatMap((s) => s.rows);
  for (const [key, value] of Object.entries(values) as [DraftKey, string | undefined][]) {
    if (!value) continue;
    const matches = rows.filter((r) => rowKey(r.id) === key);
    if (!matches.length) {
      if (!FILL_ONLY.includes(key)) report.missing.push(key);
      continue;
    }
    for (const row of matches) {
      const current = row.value.trim();
      if (current === value) continue;
      if (!current || (overwrite && !FILL_ONLY.includes(key))) {
        row.value = value;
        if (!report.updated.includes(key)) report.updated.push(key);
      } else if (!report.kept.includes(key)) report.kept.push(key);
    }
  }
  if (kundali) {
    if (!kundaliHasData(b.kundali) || overwrite) {
      b.kundali = kundali;
      report.updated.push("kundali");
    } else if (b.kundali && JSON.stringify(b.kundali.houses) === JSON.stringify(kundali.houses) && b.kundali.lagna === kundali.lagna) {
      b.kundali.show = true;
    } else report.kept.push("kundali");
  }
  return report;
}
