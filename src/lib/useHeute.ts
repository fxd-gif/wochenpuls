"use client";

import { useSyncExternalStore } from "react";
import { berlinDatum } from "./woche";

const nieAendern = () => () => {};

// Heutiges Datum, erst im Browser bekannt (auf dem Server: null).
// So entstehen die Demo-Daten immer passend zum Tag, an dem jemand die Seite öffnet.
export function useHeute(): string | null {
  return useSyncExternalStore(
    nieAendern,
    () => berlinDatum(),
    () => null,
  );
}
