"use client";

import { KundenVerwaltung } from "@/components/coach/KundenVerwaltung";
import { useDemoDaten } from "@/demo/useDemoDaten";

export function DemoVerwaltung() {
  const daten = useDemoDaten();
  if (!daten) return null;
  return <KundenVerwaltung kunden={daten.kunden.filter((k) => k.id !== "du")} />;
}
