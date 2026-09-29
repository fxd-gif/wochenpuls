// Datums- und Wochenrechnung, immer in deutscher Zeit (Europe/Berlin).
// Alle Daten sind Texte im Format "JJJJ-MM-TT". Gerechnet wird mit reinen
// Kalendertagen, deshalb gibt es keine Probleme mit der Sommerzeit.

// Wochentag, an dem der Check-in fällig ist: 0 = Sonntag, 1 = Montag, ... 6 = Samstag
export const CHECKIN_TAG = 0;

const berlinFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Berlin",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

// Heutiges Datum (oder das eines Zeitpunkts) in deutscher Zeit
export function berlinDatum(zeitpunkt = new Date()): string {
  return berlinFormat.format(zeitpunkt);
}

const alsTag = (datum: string) => new Date(`${datum}T00:00:00Z`);

export function plusTage(datum: string, tage: number): string {
  const d = alsTag(datum);
  d.setUTCDate(d.getUTCDate() + tage);
  return d.toISOString().slice(0, 10);
}

export function tageZwischen(von: string, bis: string): number {
  return Math.round((alsTag(bis).getTime() - alsTag(von).getTime()) / 86_400_000);
}

// Wie viele Tage liegt ein Datum hinter dem Fälligkeitstag? (0 = am Fälligkeitstag selbst)
function tageNachFaelligkeit(datum: string): number {
  return (alsTag(datum).getUTCDay() - CHECKIN_TAG + 7) % 7;
}

// Der Fälligkeitstag, der zuletzt war (oder heute ist)
export function letzterFaelligkeitstag(datum: string): string {
  return plusTage(datum, -tageNachFaelligkeit(datum));
}

// Für welche Woche zählt ein Check-in? Von 3 Tagen vor bis 3 Tage nach dem
// Fälligkeitstag (bei Sonntag: Donnerstag bis Mittwoch) zählt er für diesen Tag.
export function checkinWoche(datum: string): string {
  const nach = tageNachFaelligkeit(datum);
  return plusTage(datum, nach >= 4 ? 7 - nach : -nach);
}

// Ein neuer Kunde muss frühestens 3 Tage nach dem Anlegen zum ersten Mal einchecken.
function ersterFaelligkeitstag(angelegtAm: string): string {
  const fruehestens = plusTage(angelegtAm, 3);
  return plusTage(fruehestens, (7 - tageNachFaelligkeit(fruehestens)) % 7);
}

// Wie viele Tage ist der nächste Check-in überfällig? 0 = nicht überfällig.
// "letzteWoche" ist die Woche des letzten Check-ins (oder undefined, wenn es keinen gibt).
export function ueberfaelligeTage(
  angelegtAm: string,
  letzteWoche: string | undefined,
  heute: string,
): number {
  const faellig = letzteWoche ? plusTage(letzteWoche, 7) : ersterFaelligkeitstag(angelegtAm);
  return Math.max(0, tageZwischen(faellig, heute));
}

const kurzFormat = new Intl.DateTimeFormat("de-DE", {
  timeZone: "UTC",
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
});

// "So., 20.09."
export function datumKurz(datum: string): string {
  return kurzFormat.format(alsTag(datum));
}

// "29.09.2026" aus einem ISO-Zeitpunkt, in deutscher Zeit
export function datumMitJahr(zeitpunkt: string): string {
  return berlinDatum(new Date(zeitpunkt)).split("-").reverse().join(".");
}

// "29.09.2026 14:05" aus einem ISO-Zeitpunkt, in deutscher Zeit
export function datumMitUhrzeit(zeitpunkt: string): string {
  const zeit = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(zeitpunkt));
  return `${datumMitJahr(zeitpunkt)} ${zeit}`;
}

// ---------- Wochenfokus ----------

// Eine Fassung des Wochenfokus. Leerer Text = Fokus geleert. "gesetztAm" ist ein Berlin-Datum.
export type FokusFassung = { text: string; gesetztAm: string; id: string };

// Ab welcher Check-in-Woche gilt eine am Tag "gesetztAm" gesetzte Fassung? Ab der Woche nach der Woche, in der sie gesetzt wurde.
export function fokusGiltAb(gesetztAm: string): string {
  return plusTage(checkinWoche(gesetztAm), 7);
}

// Welcher Fokus gilt für eine Check-in-Woche? "fassungen": neueste zuerst. Es gilt die neueste Fassung, die in
// dieser Woche schon gilt. Null, wenn keine gilt oder die geltende leer ist (Fokus geleert).
export function geltenderFokus(
  fassungen: (FokusFassung | null | undefined)[],
  woche: string,
): FokusFassung | null {
  const treffer = fassungen.find((f) => f && fokusGiltAb(f.gesetztAm) <= woche);
  return treffer && treffer.text ? treffer : null;
}

// Neue Fassung setzen. Die bisherige neueste wird nur dann zu "vorher", wenn sie in der laufenden Woche schon gilt;
// sonst bleibt die davor stehen (sie gilt in dieser Woche noch). Mehr als diese zwei Fassungen braucht es nie.
export function setzeFokus(
  aktuell: { fokus?: FokusFassung | null; fokusVorher?: FokusFassung | null },
  neu: FokusFassung,
): { fokus: FokusFassung; fokusVorher: FokusFassung | null } {
  const woche = checkinWoche(neu.gesetztAm);
  const gilt = aktuell.fokus && fokusGiltAb(aktuell.fokus.gesetztAm) <= woche;
  return { fokus: neu, fokusVorher: (gilt ? aktuell.fokus : aktuell.fokusVorher) ?? null };
}
