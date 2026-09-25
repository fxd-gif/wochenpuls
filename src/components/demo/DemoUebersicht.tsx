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
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="auf-farbe flex flex-col gap-4 rounded-lg bg-primaer p-6 text-weiss sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-3 text-lg font-semibold">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-weiss text-primaer">
              <UserRound size={22} strokeWidth={2.5} aria-hidden="true" />
            </span>
            {daten.mitDu
              ? "Du bist jetzt in der Übersicht: Such die Karte „Du“."
              : "Probier es selbst: Fülle den Check-in als Kunde aus und sieh dich hier in der Ampel."}
          </p>
          <ButtonLink href="/demo/checkin" variante="hell" className="shrink-0">
            {daten.mitDu ? "Nochmal ausfüllen" : "Check-in ausfüllen"}
            <ArrowRight size={20} strokeWidth={2.5} aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
      <Uebersicht kunden={daten.kunden} checkins={daten.checkins} heute={daten.heute} basis="/demo" />
    </>
  );
}
