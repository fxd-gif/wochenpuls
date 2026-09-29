import type { Metadata } from "next";
import { Einfuehrung } from "@/components/coach/Einfuehrung";
import { anmeldungPruefen } from "@/lib/server/anmeldung";
import { onboardingAbschliessen } from "../aktionen";

export const metadata: Metadata = { title: "Willkommen · Wochenpuls", robots: { index: false } };

export default async function WillkommenSeite() {
  await anmeldungPruefen();
  return (
    <Einfuehrung fertigZiel="/coach/kunden" ueberspringenZiel="/coach" speichern={onboardingAbschliessen} />
  );
}
