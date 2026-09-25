"use client";

import { Uebersicht } from "@/components/coach/Uebersicht";
import { demoDaten } from "@/demo/demoDaten";
import { useHeute } from "@/lib/useHeute";

export function DemoUebersicht() {
  const heute = useHeute();
  if (!heute) return null;
  const { kunden, checkins } = demoDaten(heute);
  return <Uebersicht kunden={kunden} checkins={checkins} />;
}
