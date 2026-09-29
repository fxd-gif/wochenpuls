"use server";

import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { anmeldungPruefen } from "@/lib/server/anmeldung";
import { coachZuCode, erzeugeEinladung, loescheCoachKonto, loescheEinladung } from "@/lib/server/datenbank";
import { berlinDatum } from "@/lib/woche";

// Nur für den Admin. Jede Aktion prüft das selbst, weil sie auch direkt aufrufbar ist.
async function adminPruefen() {
  const coach = await anmeldungPruefen();
  if (!coach.istAdmin) notFound();
  return coach;
}

export async function einladungErzeugen(_vorher: string | null, daten: FormData): Promise<string | null> {
  await adminPruefen();
  const vermerk = String(daten.get("vermerk") ?? "").trim();
  if (vermerk.length < 1 || vermerk.length > 40) return "Bitte einen Vermerk mit 1 bis 40 Zeichen eingeben.";
  await erzeugeEinladung(vermerk, berlinDatum());
  revalidatePath("/coach/einladungen");
  return null;
}

export async function einladungLoeschen(daten: FormData): Promise<void> {
  await adminPruefen();
  await loescheEinladung(String(daten.get("code") ?? ""));
  revalidatePath("/coach/einladungen");
}

// Löscht das Konto, das diesen Code eingelöst hat (Kunden, Check-ins, Eintrag, Firebase-Nutzer). Das eigene Konto nie.
export async function coachKontoLoeschen(_vorher: string | null, daten: FormData): Promise<string | null> {
  const admin = await adminPruefen();
  const uid = await coachZuCode(String(daten.get("code") ?? ""));
  if (!uid || uid === admin.uid) return "Zu diesem Code gibt es kein Coach-Konto mehr.";
  try {
    await loescheCoachKonto(uid);
  } catch (fehler) {
    console.error("Coach-Konto löschen fehlgeschlagen:", fehler);
    return "Das Löschen hat nicht vollständig geklappt. Bitte versuch es noch einmal.";
  }
  revalidatePath("/coach/einladungen");
  return null;
}
