// AC-130: Der Wochenfokus ändert die Ampel nicht.
import { describe, expect, it } from "vitest";
import { bewerte } from "./ampel";
import type { Checkin, Kunde } from "./checkin";

const kunde = (angelegtAm: string): Kunde => ({ id: "k", name: "Test", angelegtAm, archiviert: false });

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

describe("bewerte mit und ohne Fokus-Felder", () => {
  it("liefert Stufe, Gründe, offen und Frage unverändert", () => {
    const heute = "2026-09-29";
    const verlaeufe = [
      [],
      [ci("2026-09-20")],
      [ci("2026-09-06", { stress: 5 }), ci("2026-09-13", { trainingsGeschafft: 0 }), ci("2026-09-20", { frage: "Hilfe?" })],
    ];
    for (const ohne of verlaeufe) {
      const mit = ohne.map((c, i) => ({
        ...c,
        fokusText: "3x laufen",
        fokusAntwort: (["geschafft", "teilweise", "nicht", "keine"] as const)[i],
      }));
      const a = bewerte(kunde("2026-07-01"), ohne, heute);
      const b = bewerte(kunde("2026-07-01"), mit, heute);
      expect({ stufe: b.stufe, gruende: b.gruende, offen: b.offen, frage: b.frage }).toEqual({
        stufe: a.stufe,
        gruende: a.gruende,
        offen: a.offen,
        frage: a.frage,
      });
    }
  });
});
