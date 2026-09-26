"use client";

import { ArrowRight, UserRound } from "lucide-react";
import { Uebersicht } from "@/components/coach/Uebersicht";
import { ButtonLink } from "@/components/ui/Button";
import { useDemoDaten } from "@/demo/useDemoDaten";

export function DemoUebersicht() {
  const daten = useDemoDaten();
  if (!daten) return null;

  return (
    <>
      {/* Einladung zum Mitmachen */}
      <div className="mx-auto max-w-7xl px-5 pt-8 lg:px-8">
        <div className="flex flex-col gap-4 rounded-panel border border-akzent/25 bg-akzent/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-3 text-[15px] font-medium">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-akzent/30 bg-flaeche-hoch text-akzent">
              <UserRound size={19} strokeWidth={1.75} aria-hidden="true" />
            </span>
            {daten.mitDu
              ? "Du bist jetzt in der Übersicht: Such die Karte „Du“."
              : "Probier es selbst: Fülle den Check-in als Kunde aus und sieh dich hier in der Ampel."}
          </p>
          <ButtonLink href="/demo/checkin" groesse="klein" className="shrink-0">
            {daten.mitDu ? "Nochmal ausfüllen" : "Check-in ausfüllen"}
            <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
      <Uebersicht kunden={daten.kunden} checkins={daten.checkins} heute={daten.heute} basis="/demo" />
    </>
  );
}
