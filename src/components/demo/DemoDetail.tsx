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
      <div className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-3xl font-bold">Diesen Kunden gibt es nicht.</h1>
        <ButtonLink href="/demo" className="mt-6">
          Zur Übersicht
        </ButtonLink>
      </div>
    );
  }
  return <KundenDetail kunde={kunde} checkins={checkins} heute={heute} basis="/demo" />;
}
