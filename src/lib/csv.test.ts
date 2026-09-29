import { describe, expect, it } from "vitest";
import { checkinsAlsCsv, KOPFZEILE } from "./csv";
import type { Checkin } from "./checkin";

const checkin = (extra: Partial<Checkin> = {}): Checkin => ({
  kundeId: "k",
  woche: "2026-09-27",
  eingereichtAm: "2026-09-26T12:05:00.000Z",
  trainingsGeplant: 3,
  trainingsGeschafft: 2,
  energie: 4,
  schlaf: 3,
  stress: 2,
  motivation: 5,
  erfolg: "gut",
  huerde: "Zeit",
  frage: "",
  ...extra,
});

describe("checkinsAlsCsv", () => {
  it("beginnt mit BOM und der Kopfzeile, Zeilenende CRLF", () => {
    const csv = checkinsAlsCsv([checkin()]);
    expect(csv.startsWith("\uFEFFWoche;Eingereicht am;Trainings geplant;")).toBe(true);
    expect(csv.split("\r\n")[0]).toBe("\uFEFF" + KOPFZEILE.join(";"));
    expect(csv.endsWith("\r\n")).toBe(true);
    expect(csv.replaceAll("\r\n", "")).not.toMatch(/[\r\n]/);
  });

  it("schreibt Daten in deutscher Zeit, älteste Woche zuerst", () => {
    const csv = checkinsAlsCsv([checkin({ woche: "2026-09-27" }), checkin({ woche: "2026-09-20" })]);
    const zeilen = csv.split("\r\n");
    expect(zeilen[1].startsWith("20.09.2026;26.09.2026 14:05;3;2;4;3;2;5;")).toBe(true);
    expect(zeilen[2].startsWith("27.09.2026;")).toBe(true);
  });

  it("maskiert Semikolon, Anführungszeichen und Zeilenumbruch", () => {
    const csv = checkinsAlsCsv([checkin({ erfolg: 'a;b', huerde: 'sagte "hi"', frage: "eins\nzwei" })]);
    expect(csv).toContain('"a;b";"sagte ""hi""";"eins\nzwei"');
  });

  it("füllt Wochenfokus und Fokus-Status, leer ohne Fokus", () => {
    const zeilen = checkinsAlsCsv([
      checkin({ woche: "2026-09-13" }),
      checkin({ woche: "2026-09-20", fokusText: "3x laufen", fokusAntwort: "geschafft" }),
      checkin({ woche: "2026-09-27", fokusText: "Früh schlafen", fokusAntwort: "nicht" }),
      checkin({ woche: "2026-10-04", fokusText: "=Dehnen", fokusAntwort: "keine" }),
      checkin({ woche: "2026-10-11", fokusText: "Yoga", fokusAntwort: "teilweise" }),
    ]).split("\r\n");
    expect(zeilen[1].endsWith(";Zeit;;;")).toBe(true);
    expect(zeilen[2].endsWith(";3x laufen;geschafft")).toBe(true);
    expect(zeilen[3].endsWith(";Früh schlafen;nicht geschafft")).toBe(true);
    expect(zeilen[4].endsWith(";'=Dehnen;keine Angabe")).toBe(true);
    expect(zeilen[5].endsWith(";Yoga;teilweise")).toBe(true);
  });

  it("schützt vor Formeln", () => {
    const csv = checkinsAlsCsv([checkin({ erfolg: "=1+1", huerde: "-5", frage: "@x" })]);
    expect(csv).toContain(";'=1+1;'-5;'@x;");
    const tab = checkinsAlsCsv([checkin({ erfolg: "\tx" })]);
    expect(tab).toContain(";'\tx;");
  });
});
