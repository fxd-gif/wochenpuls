"use client";

import { useSyncExternalStore } from "react";
import type { Checkin, CheckinEingabe, Kunde } from "@/lib/checkin";
import { useHeute } from "@/lib/useHeute";
import { berlinDatum, checkinWoche, plusTage } from "@/lib/woche";
import { demoDaten } from "./demoDaten";

// Der Demo-Check-in eines Besuchers ("Du") liegt nur im Speicher dieses Browser-Tabs.
// Er erreicht nie einen Server und ist weg, sobald der Tab geschlossen wird.
const SCHLUESSEL = "wochenpuls-demo-du";

type Gespeichert = CheckinEingabe & { datum: string };

function abonnieren(neuZeichnen: () => void) {
  window.addEventListener(SCHLUESSEL, neuZeichnen);
  return () => window.removeEventListener(SCHLUESSEL, neuZeichnen);
}

function lesen(): string | null {
  try {
    return sessionStorage.getItem(SCHLUESSEL);
  } catch {
    return null; // z. B. privater Modus mit gesperrtem Speicher
  }
}

export function speichereDemoCheckin(eingabe: CheckinEingabe) {
  const wert: Gespeichert = { ...eingabe, datum: berlinDatum() };
  try {
    sessionStorage.setItem(SCHLUESSEL, JSON.stringify(wert));
  } catch {
    // Speicher gesperrt: Die Demo funktioniert trotzdem, nur ohne "Du"
  }
  window.dispatchEvent(new Event(SCHLUESSEL));
}

// Demo-Daten für heute, plus "Du", falls der Besucher schon eingecheckt hat.
export function useDemoDaten(): {
  heute: string;
  kunden: Kunde[];
  checkins: Checkin[];
  mitDu: boolean;
} | null {
  const heute = useHeute();
  const gespeichert = useSyncExternalStore(abonnieren, lesen, () => null);
  if (!heute) return null;

  const { kunden, checkins } = demoDaten(heute);
  let mitDu = false;
  if (gespeichert) {
    try {
      const { datum, ...eingabe } = JSON.parse(gespeichert) as Gespeichert;
      kunden.push({ id: "du", name: "Du", angelegtAm: plusTage(heute, -21), archiviert: false });
      checkins.push({ ...eingabe, kundeId: "du", woche: checkinWoche(datum), eingereichtAm: datum });
      mitDu = true;
    } catch {
      // kaputter Eintrag: ignorieren
    }
  }
  return { heute, kunden, checkins, mitDu };
}
