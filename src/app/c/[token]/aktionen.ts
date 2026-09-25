"use server";

import { alsEingabe, entwurfAus, pruefeCheckin } from "@/lib/checkin";
import { kundeMitToken, speichereCheckin } from "@/lib/server/datenbank";
import { berlinDatum, checkinWoche } from "@/lib/woche";

// Wird vom Kunden-Formular aufgerufen. Alles, was hier ankommt, gilt als nicht vertrauenswürdig:
// Der Kunde wird allein über den Link gefunden, und die Eingaben werden erneut geprüft.
// Vereinfachung: kein Rate-Limit; ergänzen, falls echte Kunden-Links im Umlauf sind
export async function checkinSenden(token: string, daten: unknown): Promise<{ ok: boolean }> {
  const kunde = typeof token === "string" ? await kundeMitToken(token) : null;
  if (!kunde || kunde.archiviert) return { ok: false };

  const entwurf = entwurfAus(daten);
  if (Object.keys(pruefeCheckin(entwurf)).length > 0) return { ok: false };

  await speichereCheckin(
    kunde.id,
    alsEingabe(entwurf),
    checkinWoche(berlinDatum()),
    new Date().toISOString(),
  );
  return { ok: true };
}
