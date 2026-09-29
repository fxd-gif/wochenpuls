"use server";

import { alsEingabe, entwurfAus, pruefeCheckin, wahlAntworten, type FokusAntwort } from "@/lib/checkin";
import { kundeMitToken, speichereCheckin, widerrufeEinwilligung } from "@/lib/server/datenbank";
import { berlinDatum, checkinWoche } from "@/lib/woche";

// Wird vom Kunden-Formular aufgerufen. Alles, was hier ankommt, gilt als nicht vertrauenswürdig:
// Der Kunde wird allein über den Link gefunden, und die Eingaben werden erneut geprüft.
// "einwilligung" heißt: Der Kunde hat mit dieser Anfrage das Häkchen gesetzt. Fassung und Zeitpunkt bestimmt der Server.
// Vereinfachung: kein Rate-Limit; ergänzen, falls echte Kunden-Links im Umlauf sind
export async function checkinSenden(token: string, daten: unknown, einwilligung: boolean, fokus?: unknown): Promise<{ ok: boolean; linkInaktiv?: boolean }> {
  const kunde = typeof token === "string" ? await kundeMitToken(token) : null;
  // Auch ein alter Link (nach "Link neu erzeugen") landet hier: nichts wird gespeichert
  if (!kunde || kunde.archiviert) return { ok: false, linkInaktiv: true };

  const entwurf = entwurfAus(daten);
  if (Object.keys(pruefeCheckin(entwurf)).length > 0) return { ok: false };

  // Wochenfokus: Der Browser schickt nur die Kennung der Fassung und die Antwort, nie den Text.
  // Ein Wert außerhalb der drei Antworten ist manipuliert: nichts speichern.
  let fokusBezug: { id: string; antwort: FokusAntwort } | null = null;
  if (fokus !== undefined && fokus !== null) {
    const f = fokus as { id?: unknown; antwort?: unknown };
    if (typeof f !== "object" || typeof f.id !== "string" || !wahlAntworten.includes(f.antwort as FokusAntwort)) {
      return { ok: false };
    }
    fokusBezug = { id: f.id, antwort: f.antwort as FokusAntwort };
  }

  const ok = await speichereCheckin(
    kunde.id,
    token,
    alsEingabe(entwurf),
    checkinWoche(berlinDatum()),
    new Date().toISOString(),
    einwilligung === true,
    fokusBezug,
  );
  return { ok };
}

// Der Kunde nimmt seine Einwilligung zurück: seine bisherigen Check-ins werden gelöscht.
export async function einwilligungWiderrufen(token: string): Promise<{ ok: boolean }> {
  const kunde = typeof token === "string" ? await kundeMitToken(token) : null;
  if (!kunde) return { ok: false };
  return { ok: await widerrufeEinwilligung(kunde.id, new Date().toISOString()) };
}
