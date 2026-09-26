/**
 * Vivah (marriage) muhurat dates, Nov 2026 – Dec 2027, compiled from published panchangs.
 *
 * Research date: 2026-09-26. Every date below was checked against the sources in SOURCES.
 *
 * NORTH (all-India / Hindi sources)
 *   A date is "confirmed" only when Drik Panchang lists it AND at least one independently
 *   computed or independently published list agrees (Prokerala, Birthastro, ShubhPanchang,
 *   Aaj Tak, IND24). GaneshaSpeaks, Zee 24 Taas and News18 Marathi publish lists identical to
 *   Drik's, so they are recorded as agreeing but are not counted as independent confirmation.
 *   Nakshatra, tithi and the muhurat windows are Drik Panchang's (New Delhi). Each nakshatra was
 *   re-checked against an ephemeris (Lahiri ayanamsa); all matched.
 *   Dates listed by only one computation (or only by Drik and its mirror) are in NORTH_SOME.
 *   Dates inside Chaturmas / Kharmas are left out of NORTH_SOME even when one site lists them.
 *
 * MAHARASHTRA (Marathi panchang sources)
 *   As of the research date we found only ONE Marathi published list covering Nov–Dec 2026
 *   (Pudhari, 9 Dec 2025) and none for 2027. No date reaches the two-source rule, so every month
 *   is shown as "not yet confirmed" and the single list is shown separately, with its own caveat.
 *   Update MAHARASHTRA_CONFIRMED when Date / Kalnirnay / Mahalaxmi-based lists are published
 *   (usually around Diwali – Tulsi Vivah).
 */

export type DatasetId = "north" | "maharashtra";

export type SourceId =
  | "drik"
  | "prokerala"
  | "birthastro"
  | "shubhpanchang"
  | "aajtak"
  | "ind24"
  | "ganeshaspeaks"
  | "zee24taas"
  | "news18marathi"
  | "pudhari"
  | "etvbharat"
  | "drikShukra"
  | "amarujalaRule"
  | "amarujalaGochar"
  | "holika";

/** [start "HH:MM" 24h, end "HH:MM" 24h, start is on the next civil date (1/0), end is on the next civil date (1/0)] */
export type MuhuratWindow = [string, string, 0 | 1, 0 | 1];

export type MuhuratDate = {
  /** ISO date of the Hindu day (sunrise to next sunrise), as panchangs list it. */
  date: string;
  weekday: "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
  nakshatra: string[];
  tithi: string[];
  /** Drik Panchang windows for New Delhi; other cities differ by minutes to hours. */
  windows: MuhuratWindow[];
  sources: SourceId[];
};

export type SomeDate = { date: string; weekday: MuhuratDate["weekday"]; sources: SourceId[] };

export const RANGE = { from: "2026-11", to: "2027-12" } as const;

export const NORTH_CONFIRMED: MuhuratDate[] = [
  { date: "2026-11-21", weekday: "Sat", nakshatra: ["Revati"], tithi: ["Dwadashi"], windows: [["06:48", "00:08", 0, 1]], sources: ["drik", "birthastro", "shubhpanchang", "aajtak", "ind24"] },
  { date: "2026-11-24", weekday: "Tue", nakshatra: ["Rohini"], tithi: ["Pratipada"], windows: [["23:25", "06:52", 0, 1]], sources: ["drik", "birthastro", "shubhpanchang", "aajtak", "ind24"] },
  { date: "2026-11-25", weekday: "Wed", nakshatra: ["Rohini", "Mrigashira"], tithi: ["Pratipada", "Dwitiya"], windows: [["06:52", "06:52", 0, 1]], sources: ["drik", "prokerala", "birthastro", "shubhpanchang", "aajtak", "ind24"] },
  { date: "2026-11-26", weekday: "Thu", nakshatra: ["Mrigashira"], tithi: ["Dwitiya", "Tritiya"], windows: [["06:52", "17:47", 0, 0]], sources: ["drik", "prokerala", "birthastro", "shubhpanchang", "aajtak", "ind24"] },
  { date: "2026-12-02", weekday: "Wed", nakshatra: ["Uttara Phalguni"], tithi: ["Navami", "Dashami"], windows: [["10:32", "06:58", 0, 1]], sources: ["drik", "prokerala", "birthastro", "aajtak", "ind24"] },
  { date: "2026-12-03", weekday: "Thu", nakshatra: ["Uttara Phalguni", "Hasta"], tithi: ["Dashami", "Ekadashi"], windows: [["06:58", "10:53", 0, 0], ["23:03", "06:59", 0, 1]], sources: ["drik", "prokerala", "birthastro", "shubhpanchang", "aajtak", "ind24"] },
  { date: "2026-12-04", weekday: "Fri", nakshatra: ["Hasta"], tithi: ["Ekadashi"], windows: [["06:59", "10:22", 0, 0]], sources: ["drik", "prokerala", "shubhpanchang", "aajtak"] },
  { date: "2026-12-05", weekday: "Sat", nakshatra: ["Swati"], tithi: ["Dwadashi", "Trayodashi"], windows: [["11:48", "07:00", 0, 1]], sources: ["drik", "birthastro", "shubhpanchang"] },
  { date: "2026-12-06", weekday: "Sun", nakshatra: ["Swati"], tithi: ["Trayodashi"], windows: [["07:00", "07:42", 0, 0]], sources: ["drik", "shubhpanchang", "aajtak"] },
  { date: "2026-12-11", weekday: "Fri", nakshatra: ["Uttara Ashadha"], tithi: ["Tritiya"], windows: [["03:04", "07:04", 1, 1]], sources: ["drik", "prokerala", "shubhpanchang", "aajtak", "ind24"] },
  { date: "2026-12-12", weekday: "Sat", nakshatra: ["Uttara Ashadha"], tithi: ["Tritiya", "Chaturthi"], windows: [["07:04", "03:27", 0, 1]], sources: ["drik", "birthastro", "shubhpanchang", "aajtak", "ind24"] },
  { date: "2027-01-15", weekday: "Fri", nakshatra: ["Revati"], tithi: ["Saptami"], windows: [["07:15", "14:13", 0, 0]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-01-18", weekday: "Mon", nakshatra: ["Rohini", "Krittika"], tithi: ["Ekadashi"], windows: [["21:05", "21:12", 0, 0]], sources: ["drik", "prokerala"] },
  { date: "2027-01-19", weekday: "Tue", nakshatra: ["Rohini", "Mrigashira"], tithi: ["Dwadashi", "Trayodashi"], windows: [["07:49", "07:14", 0, 1]], sources: ["drik", "birthastro"] },
  { date: "2027-01-24", weekday: "Sun", nakshatra: ["Magha"], tithi: ["Tritiya"], windows: [["10:20", "21:29", 0, 0]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-01-26", weekday: "Tue", nakshatra: ["Uttara Phalguni", "Hasta"], tithi: ["Panchami", "Shashthi"], windows: [["20:18", "07:12", 0, 1]], sources: ["drik", "birthastro"] },
  { date: "2027-01-27", weekday: "Wed", nakshatra: ["Hasta"], tithi: ["Shashthi"], windows: [["07:12", "23:56", 0, 0]], sources: ["drik", "birthastro"] },
  { date: "2027-01-31", weekday: "Sun", nakshatra: ["Anuradha"], tithi: ["Dashami"], windows: [["07:10", "19:34", 0, 0]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-02-02", weekday: "Tue", nakshatra: ["Mula"], tithi: ["Dwadashi"], windows: [["17:47", "07:08", 0, 1]], sources: ["drik", "birthastro"] },
  { date: "2027-02-03", weekday: "Wed", nakshatra: ["Mula"], tithi: ["Dwadashi"], windows: [["07:08", "12:26", 0, 0]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-02-10", weekday: "Wed", nakshatra: ["Uttara Bhadrapada", "Revati"], tithi: ["Chaturthi", "Panchami"], windows: [["07:04", "14:45", 0, 0], ["03:04", "07:03", 1, 1]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-02-11", weekday: "Thu", nakshatra: ["Revati"], tithi: ["Panchami"], windows: [["07:03", "23:30", 0, 0]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-02-22", weekday: "Mon", nakshatra: ["Uttara Phalguni"], tithi: ["Dwitiya", "Tritiya"], windows: [["11:54", "06:53", 0, 1]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-02-25", weekday: "Thu", nakshatra: ["Swati"], tithi: ["Panchami", "Shashthi"], windows: [["09:32", "06:50", 0, 1]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-02-27", weekday: "Sat", nakshatra: ["Anuradha"], tithi: ["Ashtami"], windows: [["22:08", "06:48", 0, 1]], sources: ["drik", "birthastro"] },
  { date: "2027-02-28", weekday: "Sun", nakshatra: ["Anuradha"], tithi: ["Ashtami"], windows: [["06:48", "13:47", 0, 0]], sources: ["drik", "birthastro"] },
  { date: "2027-03-01", weekday: "Mon", nakshatra: ["Mula"], tithi: ["Navami", "Dashami"], windows: [["23:12", "06:46", 0, 1]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-03-02", weekday: "Tue", nakshatra: ["Mula"], tithi: ["Dashami"], windows: [["06:46", "15:24", 0, 0]], sources: ["drik", "birthastro"] },
  { date: "2027-03-03", weekday: "Wed", nakshatra: ["Uttara Ashadha"], tithi: ["Ekadashi"], windows: [["01:06", "06:44", 1, 1]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-03-04", weekday: "Thu", nakshatra: ["Uttara Ashadha"], tithi: ["Dwadashi"], windows: [["06:44", "01:35", 0, 1]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-03-09", weekday: "Tue", nakshatra: ["Uttara Bhadrapada"], tithi: ["Pratipada", "Dwitiya"], windows: [["09:58", "06:37", 0, 1]], sources: ["drik", "birthastro"] },
  { date: "2027-03-10", weekday: "Wed", nakshatra: ["Uttara Bhadrapada", "Revati"], tithi: ["Dwitiya", "Tritiya"], windows: [["06:37", "05:13", 0, 1]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-03-14", weekday: "Sun", nakshatra: ["Rohini"], tithi: ["Saptami"], windows: [["17:10", "06:31", 0, 1]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-04-18", weekday: "Sun", nakshatra: ["Uttara Phalguni"], tithi: ["Dwadashi", "Trayodashi"], windows: [["06:05", "21:58", 0, 0]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-04-19", weekday: "Mon", nakshatra: ["Hasta"], tithi: ["Chaturdashi"], windows: [["19:44", "04:40", 0, 1]], sources: ["drik", "birthastro"] },
  { date: "2027-04-21", weekday: "Wed", nakshatra: ["Swati"], tithi: ["Pratipada", "Dwitiya"], windows: [["16:10", "04:43", 0, 1]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-04-23", weekday: "Fri", nakshatra: ["Anuradha"], tithi: ["Tritiya", "Chaturthi"], windows: [["14:13", "15:53", 0, 0], ["04:20", "05:47", 1, 1]], sources: ["drik", "prokerala"] },
  { date: "2027-04-25", weekday: "Sun", nakshatra: ["Mula"], tithi: ["Panchami"], windows: [["15:35", "05:45", 0, 1]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-04-26", weekday: "Mon", nakshatra: ["Mula"], tithi: ["Panchami", "Shashthi"], windows: [["05:45", "11:29", 0, 0]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-04-27", weekday: "Tue", nakshatra: ["Uttara Ashadha"], tithi: ["Saptami"], windows: [["23:13", "05:43", 0, 1]], sources: ["drik", "birthastro"] },
  { date: "2027-04-28", weekday: "Wed", nakshatra: ["Uttara Ashadha"], tithi: ["Saptami", "Ashtami"], windows: [["05:43", "17:30", 0, 0]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-05-04", weekday: "Tue", nakshatra: ["Revati"], tithi: ["Trayodashi"], windows: [["16:14", "19:30", 0, 0]], sources: ["drik", "birthastro"] },
  { date: "2027-05-07", weekday: "Fri", nakshatra: ["Rohini"], tithi: ["Dwitiya"], windows: [["23:42", "05:35", 0, 1]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-05-09", weekday: "Sun", nakshatra: ["Mrigashira"], tithi: ["Tritiya", "Chaturthi"], windows: [["05:35", "19:42", 0, 0]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-05-13", weekday: "Thu", nakshatra: ["Magha"], tithi: ["Ashtami", "Navami"], windows: [["19:26", "05:31", 0, 1]], sources: ["drik", "birthastro"] },
  { date: "2027-05-15", weekday: "Sat", nakshatra: ["Uttara Phalguni"], tithi: ["Dashami", "Ekadashi"], windows: [["12:00", "05:30", 0, 1]], sources: ["drik", "birthastro"] },
  { date: "2027-05-16", weekday: "Sun", nakshatra: ["Hasta"], tithi: ["Dwadashi"], windows: [["02:43", "05:29", 1, 1]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-05-17", weekday: "Mon", nakshatra: ["Hasta"], tithi: ["Dwadashi"], windows: [["05:29", "11:29", 0, 0]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-05-18", weekday: "Tue", nakshatra: ["Swati"], tithi: ["Chaturdashi"], windows: [["23:55", "05:28", 0, 1]], sources: ["drik", "birthastro"] },
  { date: "2027-05-19", weekday: "Wed", nakshatra: ["Swati"], tithi: ["Chaturdashi"], windows: [["05:28", "12:19", 0, 0]], sources: ["drik", "birthastro"] },
  { date: "2027-05-20", weekday: "Thu", nakshatra: ["Anuradha"], tithi: ["Pratipada"], windows: [["22:26", "05:27", 0, 1]], sources: ["drik", "birthastro"] },
  { date: "2027-05-21", weekday: "Fri", nakshatra: ["Anuradha"], tithi: ["Pratipada"], windows: [["05:27", "14:51", 0, 0]], sources: ["drik", "birthastro"] },
  { date: "2027-05-22", weekday: "Sat", nakshatra: ["Mula"], tithi: ["Tritiya"], windows: [["23:27", "05:27", 0, 1]], sources: ["drik", "birthastro"] },
  { date: "2027-05-23", weekday: "Sun", nakshatra: ["Mula"], tithi: ["Tritiya"], windows: [["05:27", "07:41", 0, 0]], sources: ["drik", "prokerala"] },
  { date: "2027-05-24", weekday: "Mon", nakshatra: ["Uttara Ashadha"], tithi: ["Panchami"], windows: [["22:07", "05:26", 0, 1]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-05-25", weekday: "Tue", nakshatra: ["Uttara Ashadha"], tithi: ["Panchami"], windows: [["05:26", "01:12", 0, 1]], sources: ["drik", "birthastro"] },
  { date: "2027-05-30", weekday: "Sun", nakshatra: ["Uttara Bhadrapada"], tithi: ["Dashami"], windows: [["11:32", "21:54", 0, 0]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-05-31", weekday: "Mon", nakshatra: ["Uttara Bhadrapada", "Revati"], tithi: ["Ekadashi"], windows: [["10:02", "05:24", 0, 1]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-06-09", weekday: "Wed", nakshatra: ["Magha"], tithi: ["Shashthi"], windows: [["01:26", "05:23", 1, 1]], sources: ["drik", "birthastro"] },
  { date: "2027-06-10", weekday: "Thu", nakshatra: ["Magha"], tithi: ["Shashthi", "Saptami"], windows: [["05:23", "15:24", 0, 0]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-06-11", weekday: "Fri", nakshatra: ["Uttara Phalguni"], tithi: ["Ashtami", "Navami"], windows: [["17:27", "05:23", 0, 1]], sources: ["drik", "birthastro"] },
  { date: "2027-06-12", weekday: "Sat", nakshatra: ["Uttara Phalguni"], tithi: ["Navami"], windows: [["05:23", "10:48", 0, 0]], sources: ["drik", "birthastro"] },
  { date: "2027-06-13", weekday: "Sun", nakshatra: ["Hasta"], tithi: ["Dashami"], windows: [["09:05", "16:59", 0, 0]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-06-15", weekday: "Tue", nakshatra: ["Swati"], tithi: ["Dwadashi"], windows: [["06:46", "18:23", 0, 0]], sources: ["drik", "birthastro"] },
  { date: "2027-06-16", weekday: "Wed", nakshatra: ["Anuradha"], tithi: ["Trayodashi", "Chaturdashi"], windows: [["19:44", "05:23", 0, 1]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-06-17", weekday: "Thu", nakshatra: ["Anuradha"], tithi: ["Chaturdashi"], windows: [["05:23", "21:30", 0, 0]], sources: ["drik", "birthastro"] },
  { date: "2027-06-19", weekday: "Sat", nakshatra: ["Mula"], tithi: ["Pratipada"], windows: [["06:18", "02:12", 0, 1]], sources: ["drik", "birthastro"] },
  { date: "2027-06-20", weekday: "Sun", nakshatra: ["Uttara Ashadha", "Purva Ashadha"], tithi: ["Dwitiya"], windows: [["05:03", "05:24", 1, 1]], sources: ["drik", "prokerala"] },
  { date: "2027-06-21", weekday: "Mon", nakshatra: ["Uttara Ashadha"], tithi: ["Dwitiya", "Tritiya"], windows: [["05:24", "23:50", 0, 0]], sources: ["drik", "prokerala"] },
  { date: "2027-06-26", weekday: "Sat", nakshatra: ["Uttara Bhadrapada"], tithi: ["Saptami", "Ashtami"], windows: [["19:22", "05:25", 0, 1]], sources: ["drik", "birthastro"] },
  { date: "2027-06-27", weekday: "Sun", nakshatra: ["Uttara Bhadrapada", "Revati"], tithi: ["Ashtami", "Navami"], windows: [["05:25", "05:26", 0, 1]], sources: ["drik", "birthastro"] },
  { date: "2027-06-28", weekday: "Mon", nakshatra: ["Revati"], tithi: ["Navami"], windows: [["05:26", "11:45", 0, 0]], sources: ["drik", "birthastro"] },
  { date: "2027-07-07", weekday: "Wed", nakshatra: ["Magha"], tithi: ["Panchami"], windows: [["18:43", "23:58", 0, 0]], sources: ["drik", "prokerala"] },
  { date: "2027-07-09", weekday: "Fri", nakshatra: ["Uttara Phalguni"], tithi: ["Shashthi", "Saptami"], windows: [["05:30", "18:16", 0, 0]], sources: ["drik", "prokerala"] },
  { date: "2027-07-12", weekday: "Mon", nakshatra: ["Swati"], tithi: ["Navami", "Dashami"], windows: [["05:31", "23:56", 0, 0]], sources: ["drik", "prokerala"] },
  { date: "2027-11-10", weekday: "Wed", nakshatra: ["Uttara Bhadrapada"], tithi: ["Dwadashi"], windows: [["09:11", "23:40", 0, 0]], sources: ["drik", "birthastro"] },
  { date: "2027-11-11", weekday: "Thu", nakshatra: ["Revati"], tithi: ["Trayodashi"], windows: [["22:57", "01:42", 0, 1]], sources: ["drik", "birthastro"] },
  { date: "2027-11-15", weekday: "Mon", nakshatra: ["Rohini"], tithi: ["Dwitiya"], windows: [["15:21", "06:00", 0, 1]], sources: ["drik", "birthastro"] },
  { date: "2027-11-16", weekday: "Tue", nakshatra: ["Mrigashira"], tithi: ["Tritiya", "Chaturthi"], windows: [["06:44", "16:42", 0, 0], ["03:41", "04:42", 1, 1]], sources: ["drik", "birthastro"] },
  { date: "2027-11-23", weekday: "Tue", nakshatra: ["Uttara Phalguni", "Hasta"], tithi: ["Ekadashi"], windows: [["14:08", "06:51", 0, 1]], sources: ["drik", "birthastro"] },
  { date: "2027-11-24", weekday: "Wed", nakshatra: ["Hasta"], tithi: ["Ekadashi", "Dwadashi"], windows: [["06:51", "18:53", 0, 0]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-11-25", weekday: "Thu", nakshatra: ["Swati"], tithi: ["Trayodashi"], windows: [["18:17", "06:52", 0, 1]], sources: ["drik", "birthastro"] },
  { date: "2027-11-29", weekday: "Mon", nakshatra: ["Mula"], tithi: ["Dwitiya"], windows: [["02:12", "02:30", 1, 1]], sources: ["drik", "prokerala"] },
  { date: "2027-12-02", weekday: "Thu", nakshatra: ["Uttara Ashadha"], tithi: ["Panchami"], windows: [["13:43", "02:29", 0, 1]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-12-07", weekday: "Tue", nakshatra: ["Uttara Bhadrapada"], tithi: ["Navami", "Dashami"], windows: [["14:14", "06:57", 0, 1]], sources: ["drik", "birthastro"] },
  { date: "2027-12-08", weekday: "Wed", nakshatra: ["Revati"], tithi: ["Ekadashi"], windows: [["06:35", "07:02", 1, 1]], sources: ["drik", "prokerala"] },
  { date: "2027-12-09", weekday: "Thu", nakshatra: ["Revati"], tithi: ["Ekadashi"], windows: [["07:02", "11:08", 0, 0]], sources: ["drik", "prokerala", "birthastro"] },
  { date: "2027-12-12", weekday: "Sun", nakshatra: ["Rohini"], tithi: ["Chaturdashi"], windows: [["16:41", "23:54", 0, 0]], sources: ["drik", "birthastro"] },
  { date: "2027-12-13", weekday: "Mon", nakshatra: ["Rohini", "Mrigashira"], tithi: ["Purnima", "Pratipada"], windows: [["10:49", "07:05", 0, 1]], sources: ["drik", "birthastro"] },
  { date: "2027-12-14", weekday: "Tue", nakshatra: ["Mrigashira"], tithi: ["Pratipada"], windows: [["07:05", "13:24", 0, 0]], sources: ["drik", "birthastro"] },
];

/** Listed by only one computation (or by Drik and its mirror only). Not confirmed. */
export const NORTH_SOME: SomeDate[] = [
  { date: "2026-11-27", weekday: "Fri", sources: ["aajtak"] },
  { date: "2026-11-30", weekday: "Mon", sources: ["aajtak"] },
  { date: "2026-12-01", weekday: "Tue", sources: ["aajtak"] },
  { date: "2026-12-09", weekday: "Wed", sources: ["aajtak"] },
  { date: "2026-12-10", weekday: "Thu", sources: ["aajtak"] },
  { date: "2026-12-13", weekday: "Sun", sources: ["aajtak"] },
  { date: "2027-01-20", weekday: "Wed", sources: ["drik", "ganeshaspeaks"] },
  { date: "2027-01-30", weekday: "Sat", sources: ["drik", "ganeshaspeaks"] },
  { date: "2027-02-09", weekday: "Tue", sources: ["drik", "ganeshaspeaks"] },
  { date: "2027-02-14", weekday: "Sun", sources: ["drik", "ganeshaspeaks"] },
  { date: "2027-02-15", weekday: "Mon", sources: ["drik", "ganeshaspeaks"] },
  { date: "2027-02-16", weekday: "Tue", sources: ["birthastro"] },
  { date: "2027-02-21", weekday: "Sun", sources: ["drik", "ganeshaspeaks"] },
  { date: "2027-02-26", weekday: "Fri", sources: ["drik", "ganeshaspeaks"] },
  { date: "2027-03-11", weekday: "Thu", sources: ["prokerala"] },
  { date: "2027-04-24", weekday: "Sat", sources: ["drik", "ganeshaspeaks"] },
  { date: "2027-05-03", weekday: "Mon", sources: ["prokerala", "birthastro"] },
  { date: "2027-05-14", weekday: "Fri", sources: ["drik", "ganeshaspeaks"] },
  { date: "2027-06-01", weekday: "Tue", sources: ["drik", "ganeshaspeaks"] },
  { date: "2027-06-05", weekday: "Sat", sources: ["drik", "ganeshaspeaks"] },
  { date: "2027-07-01", weekday: "Thu", sources: ["drik"] },
  { date: "2027-07-08", weekday: "Thu", sources: ["drik", "ganeshaspeaks"] },
  { date: "2027-07-11", weekday: "Sun", sources: ["drik", "ganeshaspeaks"] },
  { date: "2027-11-20", weekday: "Sat", sources: ["drik", "ganeshaspeaks"] },
  { date: "2027-11-21", weekday: "Sun", sources: ["drik", "ganeshaspeaks"] },
  { date: "2027-11-22", weekday: "Mon", sources: ["prokerala", "birthastro"] },
  { date: "2027-11-26", weekday: "Fri", sources: ["drik", "ganeshaspeaks"] },
];

/** No Marathi-panchang date yet has two agreeing sources. Fill this in when it does. */
export const MAHARASHTRA_CONFIRMED: MuhuratDate[] = [];

/**
 * The one Marathi list found (Pudhari, Hingoli edition, 9 Dec 2025, calendar year 2026).
 * The article itself says its list includes dates falling in Guru ast, Shukra ast and Simhastha Guru.
 * It names no panchang. Its Nov–Dec 2026 dates are shown as "one Marathi list", never as confirmed.
 */
export const MAHARASHTRA_SOME: SomeDate[] = [
  { date: "2026-11-03", weekday: "Tue", sources: ["pudhari"] },
  { date: "2026-11-12", weekday: "Thu", sources: ["pudhari"] },
  { date: "2026-11-15", weekday: "Sun", sources: ["pudhari"] },
  { date: "2026-11-16", weekday: "Mon", sources: ["pudhari"] },
  { date: "2026-11-17", weekday: "Tue", sources: ["pudhari"] },
  { date: "2026-11-25", weekday: "Wed", sources: ["pudhari"] },
  { date: "2026-11-26", weekday: "Thu", sources: ["pudhari"] },
  { date: "2026-12-02", weekday: "Wed", sources: ["pudhari"] },
  { date: "2026-12-03", weekday: "Thu", sources: ["pudhari"] },
  { date: "2026-12-04", weekday: "Fri", sources: ["pudhari"] },
  { date: "2026-12-05", weekday: "Sat", sources: ["pudhari"] },
  { date: "2026-12-10", weekday: "Thu", sources: ["pudhari"] },
  { date: "2026-12-12", weekday: "Sat", sources: ["pudhari"] },
  { date: "2026-12-13", weekday: "Sun", sources: ["pudhari"] },
  { date: "2026-12-14", weekday: "Mon", sources: ["pudhari"] },
  { date: "2026-12-15", weekday: "Tue", sources: ["pudhari"] },
  { date: "2026-12-18", weekday: "Fri", sources: ["pudhari"] },
  { date: "2026-12-27", weekday: "Sun", sources: ["pudhari"] },
  { date: "2026-12-28", weekday: "Mon", sources: ["pudhari"] },
  { date: "2026-12-30", weekday: "Wed", sources: ["pudhari"] },
  { date: "2026-12-31", weekday: "Thu", sources: ["pudhari"] },
];

export type PeriodId =
  | "chaturmas2026"
  | "shukraAst2026"
  | "simhastha1"
  | "kharmas2026"
  | "holashtak2027"
  | "meenKharmas2027"
  | "simhastha2"
  | "chaturmas2027"
  | "shukraAst2027"
  | "kharmas2027";

export type Period = {
  id: PeriodId;
  from: string;
  to: string;
  /** "block" = most panchangs give no wedding dates; "caution" = some pandits avoid, many lists still give dates. */
  kind: "block" | "caution";
  sources: SourceId[];
};

/** Key no-muhurat periods. Dates are as published by the cited sources (a day either way is normal between cities). */
export const PERIODS: Period[] = [
  // Devshayani Ekadashi 25 Jul 2026 → Devuthani / Prabodhini Ekadashi Fri 20 Nov 2026; Tulsi Vivah Sat 21 Nov 2026.
  { id: "chaturmas2026", from: "2026-07-25", to: "2026-11-20", kind: "block", sources: ["drik", "zee24taas"] },
  // Venus combust 12 Oct 2026 18:19 → 29 Oct 2026 06:00 (Drik, New Delhi).
  { id: "shukraAst2026", from: "2026-10-12", to: "2026-10-29", kind: "block", sources: ["drikShukra"] },
  // Jupiter enters Leo 31 Oct 2026, returns (retrograde) to Cancer 25 Jan 2027.
  { id: "simhastha1", from: "2026-10-31", to: "2027-01-24", kind: "caution", sources: ["amarujalaGochar", "amarujalaRule", "etvbharat"] },
  // Sun in Sagittarius (Dhanu sankranti 16 Dec 2026 → Makar Sankranti 14 Jan 2027). Drik marks it "Prohibited Solar month".
  { id: "kharmas2026", from: "2026-12-16", to: "2027-01-14", kind: "block", sources: ["drik"] },
  // Phalguna Shukla Ashtami → Holika Dahan (Sun 21 Mar 2027). Falls inside the Meen Kharmas anyway.
  { id: "holashtak2027", from: "2027-03-15", to: "2027-03-21", kind: "block", sources: ["holika"] },
  // Sun in Pisces (15 Mar → 14 Apr 2027). Drik marks it "Prohibited Solar month".
  { id: "meenKharmas2027", from: "2027-03-15", to: "2027-04-14", kind: "block", sources: ["drik"] },
  // Jupiter back in Leo 26 Jun 2027 until it enters Virgo around 26 Nov 2027 (ephemeris, Lahiri).
  { id: "simhastha2", from: "2027-06-26", to: "2027-11-26", kind: "caution", sources: ["amarujalaGochar", "amarujalaRule"] },
  // Devshayani Ekadashi Wed 14 Jul 2027 → Prabodhini Ekadashi Wed 10 Nov 2027. Ekadashi ends on the morning of
  // 10 Nov; Drik marks Chaturmas until 9 Nov (partly) and gives a muhurat from 09:11 on 10 Nov, so the block ends 9 Nov.
  { id: "chaturmas2027", from: "2027-07-14", to: "2027-11-09", kind: "block", sources: ["drik"] },
  // Venus combust 21 Jul 2027 05:08 → 9 Sep 2027 19:00 (Drik, New Delhi).
  { id: "shukraAst2027", from: "2027-07-21", to: "2027-09-09", kind: "block", sources: ["drikShukra"] },
  // Dhanu sankranti 16 Dec 2027 → Makar Sankranti Jan 2028.
  { id: "kharmas2027", from: "2027-12-16", to: "2028-01-14", kind: "block", sources: ["drik"] },
];

export type Source = {
  id: SourceId;
  name: string;
  urls: string[];
  /** What the source contributes, shown in the source list. */
  note: Record<"en" | "hi" | "mr", string>;
  dataset: DatasetId | "both";
};

export const ACCESSED = "2026-09-26";

export const SOURCES: Source[] = [
  {
    id: "drik",
    name: "Drik Panchang – Hindu Marriage Dates (New Delhi)",
    urls: [
      "https://www.drikpanchang.com/shubh-dates/shubh-marriage-dates-with-muhurat.html?year=2026",
      "https://www.drikpanchang.com/shubh-dates/shubh-marriage-dates-with-muhurat.html?year=2027",
    ],
    note: {
      en: "Day-by-day list with muhurat windows, nakshatra and tithi; also marks Chaturmas and prohibited solar months.",
      hi: "दिन-प्रतिदिन सूची: मुहूर्त समय, नक्षत्र और तिथि; चातुर्मास और वर्जित सौर मास भी दिखाता है।",
      mr: "दिवसनिहाय यादी: मुहूर्त वेळ, नक्षत्र आणि तिथी; चातुर्मास आणि वर्ज्य सौर महिनेही दाखवते.",
    },
    dataset: "north",
  },
  {
    id: "prokerala",
    name: "Prokerala – Marriage Muhurat 2026 / 2027",
    urls: ["https://www.prokerala.com/astrology/muhurat/marriage-muhurat-2026.php", "https://www.prokerala.com/astrology/muhurat/marriage-muhurat-2027.php"],
    note: {
      en: "Independent calculation; a stricter, shorter list.",
      hi: "स्वतंत्र गणना; ज़्यादा सख़्त, छोटी सूची।",
      mr: "स्वतंत्र गणना; अधिक काटेकोर, छोटी यादी.",
    },
    dataset: "north",
  },
  {
    id: "birthastro",
    name: "Birthastro – Hindu Marriage Dates 2026 / 2027",
    urls: ["https://www.birthastro.com/hindi/shubh-dates/auspicious-hindu-marriage-dates-2026", "https://www.birthastro.com/hindi/shubh-dates/auspicious-hindu-marriage-dates-2027"],
    note: {
      en: "Independent calculation with nakshatra and tithi.",
      hi: "नक्षत्र और तिथि सहित स्वतंत्र गणना।",
      mr: "नक्षत्र आणि तिथीसह स्वतंत्र गणना.",
    },
    dataset: "north",
  },
  {
    id: "shubhpanchang",
    name: "Shubh Panchang – Vivah Muhurat",
    urls: ["https://shubhpanchang.com/muhurat/marriage-muhurat"],
    note: {
      en: "Independent calculation for a western-India city (Nov–Dec 2026 checked).",
      hi: "पश्चिम भारत के एक शहर के लिए स्वतंत्र गणना (नवंबर–दिसंबर 2026 जाँचा)।",
      mr: "पश्चिम भारतातील एका शहरासाठी स्वतंत्र गणना (नोव्हेंबर–डिसेंबर 2026 तपासले).",
    },
    dataset: "north",
  },
  {
    id: "aajtak",
    name: "Aaj Tak – Shaadi Vivah Shubh Muhurat 2026 (18 Jan 2026)",
    urls: ["https://www.aajtak.in/religion/news/story/shaddi-vivah-shubh-muhurat-2026-dates-before-devshayani-ekadashi-devuthani-ekadashi-marriate-auspicious-dates-february-to-december-tvisg-dskc-2441343-2026-01-18"],
    note: {
      en: "Published Nov–Dec 2026 list; longer than others (names no panchang).",
      hi: "नवंबर–दिसंबर 2026 की प्रकाशित सूची; बाकियों से लंबी (किसी पंचांग का नाम नहीं)।",
      mr: "नोव्हेंबर–डिसेंबर 2026 ची प्रकाशित यादी; इतरांपेक्षा मोठी (पंचांगाचे नाव नाही).",
    },
    dataset: "north",
  },
  {
    id: "ind24",
    name: "IND24 – November-December 2026 Shadi Muhurat",
    urls: ["https://www.ind24.tv/spiritual/november-december-2026-shadi-muhurat-vivah-shubh-dates"],
    note: {
      en: "Published Nov–Dec 2026 list.",
      hi: "नवंबर–दिसंबर 2026 की प्रकाशित सूची।",
      mr: "नोव्हेंबर–डिसेंबर 2026 ची प्रकाशित यादी.",
    },
    dataset: "north",
  },
  {
    id: "ganeshaspeaks",
    name: "GaneshaSpeaks – Marriage Muhurat 2026 / 2027",
    urls: ["https://www.ganeshaspeaks.com/muhurat/2026/marriage-muhurat/", "https://www.ganeshaspeaks.com/muhurat/2027/marriage-muhurat/"],
    note: {
      en: "Same dates as Drik Panchang; not counted as independent.",
      hi: "द्रिक पंचांग जैसी ही तारीखें; स्वतंत्र स्रोत नहीं गिना।",
      mr: "द्रिक पंचांगाप्रमाणेच तारखा; स्वतंत्र स्रोत म्हणून मोजले नाही.",
    },
    dataset: "north",
  },
  {
    id: "zee24taas",
    name: "Zee 24 Taas – Wedding Muhurat 2026 (Dr. Anish Vyas)",
    urls: ["https://zeenews.india.com/marathi/photos/wedding-muhurat-2026-know-about-59-auspicious-marriage-muhurats-and-dates-throughout-the-year/957656"],
    note: {
      en: "Nov–Dec 2026 dates identical to Drik; gives Chaturmas 25 Jul – 20 Nov 2026.",
      hi: "नवंबर–दिसंबर 2026 की तारीखें द्रिक जैसी; चातुर्मास 25 जुलाई – 20 नवंबर 2026 बताता है।",
      mr: "नोव्हेंबर–डिसेंबर 2026 च्या तारखा द्रिकप्रमाणेच; चातुर्मास 25 जुलै – 20 नोव्हेंबर 2026 सांगते.",
    },
    dataset: "north",
  },
  {
    id: "news18marathi",
    name: "News18 Marathi – Marriage Muhurat 2026 (Chirag Daruwalla)",
    urls: ["https://news18marathi.com/photogallery/religion/list-of-shubh-marriage-muhurtas-in-new-year-how-many-muhurats-in-which-month-in-a-year-ws-e-1573182.html"],
    note: {
      en: "Nov–Dec 2026 dates identical to Drik; an all-India list, not a Marathi panchang.",
      hi: "नवंबर–दिसंबर 2026 की तारीखें द्रिक जैसी; अखिल भारतीय सूची, मराठी पंचांग नहीं।",
      mr: "नोव्हेंबर–डिसेंबर 2026 च्या तारखा द्रिकप्रमाणेच; ही अखिल भारतीय यादी आहे, मराठी पंचांग नाही.",
    },
    dataset: "north",
  },
  {
    id: "pudhari",
    name: "Pudhari (Hingoli) – Vivah Muhurat 2026, 9 Dec 2025",
    urls: ["https://pudhari.news/maharashtra/marathwada/hingoli/110-auspicious-wedding-muhurats-in-new-year-for-marriage-seekers-as80"],
    note: {
      en: "Only Marathi list found for Nov–Dec 2026; says it includes Guru-ast, Shukra-ast and Simhastha dates; names no panchang.",
      hi: "नवंबर–दिसंबर 2026 की एकमात्र मराठी सूची जो मिली; इसमें गुरु अस्त, शुक्र अस्त और सिंहस्थ की तारीखें भी हैं; पंचांग का नाम नहीं।",
      mr: "नोव्हेंबर–डिसेंबर 2026 साठी मिळालेली एकमेव मराठी यादी; तिच्यात गुरू अस्त, शुक्र अस्त आणि सिंहस्थातील तारखाही आहेत; पंचांगाचे नाव नाही.",
    },
    dataset: "maharashtra",
  },
  {
    id: "etvbharat",
    name: "ETV Bharat Rajasthan – Dr. Lakhan Sharma (28 Oct 2025)",
    urls: ["https://www.etvbharat.com/hi/state/marriages-will-begin-from-devuthani-with-66-auspicious-times-until-next-year-2026-rajasthan-news-rjs25102803271"],
    note: {
      en: "Disagrees: gives no wedding dates from 15 Jul 2026 until 23 Jan 2027.",
      hi: "असहमत: 15 जुलाई 2026 से 23 जनवरी 2027 तक कोई विवाह मुहूर्त नहीं बताता।",
      mr: "वेगळे मत: 15 जुलै 2026 ते 23 जानेवारी 2027 पर्यंत एकही लग्न मुहूर्त देत नाही.",
    },
    dataset: "north",
  },
  {
    id: "drikShukra",
    name: "Drik Panchang – Shukra Tara Asta 2026 / 2027",
    urls: ["https://www.drikpanchang.com/planet/asta/shukra-asta-date-time.html?year=2026", "https://www.drikpanchang.com/planet/asta/shukra-asta-date-time.html?year=2027"],
    note: {
      en: "Venus combustion dates.",
      hi: "शुक्र अस्त की तारीखें।",
      mr: "शुक्र अस्ताच्या तारखा.",
    },
    dataset: "both",
  },
  {
    id: "amarujalaGochar",
    name: "Amar Ujala – Guru Singh Gochar 31 October 2026",
    urls: ["https://www.amarujala.com/photo-gallery/astrology/predictions/guru-singh-gochar-on-31-october-2026-these-three-zodiac-will-lucky-and-get-extra-shine-2026-09-21"],
    note: {
      en: "Jupiter enters Leo on 31 Oct 2026; back in Cancer from 25 Jan 2027 to 26 Jun 2027.",
      hi: "गुरु 31 अक्टूबर 2026 को सिंह राशि में; 25 जनवरी 2027 से 26 जून 2027 तक फिर कर्क में।",
      mr: "गुरू 31 ऑक्टोबर 2026 रोजी सिंह राशीत; 25 जानेवारी 2027 ते 26 जून 2027 पुन्हा कर्क राशीत.",
    },
    dataset: "both",
  },
  {
    id: "amarujalaRule",
    name: "Amar Ujala – Marriage while Jupiter is in Leo",
    urls: ["https://www.amarujala.com/astrology/horoscope/marriage-in-jupiter-transit-in-leo-sign-hindi-rj"],
    note: {
      en: "Muhurta Chintamani restricts weddings in Simhastha Guru between the Ganga and the Godavari; many regard it as regional.",
      hi: "मुहूर्त चिंतामणि के अनुसार सिंहस्थ गुरु में गंगा-गोदावरी के बीच विवाह वर्जित; कई लोग इसे क्षेत्रीय नियम मानते हैं।",
      mr: "मुहूर्त चिंतामणीनुसार सिंहस्थ गुरूमध्ये गंगा-गोदावरीच्या मध्ये विवाह वर्ज्य; अनेक जण हा प्रादेशिक नियम मानतात.",
    },
    dataset: "both",
  },
  {
    id: "holika",
    name: "Holika Dahan 2027 (Dr. R. P. Sharma)",
    urls: ["https://drrpsharma.com/blog/holika-dahan-2027.html"],
    note: {
      en: "Holika Dahan on Sunday 21 March 2027; Holashtak is the eight days before it.",
      hi: "होलिका दहन रविवार, 21 मार्च 2027; होलाष्टक उससे पहले के आठ दिन।",
      mr: "होलिका दहन रविवार, 21 मार्च 2027; होळाष्टक त्याआधीचे आठ दिवस.",
    },
    dataset: "both",
  },
];
