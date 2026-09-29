"use server";

import { redirect } from "next/navigation";
import { anmeldungEingerichtet, istAdminAdresse, sitzungBeenden, sitzungStarten } from "@/lib/server/anmeldung";
import { anmeldeDienst, coachExistiert, legeCoachAn, loeseEinladungEin } from "@/lib/server/datenbank";
import { berlinDatum } from "@/lib/woche";

export type AnmeldeErgebnis = { fehler: string; codeNoetig?: boolean };

// Der Browser hat sich bei Google angemeldet und schickt den Nachweis (ID-Token), dazu evtl. einen Einladungscode.
export async function mitGoogleAnmelden(idToken: string, code: string): Promise<AnmeldeErgebnis> {
  if (!anmeldungEingerichtet() || typeof idToken !== "string" || typeof code !== "string") {
    return { fehler: "Die Anmeldung ist gerade nicht möglich. Bitte versuch es später noch einmal." };
  }

  let konto;
  try {
    konto = await anmeldeDienst().verifyIdToken(idToken);
  } catch {
    return { fehler: "Die Anmeldung bei Google hat nicht geklappt. Bitte versuch es noch einmal." };
  }
  const email = konto.email ?? "";
  const heute = berlinDatum();

  let darfRein = await coachExistiert(konto.uid);
  if (!darfRein && istAdminAdresse(email, konto.email_verified)) {
    await legeCoachAn(konto.uid, email, heute);
    darfRein = true;
  }
  if (!darfRein && code.trim()) {
    darfRein = await loeseEinladungEin(code.slice(0, 20), konto.uid, email, heute);
    if (!darfRein) {
      return { fehler: "Dieser Einladungscode ist ungültig oder wurde schon benutzt.", codeNoetig: true };
    }
  }
  if (!darfRein) {
    return {
      fehler: `Für ${email || "dieses Google-Konto"} gibt es noch kein Coach-Konto. Gib unten deinen Einladungscode ein und melde dich noch einmal an.`,
      codeNoetig: true,
    };
  }

  await sitzungStarten(idToken);
  redirect("/coach");
}

export async function abmelden(): Promise<void> {
  await sitzungBeenden();
  redirect("/login");
}
