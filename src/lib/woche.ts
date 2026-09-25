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
export function ueberfaelligeTage(angelegtAm: string, letzteWoche: string | undefined, heute: string): number {
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
