// Automatische Prüfungen der Ampel. Starten mit: npm test
import { describe, expect, it } from "vitest";
import { demoDaten } from "@/demo/demoDaten";
import { bewerte, sortiereNachAmpel } from "./ampel";
import type { Checkin, Kunde } from "./checkin";
import { checkinWoche, plusTage } from "./woche";

// Beispiel: Letzter Sonntag ist der 20.09.2026
const kunde = (angelegtAm = "2026-07-01"): Kunde => ({
  id: "k",
  name: "Test",
  angelegtAm,
  archiviert: false,
});

const ci = (woche: string, werte: Partial<Checkin> = {}): Checkin => ({
  kundeId: "k",
  woche,
  eingereichtAm: `${woche}T18:00:00`,
  trainingsGeplant: 3,
  trainingsGeschafft: 3,
  energie: 4,
  schlaf: 4,
  stress: 2,
  motivation: 4,
  erfolg: "gut",
  huerde: "nichts",
  frage: "",
  ...werte,
});

const guterVerlauf = ["2026-08-30", "2026-09-06", "2026-09-13", "2026-09-20"].map((w) => ci(w));

describe("Wochenrechnung", () => {
  it("ordnet Check-ins von Donnerstag bis Mittwoch dem Sonntag dazwischen zu", () => {
    expect(checkinWoche("2026-09-17")).toBe("2026-09-20"); // Donnerstag
    expect(checkinWoche("2026-09-20")).toBe("2026-09-20"); // Sonntag
    expect(checkinWoche("2026-09-23")).toBe("2026-09-20"); // Mittwoch (nachgereicht)
    expect(checkinWoche("2026-09-24")).toBe("2026-09-27"); // Donnerstag: nächste Woche
  });
});

describe("Überfällig", () => {
  const bisVorwoche = guterVerlauf.slice(0, 3); // letzter Check-in für den 13.09.

  it("1 Tag überfällig ist Gelb", () => {
    const a = bewerte(kunde(), bisVorwoche, "2026-09-21");
    expect(a.stufe).toBe("gelb");
    expect(a.gruende[0]).toBe("Check-in seit gestern überfällig");
  });

  it("2 Tage überfällig ist noch Gelb", () => {
    expect(bewerte(kunde(), bisVorwoche, "2026-09-22").stufe).toBe("gelb");
  });

  it("ab 3 Tagen überfällig ist Rot", () => {
    const a = bewerte(kunde(), bisVorwoche, "2026-09-23");
    expect(a.stufe).toBe("rot");
    expect(a.gruende[0]).toBe("Check-in seit 3 Tagen überfällig");
  });

  it("am Fälligkeitstag selbst ist noch nichts überfällig", () => {
    expect(bewerte(kunde(), bisVorwoche, "2026-09-20").stufe).toBe("gruen");
  });
});

describe("Neue Kunden", () => {
  it("ohne Check-in und vor dem ersten Termin: Neu", () => {
    const a = bewerte(kunde("2026-09-21"), [], "2026-09-22");
    expect(a.stufe).toBe("neu");
    expect(a.offen).toBe(true);
  });

  it("der erste Termin liegt mindestens 3 Tage nach dem Anlegen", () => {
    // Angelegt am Freitag 18.09. → der Sonntag 20.09. ist zu früh, fällig erst am 27.09.
    expect(bewerte(kunde("2026-09-18"), [], "2026-09-23").stufe).toBe("neu");
  });

  it("wer den ersten Termin verpasst, wird Rot", () => {
    const a = bewerte(kunde("2026-09-01"), [], "2026-09-23"); // fällig war der 06.09.
    expect(a.stufe).toBe("rot");
    expect(a.gruende[0]).toBe("Check-in seit 17 Tagen überfällig");
  });
});

describe("Trainings", () => {
  it("weniger als die Hälfte ist Rot", () => {
    const a = bewerte(
      kunde(),
      [ci("2026-09-20", { trainingsGeplant: 4, trainingsGeschafft: 1 })],
      "2026-09-22",
    );
    expect(a.stufe).toBe("rot");
    expect(a.gruende[0]).toBe("Nur 1 von 4 Trainings geschafft");
  });

  it("genau die Hälfte ist nicht Rot", () => {
    const a = bewerte(
      kunde(),
      [ci("2026-09-20", { trainingsGeplant: 4, trainingsGeschafft: 2 })],
      "2026-09-22",
    );
    expect(a.stufe).toBe("gruen");
  });

  it("0 geplante Trainings (Pause) zählt nicht als Fehlschlag", () => {
    const a = bewerte(
      kunde(),
      [ci("2026-09-20", { trainingsGeplant: 0, trainingsGeschafft: 0 })],
      "2026-09-22",
    );
    expect(a.stufe).toBe("gruen");
  });
});

describe("Tiefs und Einbrüche", () => {
  it("Motivation zwei Wochen direkt hintereinander ≤ 2 ist Rot", () => {
    const verlauf = [
      ...guterVerlauf.slice(0, 2),
      ci("2026-09-13", { motivation: 2 }),
      ci("2026-09-20", { motivation: 1 }),
    ];
    const a = bewerte(kunde(), verlauf, "2026-09-22");
    expect(a.stufe).toBe("rot");
    expect(a.gruende).toContain("Motivation zwei Wochen in Folge niedrig (2 → 1)");
    expect(a.gruende.some((g) => g.startsWith("Motivation diese Woche"))).toBe(false); // keine doppelte Meldung
  });

  it("mit einer Lücke dazwischen ist es nicht 'in Folge'", () => {
    const verlauf = [ci("2026-09-06", { energie: 2 }), ci("2026-09-20", { energie: 2 })];
    const a = bewerte(kunde(), verlauf, "2026-09-22");
    expect(a.stufe).toBe("gelb");
    expect(a.gruende).toEqual(["Energie diese Woche sehr niedrig (2)"]);
  });

  it("Schlaf deutlich unter dem eigenen Schnitt ist Gelb, ohne doppelte Meldung", () => {
    const verlauf = [
      ci("2026-08-30", { schlaf: 4 }),
      ci("2026-09-06", { schlaf: 5 }),
      ci("2026-09-13", { schlaf: 4 }),
      ci("2026-09-20", { schlaf: 2 }),
    ];
    const a = bewerte(kunde(), verlauf, "2026-09-22");
    expect(a.stufe).toBe("gelb");
    expect(a.gruende).toEqual(["Schlaf deutlich schlechter als sonst (2 statt Ø 4,3)"]);
  });

  it("Einbruch wird erst ab 2 früheren Check-ins geprüft", () => {
    const verlauf = [ci("2026-09-13", { energie: 5 }), ci("2026-09-20", { energie: 3 })];
    expect(bewerte(kunde(), verlauf, "2026-09-22").stufe).toBe("gruen");
  });

  it("bei Stress ist ein Anstieg schlecht", () => {
    const verlauf = [...guterVerlauf.slice(0, 3), ci("2026-09-20", { stress: 4 })];
    const a = bewerte(kunde(), verlauf, "2026-09-22");
    expect(a.stufe).toBe("gelb");
    expect(a.gruende[0]).toBe("Stress deutlich höher als sonst (4 statt Ø 2)");
  });

  it("Stress 4 ohne Anstieg bleibt Grün, Stress 5 wird Gelb", () => {
    const hoch = (stress: number) =>
      guterVerlauf
        .map((c) => ({ ...c, stress: 4 }))
        .slice(0, 3)
        .concat(ci("2026-09-20", { stress }));
    expect(bewerte(kunde(), hoch(4), "2026-09-22").stufe).toBe("gruen");
    expect(bewerte(kunde(), hoch(5), "2026-09-22").gruende).toEqual(["Stress diese Woche sehr hoch (5)"]);
  });
});

describe("Übersicht", () => {
  it("sortiert Rot, Gelb, Neu, Grün", () => {
    const eintrag = (name: string, stufe: "rot" | "gelb" | "gruen" | "neu") => ({
      kunde: { ...kunde(), name },
      ampel: { stufe, gruende: [], offen: false, frage: "" },
    });
    const sortiert = sortiereNachAmpel([
      eintrag("A", "gruen"),
      eintrag("B", "neu"),
      eintrag("C", "rot"),
      eintrag("D", "gelb"),
    ]);
    expect(sortiert.map((e) => e.ampel.stufe)).toEqual(["rot", "gelb", "neu", "gruen"]);
  });
});

describe("Demo-Daten", () => {
  const erwartet = {
    lena: "rot",
    jonas: "rot",
    tom: "rot",
    mia: "gelb",
    sarah: "gelb",
    aylin: "gruen",
    chris: "gruen",
    ben: "neu",
  };

  it("zeigen an jedem Wochentag dieselben Ampel-Farben (veralten nie)", () => {
    for (let tag = 0; tag < 14; tag++) {
      const heute = plusTage("2026-09-21", tag);
      const { kunden, checkins } = demoDaten(heute);
      const stufen = Object.fromEntries(kunden.map((k) => [k.id, bewerte(k, checkins, heute).stufe]));
      expect(stufen, `am ${heute}`).toEqual(erwartet);
    }
  });
});
