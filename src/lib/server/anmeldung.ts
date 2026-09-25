import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Coach-Login mit einem einzigen Passwort (COACH_PASSWORD).
// Nach dem Login bekommt der Browser ein Cookie, das mit SESSION_SECRET unterschrieben ist.
// Fälschen geht nicht ohne das Secret. Wird das Passwort geändert, sind alle alten Cookies ungültig.

const COOKIE = "wochenpuls-sitzung";
const GUELTIG_TAGE = 14;

export function anmeldungEingerichtet(): boolean {
  return Boolean(process.env.COACH_PASSWORD) && (process.env.SESSION_SECRET?.length ?? 0) >= 32;
}

// Vergleich in immer gleicher Zeit, damit man das Passwort nicht über Zeitmessung erraten kann
function gleich(a: string, b: string): boolean {
  return timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
}

function unterschrift(ablauf: string): string {
  return createHmac("sha256", process.env.SESSION_SECRET!)
    .update(`${ablauf}.${process.env.COACH_PASSWORD}`)
    .digest("base64url");
}

export function passwortStimmt(eingabe: string): boolean {
  return anmeldungEingerichtet() && gleich(eingabe, process.env.COACH_PASSWORD!);
}

export async function sitzungStarten(): Promise<void> {
  const ablauf = String(Date.now() + GUELTIG_TAGE * 86_400_000);
  (await cookies()).set(COOKIE, `${ablauf}.${unterschrift(ablauf)}`, {
    httpOnly: true, // für JavaScript im Browser unsichtbar
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: GUELTIG_TAGE * 86_400,
  });
}

export async function sitzungBeenden(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function istAngemeldet(): Promise<boolean> {
  if (!anmeldungEingerichtet()) return false;
  const wert = (await cookies()).get(COOKIE)?.value ?? "";
  const [ablauf, sig] = wert.split(".");
  if (!ablauf || !sig || Number(ablauf) < Date.now()) return false;
  return gleich(sig, unterschrift(ablauf));
}

// Am Anfang jeder Coach-Seite und jeder Coach-Aktion aufrufen
export async function anmeldungPruefen(): Promise<void> {
  if (!(await istAngemeldet())) redirect("/login");
}
