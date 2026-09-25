"use server";

import { redirect } from "next/navigation";
import { passwortStimmt, sitzungBeenden, sitzungStarten } from "@/lib/server/anmeldung";

export async function anmelden(_vorher: string | null, daten: FormData): Promise<string | null> {
  if (!passwortStimmt(String(daten.get("passwort") ?? ""))) {
    // Vereinfachung: kurze Pause statt Sperre nach X Versuchen; Rate-Limit ergänzen, falls es echte Nutzer gibt
    await new Promise((fertig) => setTimeout(fertig, 800));
    return "Das Passwort stimmt nicht.";
  }
  await sitzungStarten();
  redirect("/coach");
}

export async function abmelden(): Promise<void> {
  await sitzungBeenden();
  redirect("/login");
}
