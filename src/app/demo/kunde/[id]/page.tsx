import type { Metadata } from "next";
import { CoachKopf } from "@/components/coach/CoachKopf";
import { DemoBanner } from "@/components/demo/DemoBanner";
import { DemoDetail } from "@/components/demo/DemoDetail";

export const metadata: Metadata = {
  title: "Kunde · Wochenpuls Demo",
};

export default async function DemoKundeSeite({ params }: PageProps<"/demo/kunde/[id]">) {
  const { id } = await params;
  return (
    <main className="min-h-screen bg-flaeche">
      <DemoBanner />
      <CoachKopf basis="/demo" />
      <DemoDetail id={id} />
    </main>
  );
}
