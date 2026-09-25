import type { Metadata } from "next";
import { CoachKopf } from "@/components/coach/CoachKopf";
import { DemoBanner } from "@/components/demo/DemoBanner";
import { DemoUebersicht } from "@/components/demo/DemoUebersicht";

export const metadata: Metadata = {
  title: "Coach-Übersicht · Wochenpuls Demo",
};

export default function DemoSeite() {
  return (
    <main className="min-h-screen bg-flaeche">
      <DemoBanner />
      <CoachKopf basis="/demo" />
      <DemoUebersicht />
    </main>
  );
}
