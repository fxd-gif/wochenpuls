// Alles, was ein Check-in enthält, und die Regeln fürs Ausfüllen.
// Wird vom Formular (Browser) und später auch vom Server benutzt.

export const MAX_TRAININGS = 14;
export const MAX_TEXTLAENGE = 500;

export type SkalaSchluessel = "energie" | "schlaf" | "stress" | "motivation";

export type CheckinEingabe = {
  trainingsGeplant: number;
  trainingsGeschafft: number;
  energie: number;
  schlaf: number;
  stress: number;
  motivation: number;
  erfolg: string;
  huerde: string;
  frage: string;
};

// Während des Ausfüllens dürfen Zahlen noch leer sein.
export type CheckinEntwurf = {
  [K in keyof CheckinEingabe]: CheckinEingabe[K] extends number ? number | null : string;
};

export const leererEntwurf: CheckinEntwurf = {
  trainingsGeplant: null,
  trainingsGeschafft: null,
  energie: null,
  schlaf: null,
  stress: null,
  motivation: null,
  erfolg: "",
  huerde: "",
  frage: "",
};

// Die vier Skalen. Bei Stress ist 5 schlecht, bei allen anderen gut.
export const skalen: {
  schluessel: SkalaSchluessel;
  frage: string;
  links: string;
  rechts: string;
}[] = [
  { schluessel: "energie", frage: "Wie war deine Energie?", links: "sehr niedrig", rechts: "sehr hoch" },
  { schluessel: "schlaf", frage: "Wie gut hast du geschlafen?", links: "sehr schlecht", rechts: "sehr gut" },
  { schluessel: "stress", frage: "Wie gestresst warst du?", links: "kaum", rechts: "sehr stark" },
  { schluessel: "motivation", frage: "Wie motiviert warst du?", links: "gar nicht", rechts: "sehr" },
];

export type Fehler = Partial<Record<keyof CheckinEingabe, string>>;

// Pflichtfelder in der Reihenfolge, in der sie im Formular stehen.
export const pflichtfelder: (keyof CheckinEingabe)[] = [
  "trainingsGeplant",
  "trainingsGeschafft",
  "energie",
  "schlaf",
  "stress",
  "motivation",
  "erfolg",
  "huerde",
];

export function istBeantwortet(entwurf: CheckinEntwurf, feld: keyof CheckinEingabe): boolean {
  const wert = entwurf[feld];
  return typeof wert === "number" || (typeof wert === "string" && wert.trim().length >= 2);
}

export function pruefeCheckin(entwurf: CheckinEntwurf): Fehler {
  const fehler: Fehler = {};

  for (const feld of ["trainingsGeplant", "trainingsGeschafft"] as const) {
    const wert = entwurf[feld];
    if (wert === null) {
      fehler[feld] = "Bitte gib eine Zahl an, auch wenn es 0 ist.";
    } else if (!Number.isInteger(wert) || wert < 0 || wert > MAX_TRAININGS) {
      fehler[feld] = `Bitte eine Zahl zwischen 0 und ${MAX_TRAININGS}.`;
    }
  }

  for (const { schluessel } of skalen) {
    const wert = entwurf[schluessel];
    if (wert === null || !Number.isInteger(wert) || wert < 1 || wert > 5) {
      fehler[schluessel] = "Bitte wähle einen Wert von 1 bis 5.";
    }
  }

  for (const feld of ["erfolg", "huerde"] as const) {
    if (entwurf[feld].trim().length < 2) {
      fehler[feld] = "Bitte schreib ein paar Worte dazu.";
    }
  }

  for (const feld of ["erfolg", "huerde", "frage"] as const) {
    if (entwurf[feld].length > MAX_TEXTLAENGE) {
      fehler[feld] = `Bitte höchstens ${MAX_TEXTLAENGE} Zeichen.`;
    }
  }

  return fehler;
}

// Nur aufrufen, wenn pruefeCheckin keine Fehler geliefert hat.
export function alsEingabe(entwurf: CheckinEntwurf): CheckinEingabe {
  return {
    trainingsGeplant: entwurf.trainingsGeplant ?? 0,
    trainingsGeschafft: entwurf.trainingsGeschafft ?? 0,
    energie: entwurf.energie ?? 0,
    schlaf: entwurf.schlaf ?? 0,
    stress: entwurf.stress ?? 0,
    motivation: entwurf.motivation ?? 0,
    erfolg: entwurf.erfolg.trim(),
    huerde: entwurf.huerde.trim(),
    frage: entwurf.frage.trim(),
  };
}
