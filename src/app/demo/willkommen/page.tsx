import type { Metadata } from "next";
import { CoachKopf } from "@/components/coach/CoachKopf";
import { Einfuehrung } from "@/components/coach/Einfuehrung";
import { DemoBanner } from "@/components/demo/DemoBanner";

export const metadata: Metadata = { title: "Einführung · Wochenpuls Demo" };

export default function DemoWillkommenSeite() {
  return (
    <main className="flex-1">
      <DemoBanner />
      <CoachKopf basis="/demo" etikett="Demo" />
      <Einfuehrung fertigZiel="/demo/kunden" ueberspringenZiel="/demo" />
    </main>
  );
}
