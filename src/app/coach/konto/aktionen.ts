"use server";

import { redirect } from "next/navigation";
import { anmeldungPruefen, sitzungBeenden } from "@/lib/server/anmeldung";
import { loescheCoachKonto } from "@/lib/server/datenbank";

const LOESCHEN_FEHLER = "Das Löschen hat nicht vollständig geklappt. Bitte versuch es noch einmal.";

// Der Coach löscht sein eigenes Konto. Die Rückfrage ist nur Bedienung, deshalb gilt hier allein die Anmeldung.
export async function kontoLoeschen(): Promise<string | null> {
  const coach = await anmeldungPruefen();
  try {
    await loescheCoachKonto(coach.uid);
  } catch (fehler) {
    console.error("Konto löschen fehlgeschlagen:", fehler);
    return LOESCHEN_FEHLER;
  }
  await sitzungBeenden();
  redirect("/login?konto=geloescht");
}
