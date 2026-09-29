import "server-only";
import { randomBytes } from "node:crypto";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { FieldValue, getFirestore, type DocumentData, type DocumentReference, type Firestore } from "firebase-admin/firestore";
import { AVV_FASSUNG, EINWILLIGUNG_FASSUNG } from "@/lib/rechtstexte";
import { wahlAntworten, type Checkin, type CheckinEingabe, type FokusAntwort, type Kunde } from "@/lib/checkin";
import { geltenderFokus, setzeFokus, type FokusFassung } from "@/lib/woche";

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

function alsFassung(f: DocumentData | undefined): FokusFassung | null {
  return f ? { text: String(f.text), gesetztAm: String(f.gesetztAm), id: String(f.id) } : null;
}

function alsKunde(id: string, d: DocumentData): Kunde {
  return {
    id,
    name: String(d.name),
    angelegtAm: String(d.angelegtAm),
    archiviert: Boolean(d.archiviert),
    einwilligungFassung: d.einwilligungFassung,
    einwilligungAm: d.einwilligungAm,
    widerrufenAm: d.widerrufenAm,
    fokus: alsFassung(d.fokus),
    fokusVorher: alsFassung(d.fokusVorher),
  };
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
    ...(typeof d.fokusText === "string" && { fokusText: d.fokusText, fokusAntwort: d.fokusAntwort }),
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
  if (!d) return null;
  // Gehört der Kunde zu einem Coach, dessen Konto fehlt oder gerade gelöscht wird, gilt der Link als ungültig
  const coach = await coaches().doc(String(d.data().coachId)).get();
  if (!coach.exists || coach.data()!.geloeschtAm) return null;
  return alsKunde(d.id, d.data());
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

// "voll": der Coach hat schon MAX_KUNDEN Kunden (archivierte zählen mit). "gesperrt": sein Konto wird gerade gelöscht.
// Die Markierung wird in derselben Transaktion geprüft: So bleibt bei einer gleichzeitigen Kontolöschung kein Kunde übrig.
export async function legeKundeAn(coachId: string, name: string, heute: string): Promise<"ok" | "voll" | "gesperrt"> {
  return datenbank().runTransaction(async (t) => {
    const coach = await t.get(coaches().doc(coachId));
    if (!coach.exists || coach.data()!.geloeschtAm) return "gesperrt";
    const anzahl = (await t.get(kunden().where("coachId", "==", coachId).count())).data().count;
    if (anzahl >= MAX_KUNDEN) return "voll";
    // 24 zufällige Bytes = 32 Zeichen, praktisch nicht zu erraten
    const token = randomBytes(24).toString("base64url");
    t.create(kunden().doc(), { coachId, name, token, angelegtAm: heute, archiviert: false });
    return "ok";
  });
}

export async function setzeArchiviert(id: string, coachId: string, archiviert: boolean): Promise<void> {
  const d = await eigenerKunde(id, coachId);
  if (d) await d.ref.update({ archiviert });
}

// Löscht einen Kunden mit allen Check-ins. Vorher wird er unerreichbar gemacht (neuer Token, archiviert):
// So kann über den alten Link kein Check-in mehr dazwischenkommen. Firestore löscht Unterkollektionen nicht von selbst.
async function loescheKundenDokument(ref: DocumentReference): Promise<void> {
  await ref.update({ token: randomBytes(24).toString("base64url"), archiviert: true });
  await datenbank().recursiveDelete(ref);
}

// Löscht den Kunden und alle seine Check-ins unwiderruflich
export async function loescheKunde(id: string, coachId: string): Promise<void> {
  const d = await eigenerKunde(id, coachId);
  if (d) await loescheKundenDokument(d.ref);
}

async function loescheKundenVon(coachId: string): Promise<void> {
  const meine = await kunden().where("coachId", "==", coachId).get();
  await Promise.all(meine.docs.map((d) => loescheKundenDokument(d.ref)));
}

// Ein Check-in pro Woche: Ein zweites Absenden in derselben Woche überschreibt den ersten.
// Gespeichert wird nur mit Einwilligung (schon gespeichert oder mit dieser Anfrage). Alles in einer
// Transaktion: Ein gleichzeitiges Löschen oder Widerrufen kann kein verwaistes Dokument hinterlassen.
export async function speichereCheckin(
  kundeId: string,
  token: string,
  eingabe: CheckinEingabe,
  woche: string,
  eingereichtAm: string,
  willigtEin: boolean,
  fokusBezug: { id: string; antwort: FokusAntwort } | null,
): Promise<boolean> {
  return datenbank().runTransaction(async (t) => {
    const ref = kunden().doc(kundeId);
    const kunde = await t.get(ref);
    if (!kunde.exists || kunde.data()!.archiviert || kunde.data()!.token !== token) return false;
    // Lesen vor Schreiben: Auch der Coach-Eintrag darf nicht fehlen oder zur Löschung markiert sein
    const coach = await t.get(coaches().doc(String(kunde.data()!.coachId)));
    if (!coach.exists || coach.data()!.geloeschtAm) return false;
    const hatEinwilligung = kunde.data()!.einwilligungFassung === EINWILLIGUNG_FASSUNG;
    if (!hatEinwilligung) {
      if (!willigtEin) return false;
      t.update(ref, {
        einwilligungFassung: EINWILLIGUNG_FASSUNG,
        einwilligungAm: eingereichtAm,
        widerrufenAm: FieldValue.delete(),
      });
    }
    // Den geltenden Fokus bestimmt der Server aus dem Kunden-Dokument, nie der Browser. Passt die Antwort nicht
    // zur geltenden Fassung (oder fehlt sie), gilt "keine". Gilt kein Fokus, wird eine Antwort verworfen.
    const k = alsKunde(kunde.id, kunde.data()!);
    const fokus = geltenderFokus([k.fokus, k.fokusVorher], woche);
    const fokusFelder = fokus
      ? {
          fokusText: fokus.text,
          fokusAntwort:
            fokusBezug?.id === fokus.id && wahlAntworten.includes(fokusBezug.antwort) ? fokusBezug.antwort : "keine",
        }
      : {};
    t.set(ref.collection("checkins").doc(woche), { ...eingabe, ...fokusFelder, woche, eingereichtAm });
    return true;
  });
}

// Widerruf durch den Kunden: Einwilligung weg, Zeitpunkt merken, alle Check-ins löschen (auch bei archivierten Kunden).
export async function widerrufeEinwilligung(kundeId: string, zeitpunkt: string): Promise<boolean> {
  return datenbank().runTransaction(async (t) => {
    const ref = kunden().doc(kundeId);
    const kunde = await t.get(ref);
    if (!kunde.exists || !kunde.data()!.einwilligungFassung) return false;
    const checkins = await t.get(ref.collection("checkins"));
    checkins.docs.forEach((d) => t.delete(d.ref));
    t.update(ref, {
      einwilligungFassung: FieldValue.delete(),
      einwilligungAm: FieldValue.delete(),
      widerrufenAm: zeitpunkt,
    });
    return true;
  });
}

// ---------- Coach-Konten ----------
// Ein Coach-Konto ist ein Eintrag coaches/{uid}; uid ist die Konto-ID aus der Google-Anmeldung.

export type CoachDaten = { avvFassung?: string; avvAm?: string };

// Ein einziger Zugriff liefert alles, was die Sitzung braucht. Null: kein Konto oder Löschung schon begonnen.
export async function coachDaten(uid: string): Promise<CoachDaten | null> {
  const d = await coaches().doc(uid).get();
  if (!d.exists || d.data()!.geloeschtAm) return null;
  return { avvFassung: d.data()!.avvFassung, avvAm: d.data()!.avvAm };
}

// Wurde eine Kontolöschung begonnen, aber nicht beendet?
export async function loeschungOffen(uid: string): Promise<boolean> {
  return Boolean((await coaches().doc(uid).get()).data()?.geloeschtAm);
}

export async function coachExistiert(uid: string): Promise<boolean> {
  return (await coachDaten(uid)) !== null;
}

// Gibt es den Eintrag, auch mit Löschmarkierung?
export async function coachEintragVorhanden(uid: string): Promise<boolean> {
  return (await coaches().doc(uid).get()).exists;
}

// Legt das Konto des Admins an. Ist von einer abgebrochenen Löschung noch etwas übrig, werden zuerst die Kunden
// gelöscht, damit keine alten Kunden wieder auftauchen. Der Firebase-Nutzer bleibt: Der Admin meldet sich gerade damit an.
export async function legeCoachAn(uid: string, email: string, heute: string): Promise<void> {
  const alt = await coaches().doc(uid).get();
  if (alt.exists && alt.data()!.geloeschtAm) await loescheKundenVon(uid);
  await coaches().doc(uid).set({ email, angelegtAm: heute, geloeschtAm: FieldValue.delete() }, { merge: true });
}

// Der Coach stimmt der aktuellen AVV-Fassung zu. Fehlt sein Eintrag (Löschung), schlägt das fehl statt ihn neu anzulegen.
export async function speichereAvvZustimmung(uid: string): Promise<void> {
  await coaches().doc(uid).update({ avvFassung: AVV_FASSUNG, avvAm: new Date().toISOString() });
}

// Löscht ein Coach-Konto vollständig. Reihenfolge, damit ein Abbruch mittendrin nichts kaputt macht und
// ein erneuter Aufruf den Rest erledigt: zuerst den Eintrag markieren (dann gilt die Sitzung nicht mehr und kein
// Kunde kann mehr angelegt werden), dann Kunden mit Check-ins, Firebase-Nutzer, Coach-Eintrag, zuletzt der Code.
export async function loescheCoachKonto(uid: string): Promise<void> {
  const eintrag = coaches().doc(uid);
  const vorhanden = await eintrag.get();
  if (vorhanden.exists && !vorhanden.data()!.geloeschtAm) {
    await eintrag.update({ geloeschtAm: new Date().toISOString() });
  }
  await loescheKundenVon(uid);
  try {
    await anmeldeDienst().deleteUser(uid);
  } catch (fehler) {
    // Ein schon fehlender Nutzer ist kein Problem, alles andere schon
    if ((fehler as { code?: string }).code !== "auth/user-not-found") throw fehler;
  }
  await eintrag.delete();
  const codes = await einladungen().where("eingeloestVon", "==", uid).get();
  await Promise.all(
    codes.docs.map((c) =>
      c.ref.update({ eingeloestVon: FieldValue.delete(), vermerk: FieldValue.delete(), kontoGeloescht: true }),
    ),
  );
}

// ---------- Einladungscodes ----------

export type Einladung = {
  code: string;
  vermerk: string;
  erstelltAm: string;
  eingeloestAm: string | null;
  kontoGeloescht: boolean;
};

// Ohne leicht verwechselbare Zeichen (0/O, 1/I/L)
const CODE_ZEICHEN = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_FORMAT = /^[A-HJKMNP-Z2-9]{10}$/;

// "abcde-fghjk" und "ABCDE FGHJK" gelten beide als "ABCDEFGHJK"
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
    kontoGeloescht: d.data().kontoGeloescht === true,
  }));
}

// Zu welchem Coach-Konto gehört ein eingelöster Code? Null bei offenen Codes und bei schon gelöschten Konten.
export async function coachZuCode(code: string): Promise<string | null> {
  if (!CODE_FORMAT.test(code)) return null;
  const uid = (await einladungen().doc(code).get()).data()?.eingeloestVon;
  return typeof uid === "string" ? uid : null;
}

export async function erzeugeEinladung(vermerk: string, heute: string): Promise<void> {
  // 31 Zeichen, 10 Stellen: rund 800 Billionen Möglichkeiten. Kleine Schieflage durch "% 31" ist hier egal.
  const code = Array.from(randomBytes(10), (b) => CODE_ZEICHEN[b % CODE_ZEICHEN.length]).join("");
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
// Nur mit Zustimmung zum AVV aufrufen: Fassung und Zeitpunkt bestimmt der Server.
export async function loeseEinladungEin(eingabe: string, uid: string, email: string, heute: string): Promise<boolean> {
  const code = codeNormalisieren(eingabe);
  if (!CODE_FORMAT.test(code)) return false;
  return datenbank().runTransaction(async (t) => {
    const einladung = await t.get(einladungen().doc(code));
    if (!einladung.exists || einladung.data()!.eingeloestAm) return false;
    // Gibt es das Konto schon (auch zur Löschung markiert), wird nichts überschrieben und der Code bleibt offen
    if ((await t.get(coaches().doc(uid))).exists) return false;
    t.update(einladung.ref, { eingeloestAm: heute, eingeloestVon: uid });
    t.set(coaches().doc(uid), {
      email,
      angelegtAm: heute,
      code,
      avvFassung: AVV_FASSUNG,
      avvAm: new Date().toISOString(),
    });
    return true;
  });
}

// ---------- Link neu erzeugen, Export, Notizen ----------

// Persönlicher Link-Token eines eigenen Kunden
export async function tokenVon(id: string, coachId: string): Promise<string | null> {
  const d = await eigenerKunde(id, coachId);
  return d ? String(d.data()!.token) : null;
}

// Neuer Token für einen aktiven, eigenen Kunden. Der alte Link findet danach keinen Kunden mehr.
export async function erneuereToken(id: string, coachId: string): Promise<void> {
  const d = await eigenerKunde(id, coachId);
  if (d && !d.data()!.archiviert) await d.ref.update({ token: randomBytes(24).toString("base64url") });
}

// Alle Check-ins eines eigenen Kunden (ohne 12-Wochen-Grenze), für den Export
export async function alleCheckinsVon(id: string, coachId: string): Promise<Checkin[] | null> {
  const d = await eigenerKunde(id, coachId);
  if (!d) return null;
  const snap = await d.ref.collection("checkins").orderBy("woche").get();
  return snap.docs.map((c) => alsCheckin(d.id, c.data()));
}

// Private Notiz des Coaches. Bewusst nicht Teil von "Kunde": Sie soll nie zum Kunden-Link gelangen.
export async function notizVon(id: string, coachId: string): Promise<{ notiz: string; notizAm?: string }> {
  const d = await eigenerKunde(id, coachId);
  return { notiz: String(d?.data()!.notiz ?? ""), notizAm: d?.data()!.notizAm };
}

// Leerer Text löscht die Notiz
export async function speichereNotiz(id: string, coachId: string, notiz: string, zeitpunkt: string): Promise<boolean> {
  const d = await eigenerKunde(id, coachId);
  if (!d) return false;
  await d.ref.update(
    notiz ? { notiz, notizAm: zeitpunkt } : { notiz: FieldValue.delete(), notizAm: FieldValue.delete() },
  );
  return true;
}

// Wochenfokus setzen (leerer Text = leeren). Neue Fassung mit Zufalls-ID; in einer Transaktion, damit
// zwei gleichzeitige Änderungen die Fassungen nicht durcheinanderbringen.
export async function speichereFokus(id: string, coachId: string, text: string, heute: string): Promise<boolean> {
  if (!ID_FORMAT.test(id)) return false;
  return datenbank().runTransaction(async (t) => {
    const d = await t.get(kunden().doc(id));
    if (!d.exists || d.data()!.coachId !== coachId) return false;
    const neu = { text, gesetztAm: heute, id: randomBytes(9).toString("base64url") };
    t.update(d.ref, setzeFokus(alsKunde(d.id, d.data()!), neu));
    return true;
  });
}
