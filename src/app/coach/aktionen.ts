"use server";

import { revalidatePath } from "next/cache";
import { anmeldungPruefen } from "@/lib/server/anmeldung";
import { legeKundeAn, setzeArchiviert } from "@/lib/server/datenbank";
import { berlinDatum } from "@/lib/woche";

// Server-Aktionen sind auch direkt per Anfrage erreichbar: deshalb prüft jede die Anmeldung selbst.

export async function kundeAnlegen(_vorher: string | null, daten: FormData): Promise<string | null> {
  await anmeldungPruefen();
  const name = String(daten.get("name") ?? "").trim();
  if (name.length < 1 || name.length > 30) return "Bitte einen Namen mit 1 bis 30 Zeichen eingeben.";
  await legeKundeAn(name, berlinDatum());
  revalidatePath("/coach", "layout");
  return null;
}

export async function kundeArchivieren(daten: FormData): Promise<void> {
  await anmeldungPruefen();
  const id = String(daten.get("id") ?? "");
  if (!id) return;
  await setzeArchiviert(id, daten.get("archiviert") === "ja");
  revalidatePath("/coach", "layout");
}
