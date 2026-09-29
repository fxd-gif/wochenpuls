"use server";

import { redirect } from "next/navigation";
import {
  anmeldungEingerichtet,
  istAdminAdresse,
  sitzungBeenden,
  sitzungStarten,
} from "@/lib/server/anmeldung";
import {
  anmeldeDienst,
  coachEintragVorhanden,
  coachExistiert,
  legeCoachAn,
  loescheCoachKonto,
  loeschungOffen,
  loeseEinladungEin,
  onboardingErledigt,
} from "@/lib/server/datenbank";
import { berlinDatum } from "@/lib/woche";

export type AnmeldeErgebnis = { fehler: string; codeNoetig?: boolean };

const NICHT_MOEGLICH = "Die Anmeldung ist gerade nicht möglich. Bitte versuch es später noch einmal.";

// Ein abgewiesenes Google-Konto soll nicht als Firebase-Nutzer liegen bleiben. Gelöscht wird nur ein
// gerade erst entstandener Nutzer (jünger als 10 Minuten): So trifft es nie das Konto eines bestehenden Coaches.
async function neuenNutzerEntfernen(uid: string): Promise<void> {
  try {
    // Gibt es schon einen Coach-Eintrag (auch markiert) oder schlägt das Lesen fehl, wird nicht gelöscht
    if (await coachEintragVorhanden(uid)) return;
    const dienst = anmeldeDienst();
    const nutzer = await dienst.getUser(uid);
    if (Date.now() - new Date(nutzer.metadata.creationTime).getTime() < 10 * 60_000)
      await dienst.deleteUser(uid);
  } catch {
    // still ignorieren: der Nutzer bleibt dann höchstens liegen
  }
}

// Der Browser hat sich bei Google angemeldet und schickt den Nachweis (ID-Token), dazu evtl. einen Einladungscode.
export async function mitGoogleAnmelden(
  idToken: string,
  code: string,
  avvZugestimmt: boolean,
): Promise<AnmeldeErgebnis> {
  if (!anmeldungEingerichtet() || typeof idToken !== "string" || typeof code !== "string") {
    return { fehler: NICHT_MOEGLICH };
  }

  let konto;
  try {
    konto = await anmeldeDienst().verifyIdToken(idToken);
  } catch {
    return { fehler: "Die Anmeldung bei Google hat nicht geklappt. Bitte versuch es noch einmal." };
  }
  const email = konto.email ?? "";
  const heute = berlinDatum();
  let ziel = "/coach";

  try {
    // Eine abgebrochene Kontolöschung wird hier zu Ende geführt, statt das Konto wieder zu öffnen.
    // Der Admin braucht das nicht: legeCoachAn vollendet sie für ihn selbst.
    if (!istAdminAdresse(email, konto.email_verified) && (await loeschungOffen(konto.uid))) {
      await loescheCoachKonto(konto.uid);
      return {
        fehler: "Dein Konto wurde gelöscht. Für ein neues Konto brauchst du einen neuen Einladungscode.",
      };
    }

    let darfRein = await coachExistiert(konto.uid);
    if (!darfRein && istAdminAdresse(email, konto.email_verified)) {
      await legeCoachAn(konto.uid, email, heute);
      darfRein = true;
    }
    if (!darfRein && code.trim() && avvZugestimmt !== true) {
      await neuenNutzerEntfernen(konto.uid);
      return { fehler: "Bitte bestätige den Vertrag zur Auftragsverarbeitung.", codeNoetig: true };
    }
    if (!darfRein && code.trim()) {
      // false heißt auch: Das Konto gibt es inzwischen (z. B. zweiter Tab). Dann normal anmelden.
      darfRein =
        (await loeseEinladungEin(code.slice(0, 20), konto.uid, email, heute)) || (await coachExistiert(konto.uid));
      if (!darfRein) {
        await neuenNutzerEntfernen(konto.uid);
        return { fehler: "Dieser Einladungscode ist ungültig oder wurde schon benutzt.", codeNoetig: true };
      }
    }
    if (!darfRein) {
      await neuenNutzerEntfernen(konto.uid);
      return {
        fehler: `Für ${email || "dieses Google-Konto"} gibt es noch kein Coach-Konto. Gib unten deinen Einladungscode ein und melde dich noch einmal an.`,
        codeNoetig: true,
      };
    }

    await sitzungStarten(idToken);
    // Solange die Einführung nicht erledigt ist, führt die Anmeldung dorthin. Lässt sich das nicht lesen: normal weiter.
    try {
      if (!(await onboardingErledigt(konto.uid))) ziel = "/coach/willkommen";
    } catch {
      // ziel bleibt /coach
    }
  } catch {
    return { fehler: NICHT_MOEGLICH };
  }
  redirect(ziel); // bewusst außerhalb von try: redirect wirft intern eine Ausnahme
}

export async function abmelden(): Promise<void> {
  await sitzungBeenden();
  redirect("/login");
}
