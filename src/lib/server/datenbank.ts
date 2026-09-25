import "server-only";
import { randomBytes } from "node:crypto";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, type DocumentData, type Firestore } from "firebase-admin/firestore";
import type { Checkin, CheckinEingabe, Kunde } from "@/lib/checkin";

// Zugriff auf Firestore, NUR auf dem Server ("server-only" verhindert, dass diese Datei im Browser landet).
// Zugangsdaten: der komplette Inhalt der JSON-Schlüsseldatei aus Firebase in der
// Umgebungsvariable FIREBASE_SERVICE_ACCOUNT. Die Firestore-Regeln bleiben auf "alles gesperrt":
// Der Server-Schlüssel braucht keine Regeln, der Browser bekommt keinen Zugriff.

export function datenbankEingerichtet(): boolean {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT);
}

let db: Firestore | undefined;
function datenbank(): Firestore {
  if (db) return db;
  const zugang = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!zugang) throw new Error("FIREBASE_SERVICE_ACCOUNT ist nicht gesetzt");
  const app = getApps()[0] ?? initializeApp({ credential: cert(JSON.parse(zugang)) });
  db = getFirestore(app);
  return db;
}

const kunden = () => datenbank().collection("kunden");

function alsKunde(id: string, d: DocumentData): Kunde {
  return { id, name: String(d.name), angelegtAm: String(d.angelegtAm), archiviert: Boolean(d.archiviert) };
}

function alsCheckin(kundeId: string, d: DocumentData): Checkin {
  return {
    kundeId,
    woche: d.woche,
    eingereichtAm: d.eingereichtAm,
    trainingsGeplant: d.trainingsGeplant,
    trainingsGeschafft: d.trainingsGeschafft,
    energie: d.energie,
    schlaf: d.schlaf,
    stress: d.stress,
    motivation: d.motivation,
    erfolg: d.erfolg,
    huerde: d.huerde,
    frage: d.frage ?? "",
  };
}

export async function verbindungOk(): Promise<boolean> {
  try {
    await kunden().limit(1).get();
    return true;
  } catch (fehler) {
    console.error("Datenbank nicht erreichbar:", fehler);
    return false;
  }
}

export async function alleKunden(): Promise<Kunde[]> {
  const snap = await kunden().orderBy("angelegtAm").get();
  return snap.docs.map((d) => alsKunde(d.id, d.data()));
}

// Nur für die Coach-Seite: Kunden-ID → Token (für die persönlichen Links)
export async function alleTokens(): Promise<Record<string, string>> {
  const snap = await kunden().get();
  return Object.fromEntries(snap.docs.map((d) => [d.id, String(d.data().token)]));
}

export async function kundeMitId(id: string): Promise<Kunde | null> {
  const d = await kunden().doc(id).get();
  return d.exists ? alsKunde(d.id, d.data()!) : null;
}

const TOKEN_FORMAT = /^[A-Za-z0-9_-]{32}$/;

export async function kundeMitToken(token: string): Promise<Kunde | null> {
  if (!TOKEN_FORMAT.test(token)) return null;
  const snap = await kunden().where("token", "==", token).limit(1).get();
  const d = snap.docs[0];
  return d ? alsKunde(d.id, d.data()) : null;
}

// Die letzten Check-ins der angegebenen Kunden (pro Kunde höchstens "wochen" Stück)
export async function checkinsVon(kundenIds: string[], wochen = 12): Promise<Checkin[]> {
  const listen = await Promise.all(
    kundenIds.map((id) =>
      kunden().doc(id).collection("checkins").orderBy("woche", "desc").limit(wochen).get(),
    ),
  );
  return listen.flatMap((snap, i) => snap.docs.map((d) => alsCheckin(kundenIds[i], d.data())));
}

export async function legeKundeAn(name: string, heute: string): Promise<void> {
  // 24 zufällige Bytes = 32 Zeichen, praktisch nicht zu erraten
  const token = randomBytes(24).toString("base64url");
  await kunden().add({ name, token, angelegtAm: heute, archiviert: false });
}

export async function setzeArchiviert(id: string, archiviert: boolean): Promise<void> {
  await kunden().doc(id).update({ archiviert });
}

// Ein Check-in pro Woche: Ein zweites Absenden in derselben Woche überschreibt den ersten.
export async function speichereCheckin(
  kundeId: string,
  eingabe: CheckinEingabe,
  woche: string,
  eingereichtAm: string,
): Promise<void> {
  await kunden()
    .doc(kundeId)
    .collection("checkins")
    .doc(woche)
    .set({ ...eingabe, woche, eingereichtAm });
}
