// Die Ampel: WANN bekommt ein Kunde welche Farbe, und WARUM.
// Alle Schwellenwerte stehen hier oben und können direkt geändert werden.
import type { AmpelStufe } from "@/components/AmpelMarke";
import type { Checkin, Kunde, SkalaSchluessel } from "./checkin";
import { checkinWoche, tageZwischen, ueberfaelligeTage } from "./woche";

export const REGELN = {
  rotAbTagenUeberfaellig: 3, // ab so vielen Tagen überfällig: Rot
  gelbAbTagenUeberfaellig: 1, // ab so vielen Tagen überfällig: Gelb
  trainingsAnteilRot: 0.5, // weniger als dieser Anteil der geplanten Trainings: Rot
  tiefpunkt: 2, // Energie, Schlaf oder Motivation so niedrig oder niedriger: Gelb
  stressMaximum: 5, // Stress so hoch oder höher: Gelb
  einbruchPunkte: 2, // so viele Punkte schlechter als der eigene Schnitt: Gelb
  einbruchVergleichWochen: 3, // Schnitt über so viele vorherige Check-ins
  einbruchMindestWochen: 2, // Einbruch erst prüfen, wenn es so viele vorherige Check-ins gibt
};

const namen: Record<SkalaSchluessel, string> = {
  energie: "Energie",
  schlaf: "Schlaf",
  stress: "Stress",
  motivation: "Motivation",
};

export type AmpelErgebnis = {
  stufe: AmpelStufe;
  gruende: string[]; // wichtigster Grund zuerst
  offen: boolean; // für die aktuelle Woche liegt noch kein Check-in vor
  frage: string; // Frage aus dem letzten Check-in (leer = keine)
  letzter?: Checkin;
};

const komma = (zahl: number) => zahl.toLocaleString("de-DE", { maximumFractionDigits: 1 });
const tageText = (tage: number) => (tage === 1 ? "seit gestern" : `seit ${tage} Tagen`);

// "checkins" dürfen von allen Kunden stammen; gezählt werden nur die eigenen.
export function bewerte(kunde: Kunde, checkins: Checkin[], heute: string): AmpelErgebnis {
  const eigene = checkins
    .filter((c) => c.kundeId === kunde.id)
    .sort((a, b) => a.woche.localeCompare(b.woche));
  const letzter = eigene.at(-1);
  const vorletzter = eigene.at(-2);
  const offen = !eigene.some((c) => c.woche === checkinWoche(heute));
  const ueberfaellig = ueberfaelligeTage(kunde.angelegtAm, letzter?.woche, heute);

  const rot: string[] = [];
  const gelb: string[] = [];

  // Überfällig
  if (ueberfaellig >= REGELN.rotAbTagenUeberfaellig)
    rot.push(`Check-in ${tageText(ueberfaellig)} überfällig`);
  else if (ueberfaellig >= REGELN.gelbAbTagenUeberfaellig)
    gelb.push(`Check-in ${tageText(ueberfaellig)} überfällig`);

  if (letzter) {
    // Weniger als die Hälfte der geplanten Trainings (nur wenn überhaupt etwas geplant war)
    const { trainingsGeplant: geplant, trainingsGeschafft: geschafft } = letzter;
    if (geplant >= 1 && geschafft < geplant * REGELN.trainingsAnteilRot) {
      rot.push(`Nur ${geschafft} von ${geplant} Trainings geschafft`);
    }

    // Energie oder Motivation zwei Wochen direkt hintereinander niedrig
    const direktDavor = vorletzter && tageZwischen(vorletzter.woche, letzter.woche) === 7;
    const zweiWochenTief = new Set<SkalaSchluessel>();
    for (const wert of ["energie", "motivation"] as const) {
      if (direktDavor && vorletzter[wert] <= REGELN.tiefpunkt && letzter[wert] <= REGELN.tiefpunkt) {
        zweiWochenTief.add(wert);
        rot.push(`${namen[wert]} zwei Wochen in Folge niedrig (${vorletzter[wert]} → ${letzter[wert]})`);
      }
    }

    // Deutlicher Einbruch gegenüber dem eigenen Schnitt (bei Stress: deutlicher Anstieg)
    const vorher = eigene.slice(0, -1).slice(-REGELN.einbruchVergleichWochen);
    const eingebrochen = new Set<SkalaSchluessel>();
    if (vorher.length >= REGELN.einbruchMindestWochen) {
      for (const wert of ["energie", "schlaf", "stress", "motivation"] as const) {
        if (zweiWochenTief.has(wert)) continue;
        const schnitt = vorher.reduce((summe, c) => summe + c[wert], 0) / vorher.length;
        const schlechter = wert === "stress" ? letzter[wert] - schnitt : schnitt - letzter[wert];
        if (schlechter >= REGELN.einbruchPunkte) {
          eingebrochen.add(wert);
          gelb.push(
            wert === "stress"
              ? `Stress deutlich höher als sonst (${letzter[wert]} statt Ø ${komma(schnitt)})`
              : `${namen[wert]} deutlich schlechter als sonst (${letzter[wert]} statt Ø ${komma(schnitt)})`,
          );
        }
      }
    }

    // Einzelner Wert im schlechtesten Bereich
    for (const wert of ["energie", "schlaf", "motivation"] as const) {
      if (letzter[wert] <= REGELN.tiefpunkt && !zweiWochenTief.has(wert) && !eingebrochen.has(wert)) {
        gelb.push(`${namen[wert]} diese Woche sehr niedrig (${letzter[wert]})`);
      }
    }
    if (letzter.stress >= REGELN.stressMaximum && !eingebrochen.has("stress")) {
      gelb.push(`Stress diese Woche sehr hoch (${letzter.stress})`);
    }
  }

  const gruende = [...rot, ...gelb];
  const frage = letzter?.frage ?? "";
  if (rot.length) return { stufe: "rot", gruende, offen, frage, letzter };
  if (gelb.length) return { stufe: "gelb", gruende, offen, frage, letzter };
  if (!letzter) return { stufe: "neu", gruende: ["Wartet auf den ersten Check-in"], offen, frage, letzter };
  return { stufe: "gruen", gruende: ["Alles im grünen Bereich"], offen, frage, letzter };
}

const reihenfolge: Record<AmpelStufe, number> = { rot: 0, gelb: 1, neu: 2, gruen: 3 };

// Rot zuerst, dann Gelb, Neu, Grün. Innerhalb einer Stufe alphabetisch.
export function sortiereNachAmpel<T extends { kunde: Kunde; ampel: AmpelErgebnis }>(eintraege: T[]): T[] {
  return [...eintraege].sort(
    (a, b) =>
      reihenfolge[a.ampel.stufe] - reihenfolge[b.ampel.stufe] ||
      a.kunde.name.localeCompare(b.kunde.name, "de"),
  );
}
