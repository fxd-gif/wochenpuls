import type { Metadata } from "next";
import { CoachKopf } from "@/components/coach/CoachKopf";
import { DemoBanner } from "@/components/demo/DemoBanner";
import { DemoVerwaltung } from "@/components/demo/DemoVerwaltung";

export const metadata: Metadata = {
  title: "Kunden verwalten · Wochenpuls Demo",
};

export default function DemoKundenSeite() {
  return (
    <main className="min-h-screen bg-flaeche">
      <DemoBanner />
      <CoachKopf basis="/demo" />
      <DemoVerwaltung />
    </main>
  );
}
