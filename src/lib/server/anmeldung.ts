import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { anmeldeDienst, coachExistiert, datenbankEingerichtet } from "./datenbank";

// Coach-Login mit Google (Firebase Authentication).
// Ablauf: Der Browser meldet sich bei Google an und schickt den Nachweis (ID-Token) an den Server.
// Der Server prüft ihn und tauscht ihn gegen ein Sitzungs-Cookie, das Firebase unterschreibt.
// Wer Coach ist, steht in Firestore unter coaches/{uid}; die Admin-Adresse (ADMIN_EMAIL) darf
// zusätzlich Einladungscodes verwalten.

const COOKIE = "wochenpuls-coach";
const GUELTIG_TAGE = 14; // Firebase erlaubt höchstens 14 Tage

export type Coach = { uid: string; email: string; istAdmin: boolean };

export function googleAnmeldungEingerichtet(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  );
}

export function anmeldungEingerichtet(): boolean {
  return datenbankEingerichtet() && googleAnmeldungEingerichtet();
}

export function adminEingerichtet(): boolean {
  return Boolean(process.env.ADMIN_EMAIL?.trim());
}

export function istAdminAdresse(email: string | undefined, bestaetigt: boolean | undefined): boolean {
  const admin = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return Boolean(admin && bestaetigt && email?.toLowerCase() === admin);
}

export async function sitzungStarten(idToken: string): Promise<void> {
  const dauer = GUELTIG_TAGE * 86_400_000;
  const wert = await anmeldeDienst().createSessionCookie(idToken, { expiresIn: dauer });
  (await cookies()).set(COOKIE, wert, {
    httpOnly: true, // für JavaScript im Browser unsichtbar
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: dauer / 1000,
  });
}

export async function sitzungBeenden(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

// Einmal pro Seitenaufruf geprüft (cache), auch wenn Layout und Seite beide fragen.
// Gesperrt wird ein Coach, indem man seinen Eintrag unter "coaches" löscht: dann greift die Sitzung sofort nicht mehr.
export const aktuellerCoach = cache(async (): Promise<Coach | null> => {
  const wert = (await cookies()).get(COOKIE)?.value; // zuerst: macht die Seite immer dynamisch
  if (!wert || !anmeldungEingerichtet()) return null;
  try {
    const daten = await anmeldeDienst().verifySessionCookie(wert);
    const email = daten.email ?? "";
    const admin = istAdminAdresse(email, daten.email_verified);
    if (!admin && !(await coachExistiert(daten.uid))) return null;
    return { uid: daten.uid, email, istAdmin: admin };
  } catch {
    return null; // abgelaufen oder ungültig
  }
});

export async function istAngemeldet(): Promise<boolean> {
  return (await aktuellerCoach()) !== null;
}

// Am Anfang jeder Coach-Seite und jeder Coach-Aktion aufrufen
export async function anmeldungPruefen(): Promise<Coach> {
  const coach = await aktuellerCoach();
  if (!coach) redirect("/login");
  return coach;
}
