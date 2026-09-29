"use server";

import { revalidatePath } from "next/cache";
import { AVV_GEAENDERT, anmeldungPruefen, avvZustimmungOffen } from "@/lib/server/anmeldung";
import { legeKundeAn, loescheKunde, MAX_KUNDEN, setzeArchiviert, speichereAvvZustimmung } from "@/lib/server/datenbank";
import { berlinDatum } from "@/lib/woche";
import { erneuereToken, speichereFokus, speichereNotiz } from "@/lib/server/datenbank";
import { MAX_FOKUS } from "@/lib/checkin";
import { datumMitUhrzeit } from "@/lib/woche";

// Server-Aktionen sind auch direkt per Anfrage erreichbar: deshalb prüft jede die Anmeldung selbst.

export async function kundeAnlegen(_vorher: string | null, daten: FormData): Promise<string | null> {
  const coach = await anmeldungPruefen();
  const name = String(daten.get("name") ?? "").trim();
  if (name.length < 1 || name.length > 30) return "Bitte einen Namen mit 1 bis 30 Zeichen eingeben.";
  if (avvZustimmungOffen(coach)) return AVV_GEAENDERT;
  const ergebnis = await legeKundeAn(coach.uid, name, berlinDatum());
  if (ergebnis === "gesperrt") return "Dein Konto wird gerade gelöscht. Es kann kein Kunde mehr angelegt werden.";
  if (ergebnis === "voll") {
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

export async function avvZustimmen(): Promise<void> {
  const coach = await anmeldungPruefen();
  if (coach.istAdmin) return;
  await speichereAvvZustimmung(coach.uid);
  revalidatePath("/coach", "layout");
}

export async function linkErneuern(daten: FormData): Promise<void> {
  const coach = await anmeldungPruefen();
  const id = String(daten.get("id") ?? "");
  if (!id) return;
  await erneuereToken(id, coach.uid);
  revalidatePath("/coach", "layout");
}

export type FokusZustand = { fehler?: string; gespeichert?: boolean };

// Wochenfokus setzen oder (mit leerem Text) leeren. Eigene Fassung mit Berlin-Datum von heute.
export async function fokusSpeichern(_vorher: FokusZustand, daten: FormData): Promise<FokusZustand> {
  const coach = await anmeldungPruefen();
  const id = String(daten.get("id") ?? "");
  const text = String(daten.get("fokus") ?? "").trim();
  if (text.length > MAX_FOKUS) return { fehler: `Bitte höchstens ${MAX_FOKUS} Zeichen.` };
  try {
    if (!id || !(await speichereFokus(id, coach.uid, text, berlinDatum()))) throw new Error("Kunde nicht gefunden");
    revalidatePath("/coach", "layout");
    return { gespeichert: true };
  } catch (fehler) {
    console.error("Fokus speichern fehlgeschlagen:", fehler);
    return { fehler: "Das Speichern hat nicht geklappt. Bitte versuch es noch einmal." };
  }
}

export type NotizZustand = { fehler?: string; gespeichertAm?: string };

export async function notizSpeichern(_vorher: NotizZustand, daten: FormData): Promise<NotizZustand> {
  const coach = await anmeldungPruefen();
  const id = String(daten.get("id") ?? "");
  // Browser schicken Zeilenumbrüche als CRLF; gezählt wird wie im Formular (ein Zeichen pro Umbruch)
  const notiz = String(daten.get("notiz") ?? "").replaceAll("\r\n", "\n").trim();
  if (notiz.length > 2000) return { fehler: "Bitte höchstens 2000 Zeichen." };
  try {
    const jetzt = new Date().toISOString();
    if (!id || !(await speichereNotiz(id, coach.uid, notiz, jetzt))) throw new Error("Kunde nicht gefunden");
    revalidatePath("/coach", "layout");
    return { gespeichertAm: datumMitUhrzeit(jetzt) };
  } catch (fehler) {
    console.error("Notiz speichern fehlgeschlagen:", fehler);
    return { fehler: "Das Speichern hat nicht geklappt. Bitte versuch es noch einmal." };
  }
}
