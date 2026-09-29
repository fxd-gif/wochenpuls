import { bewerte, sortiereNachAmpel, type AmpelErgebnis } from "./ampel";
import type { Checkin, Kunde } from "./checkin";

// Ordnet die Kunden für die Übersicht: erst alle bewerteten (Rot zuerst), danach die Kunden, die ihre
// Einwilligung widerrufen haben. Archivierte fehlen. Widerrufene bekommen keine Ampel und zählen in keiner Stufe.
export function ordneUebersicht(
  kunden: Kunde[],
  checkins: Checkin[],
  heute: string,
): { bewertet: { kunde: Kunde; ampel: AmpelErgebnis }[]; widerrufen: Kunde[] } {
  const aktive = kunden.filter((k) => !k.archiviert);
  const widerrufen = (k: Kunde) => Boolean(k.widerrufenAm);
  return {
    bewertet: sortiereNachAmpel(
      aktive.filter((k) => !widerrufen(k)).map((kunde) => ({ kunde, ampel: bewerte(kunde, checkins, heute) })),
    ),
    widerrufen: aktive.filter(widerrufen).sort((a, b) => a.name.localeCompare(b.name, "de")),
  };
}
