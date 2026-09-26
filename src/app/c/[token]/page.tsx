import type { Metadata } from "next";
import { Hinweisseite } from "@/components/ui/Hinweisseite";
import { datenbankEingerichtet, kundeMitToken } from "@/lib/server/datenbank";
import { EchterCheckin } from "./EchterCheckin";

// Persönliche Links sollen nicht bei Google landen und nicht als "Herkunft" weitergegeben werden
export const metadata: Metadata = {
  title: "Wochen-Check-in",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function KundenCheckinSeite({ params }: PageProps<"/c/[token]">) {
  const { token } = await params;
  const kunde = datenbankEingerichtet() ? await kundeMitToken(token) : null;

  if (!kunde || kunde.archiviert) {
    return (
      <Hinweisseite kicker="Wochen-Check-in" titel="Dieser Link ist nicht aktiv.">
        Bitte frag deinen Coach nach deinem aktuellen Check-in-Link.
      </Hinweisseite>
    );
  }

  // Der Kunde sieht nur seinen Vornamen und ein leeres Formular, keine früheren Daten
  return (
    <main className="flex-1">
      <EchterCheckin token={token} vorname={kunde.name} />
    </main>
  );
}
