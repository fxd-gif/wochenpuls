import type { Metadata } from "next";
import { DemoBanner } from "@/components/demo/DemoBanner";
import { DemoCheckin } from "@/components/demo/DemoCheckin";

export const metadata: Metadata = {
  title: "Check-in · Wochenpuls Demo",
};

export default function DemoCheckinSeite() {
  return (
    <main>
      <DemoBanner />
      <DemoCheckin />
    </main>
  );
}
