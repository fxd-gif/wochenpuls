import { describe, expect, it } from "vitest";
import type { Kunde } from "./checkin";
import { ordneUebersicht } from "./uebersicht";

const kunde = (name: string, extra: Partial<Kunde> = {}): Kunde => ({
  id: name,
  name,
  angelegtAm: "2026-07-01",
  archiviert: false,
  ...extra,
});

describe("ordneUebersicht", () => {
  it("trennt widerrufene Kunden von den bewerteten und sortiert sie nach Namen", () => {
    const { bewertet, widerrufen } = ordneUebersicht(
      [
        kunde("Zoe", { widerrufenAm: "2026-09-20T10:00:00.000Z" }),
        kunde("Ben"),
        kunde("Anna", { widerrufenAm: "2026-09-21T10:00:00.000Z" }),
      ],
      [],
      "2026-09-29",
    );
    expect(bewertet.map((e) => e.kunde.name)).toEqual(["Ben"]);
    expect(widerrufen.map((k) => k.name)).toEqual(["Anna", "Zoe"]);
  });

  it("lässt archivierte Kunden weg, auch widerrufene", () => {
    const { bewertet, widerrufen } = ordneUebersicht(
      [kunde("Ben", { archiviert: true }), kunde("Anna", { archiviert: true, widerrufenAm: "2026-09-21T10:00:00.000Z" })],
      [],
      "2026-09-29",
    );
    expect(bewertet).toEqual([]);
    expect(widerrufen).toEqual([]);
  });
});
