"use server";

import { revalidatePath } from "next/cache";
import { anmeldungPruefen } from "@/lib/server/anmeldung";
import { legeKundeAn, loescheKunde, MAX_KUNDEN, setzeArchiviert } from "@/lib/server/datenbank";
import { berlinDatum } from "@/lib/woche";

// Server-Aktionen sind auch direkt per Anfrage erreichbar: deshalb prüft jede die Anmeldung selbst.

export async function kundeAnlegen(_vorher: string | null, daten: FormData): Promise<string | null> {
  const coach = await anmeldungPruefen();
  const name = String(daten.get("name") ?? "").trim();
  if (name.length < 1 || name.length > 30) return "Bitte einen Namen mit 1 bis 30 Zeichen eingeben.";
  if (!(await legeKundeAn(coach.uid, name, berlinDatum()))) {
    return `Du hast schon ${MAX_KUNDEN} Kunden (archivierte zählen mit). Lösche einen archivierten Kunden, um Platz zu machen.`;
  }
  revalidatePath("/coach", "layout");
  return null;
}

export async function kundeArchivieren(daten: FormData): Promise<void> {
  const coach = await anmeldungPruefen();
  const id = String(daten.get("id") ?? "");
  if (!id) return;
  await setzeArchiviert(id, coach.uid, daten.get("archiviert") === "ja");
  revalidatePath("/coach", "layout");
}

export async function kundeLoeschen(daten: FormData): Promise<void> {
  const coach = await anmeldungPruefen();
  const id = String(daten.get("id") ?? "");
  if (!id) return;
  await loescheKunde(id, coach.uid);
  revalidatePath("/coach", "layout");
}
