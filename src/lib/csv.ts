// CSV-Export der Check-ins eines Kunden, so gebaut, dass deutsches Excel die Datei direkt richtig öffnet:
// UTF-8 mit BOM, Semikolon als Trennzeichen, Zeilenende CRLF.
import type { Checkin, FokusAntwort } from "./checkin";
import { datumMitUhrzeit } from "./woche";

export const KOPFZEILE = [
  "Woche",
  "Eingereicht am",
  "Trainings geplant",
  "Trainings geschafft",
  "Energie",
  "Schlaf",
  "Stress",
  "Motivation",
  "Größter Erfolg",
  "Größte Hürde",
  "Frage",
  "Wochenfokus",
  "Fokus geschafft",
];

const fokusZelle: Record<FokusAntwort, string> = {
  geschafft: "geschafft",
  teilweise: "teilweise",
  nicht: "nicht geschafft",
  keine: "keine Angabe",
};

// Freitext, der in Excel als Formel gelten würde, bekommt ein Apostroph davor
function textZelle(text: string): string {
  return /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
}

// Felder mit Semikolon, Anführungszeichen oder Zeilenumbruch in Anführungszeichen (innere verdoppelt)
function maskiere(feld: string): string {
  return /[;"\r\n]/.test(feld) ? `"${feld.replaceAll('"', '""')}"` : feld;
}

// "checkins" in beliebiger Reihenfolge; ausgegeben wird die älteste Woche zuerst.
// Wochenfokus und Fokus-Status bleiben leer, wenn für die Woche kein Fokus galt.
export function checkinsAlsCsv(checkins: Checkin[]): string {
  const zeilen = [...checkins]
    .sort((a, b) => a.woche.localeCompare(b.woche))
    .map((c) => [
      c.woche.split("-").reverse().join("."),
      datumMitUhrzeit(c.eingereichtAm),
      String(c.trainingsGeplant),
      String(c.trainingsGeschafft),
      String(c.energie),
      String(c.schlaf),
      String(c.stress),
      String(c.motivation),
      textZelle(c.erfolg),
      textZelle(c.huerde),
      textZelle(c.frage),
      c.fokusText === undefined ? "" : textZelle(c.fokusText),
      c.fokusText === undefined ? "" : fokusZelle[c.fokusAntwort ?? "keine"],
    ]);
  return "\uFEFF" + [KOPFZEILE, ...zeilen].map((z) => z.map(maskiere).join(";")).join("\r\n") + "\r\n";
}
