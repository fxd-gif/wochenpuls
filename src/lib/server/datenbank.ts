import "server-only";
import { randomBytes } from "node:crypto";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type DocumentData, type Firestore } from "firebase-admin/firestore";
import type { Checkin, CheckinEingabe, Kunde } from "@/lib/checkin";

// Zugriff auf Firestore, NUR auf dem Server ("server-only" verhindert, dass diese Datei im Browser landet).
// Zugangsdaten: der komplette Inhalt der JSON-Schlüsseldatei aus Firebase in der
// Umgebungsvariable FIREBASE_SERVICE_ACCOUNT. Die Firestore-Regeln bleiben auf "alles gesperrt":
// Der Server-Schlüssel braucht keine Regeln, der Browser bekommt keinen Zugriff.

export function datenbankEingerichtet(): boolean {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT);
}

function firebaseApp(): App {
  const zugang = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!zugang) throw new Error("FIREBASE_SERVICE_ACCOUNT ist nicht gesetzt");
  return getApps()[0] ?? initializeApp({ credential: cert(JSON.parse(zugang)) });
}

let db: Firestore | undefined;
function datenbank(): Firestore {
  db ??= getFirestore(firebaseApp());
  return db;
}

// Firebase Authentication (Google-Anmeldung), ebenfalls nur auf dem Server
export function anmeldeDienst(): Auth {
  return getAuth(firebaseApp());
}

const kunden = () => datenbank().collection("kunden");
const coaches = () => datenbank().collection("coaches");
const einladungen = () => datenbank().collection("einladungen");

export const MAX_KUNDEN = 25;

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

// Jeder Kunde gehört genau einem Coach (Feld coachId). Alle Abfragen des Coach-Bereichs filtern danach.
// Sortiert wird hier statt in Firestore, sonst bräuchte die Abfrage einen eigenen Index.
async function kundenDokumente(coachId: string) {
  const snap = await kunden().where("coachId", "==", coachId).get();
  return snap.docs.sort((a, b) => String(a.data().angelegtAm).localeCompare(String(b.data().angelegtAm)));
}

export async function alleKunden(coachId: string): Promise<Kunde[]> {
  return (await kundenDokumente(coachId)).map((d) => alsKunde(d.id, d.data()));
}

// Nur für die Coach-Seite: Kunden-ID → Token (für die persönlichen Links)
export async function alleTokens(coachId: string): Promise<Record<string, string>> {
  const docs = await kundenDokumente(coachId);
  return Object.fromEntries(docs.map((d) => [d.id, String(d.data().token)]));
}

// Kunden-IDs vergibt Firestore beim Anlegen selbst: 20 Buchstaben und Ziffern.
// Alles andere (z. B. mit "/") würde auf ein anderes Dokument zeigen und wird abgewiesen.
const ID_FORMAT = /^[A-Za-z0-9]{20}$/;

// Kunden anderer Coaches werden behandelt, als gäbe es sie nicht
async function eigenerKunde(id: string, coachId: string) {
  if (!ID_FORMAT.test(id)) return null;
  const d = await kunden().doc(id).get();
  return d.exists && d.data()!.coachId === coachId ? d : null;
}

export async function kundeMitId(id: string, coachId: string): Promise<Kunde | null> {
  const d = await eigenerKunde(id, coachId);
  return d ? alsKunde(d.id, d.data()!) : null;
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

// Gibt false zurück, wenn der Coach schon MAX_KUNDEN Kunden hat (archivierte zählen mit)
export async function legeKundeAn(coachId: string, name: string, heute: string): Promise<boolean> {
  const anzahl = (await kunden().where("coachId", "==", coachId).count().get()).data().count;
  if (anzahl >= MAX_KUNDEN) return false;
  // 24 zufällige Bytes = 32 Zeichen, praktisch nicht zu erraten
  const token = randomBytes(24).toString("base64url");
  await kunden().add({ coachId, name, token, angelegtAm: heute, archiviert: false });
  return true;
}

export async function setzeArchiviert(id: string, coachId: string, archiviert: boolean): Promise<void> {
  const d = await eigenerKunde(id, coachId);
  if (d) await d.ref.update({ archiviert });
}

// Löscht den Kunden und alle seine Check-ins unwiderruflich (Firestore löscht Unterkollektionen nicht von selbst).
export async function loescheKunde(id: string, coachId: string): Promise<void> {
  const d = await eigenerKunde(id, coachId);
  if (d) await datenbank().recursiveDelete(d.ref);
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

// ---------- Coach-Konten ----------
// Ein Coach-Konto ist ein Eintrag coaches/{uid}; uid ist die Konto-ID aus der Google-Anmeldung.

export async function coachExistiert(uid: string): Promise<boolean> {
  return (await coaches().doc(uid).get()).exists;
}

export async function legeCoachAn(uid: string, email: string, heute: string): Promise<void> {
  await coaches().doc(uid).set({ email, angelegtAm: heute }, { merge: true });
}

// ---------- Einladungscodes ----------

export type Einladung = {
  code: string;
  vermerk: string;
  erstelltAm: string;
  eingeloestAm: string | null;
};

// Ohne leicht verwechselbare Zeichen (0/O, 1/I/L)
const CODE_ZEICHEN = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_FORMAT = /^[A-HJKMNP-Z2-9]{8}$/;

// "abcd-efgh" und "ABCD EFGH" gelten beide als "ABCDEFGH"
export function codeNormalisieren(eingabe: string): string {
  return eingabe.toUpperCase().replace(/[\s-]/g, "");
}

export async function alleEinladungen(): Promise<Einladung[]> {
  const snap = await einladungen().orderBy("erstelltAm", "desc").get();
  return snap.docs.map((d) => ({
    code: d.id,
    vermerk: String(d.data().vermerk ?? ""),
    erstelltAm: String(d.data().erstelltAm),
    eingeloestAm: d.data().eingeloestAm ?? null,
  }));
}

export async function erzeugeEinladung(vermerk: string, heute: string): Promise<void> {
  // 31 Zeichen, 8 Stellen: knapp 1 Billion Möglichkeiten. Kleine Schieflage durch "% 31" ist hier egal.
  const code = Array.from(randomBytes(8), (b) => CODE_ZEICHEN[b % CODE_ZEICHEN.length]).join("");
  await einladungen().doc(code).create({ vermerk, erstelltAm: heute, eingeloestAm: null });
}

// Nur offene Codes lassen sich löschen
export async function loescheEinladung(code: string): Promise<void> {
  if (!CODE_FORMAT.test(code)) return;
  await datenbank().runTransaction(async (t) => {
    const d = await t.get(einladungen().doc(code));
    if (d.exists && !d.data()!.eingeloestAm) t.delete(d.ref);
  });
}

// Löst den Code ein und legt das Coach-Konto an: beides zusammen oder gar nichts.
// So kann ein Code nie zweimal benutzt werden, auch nicht bei zwei gleichzeitigen Versuchen.
export async function loeseEinladungEin(eingabe: string, uid: string, email: string, heute: string): Promise<boolean> {
  const code = codeNormalisieren(eingabe);
  if (!CODE_FORMAT.test(code)) return false;
  return datenbank().runTransaction(async (t) => {
    const einladung = await t.get(einladungen().doc(code));
    if (!einladung.exists || einladung.data()!.eingeloestAm) return false;
    t.update(einladung.ref, { eingeloestAm: heute, eingeloestVon: uid });
    t.set(coaches().doc(uid), { email, angelegtAm: heute, code });
    return true;
  });
}
