import { describe, expect, it } from "vitest";
import { berlinDatum, checkinWoche, fokusGiltAb, geltenderFokus, plusTage, setzeFokus, type FokusFassung } from "./woche";

// S = Sonntag, Fälligkeitstag
const S = "2026-09-27";
const fassung = (text: string, gesetztAm: string): FokusFassung => ({ text, gesetztAm, id: text });

// Wie der Server: Fassungen einer Reihe von Setz-Vorgängen aufbauen
function setzeNacheinander(...schritte: [string, string][]) {
  let stand: { fokus?: FokusFassung | null; fokusVorher?: FokusFassung | null } = {};
  for (const [text, tag] of schritte) stand = setzeFokus(stand, fassung(text, tag));
  return [stand.fokus, stand.fokusVorher];
}
const text = (f: FokusFassung | null) => f?.text ?? null;

describe("geltenderFokus (AC-140)", () => {
  it("(1) B am Montag nach S gesetzt: verspäteter Check-in für S fragt nach A, S+7 nach B", () => {
    const f = setzeNacheinander(["A", "2026-08-01"], ["B", plusTage(S, 1)]);
    expect(text(geltenderFokus(f, S))).toBe("A");
    expect(text(geltenderFokus(f, plusTage(S, 7)))).toBe("B");
  });

  it("(2) am Freitag vor S gesetzt: gilt erst für S+7", () => {
    const f = setzeNacheinander(["A", plusTage(S, -2)]);
    expect(geltenderFokus(f, S)).toBeNull();
    expect(text(geltenderFokus(f, plusTage(S, 7)))).toBe("A");
  });

  it("(3) zweimal im selben Zeitfenster geändert: für S die Fassung von vorher, für S+7 die letzte", () => {
    const f = setzeNacheinander(["A", "2026-08-01"], ["B", plusTage(S, 1)], ["C", plusTage(S, 3)]);
    expect(text(geltenderFokus(f, S))).toBe("A");
    expect(text(geltenderFokus(f, plusTage(S, 7)))).toBe("C");
  });

  it("Leeren ist eine Fassung mit leerem Text", () => {
    const f = setzeNacheinander(["A", "2026-08-01"], ["", plusTage(S, 1)]);
    expect(text(geltenderFokus(f, S))).toBe("A");
    expect(geltenderFokus(f, plusTage(S, 7))).toBeNull();
  });

  it.each([
    ["Sommerzeit", "2026-07-01T21:30:00Z", "2026-07-01T22:30:00Z"],
    ["Winterzeit", "2026-12-02T22:30:00Z", "2026-12-02T23:30:00Z"],
  ])("(4) Mittwoch 23:30 und Donnerstag 00:30 deutscher Zeit (%s) ergeben verschiedene Wochen", (_n, mi, don) => {
    const tagMi = berlinDatum(new Date(mi));
    const tagDo = berlinDatum(new Date(don));
    expect(tagDo).toBe(plusTage(tagMi, 1));
    expect(fokusGiltAb(tagDo)).toBe(plusTage(fokusGiltAb(tagMi), 7));
    expect(checkinWoche(tagDo)).toBe(plusTage(checkinWoche(tagMi), 7));
  });
});
