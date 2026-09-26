"use client";

import { KundenDetail } from "@/components/coach/KundenDetail";
import { ButtonLink } from "@/components/ui/Button";
import { useDemoDaten } from "@/demo/useDemoDaten";

export function DemoDetail({ id }: { id: string }) {
  const daten = useDemoDaten();
  if (!daten) return null;
  const { heute, kunden, checkins } = daten;
  const kunde = kunden.find((k) => k.id === id);
  if (!kunde) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
        <h1 className="font-serif text-4xl">Diesen Kunden gibt es nicht.</h1>
        <ButtonLink href="/demo" className="mt-6">
          Zur Übersicht
        </ButtonLink>
      </div>
    );
  }
  return <KundenDetail kunde={kunde} checkins={checkins} heute={heute} basis="/demo" />;
}
