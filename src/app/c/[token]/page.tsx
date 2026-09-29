import type { Metadata } from "next";
import { Hinweisseite } from "@/components/ui/Hinweisseite";
import { EINWILLIGUNG_FASSUNG } from "@/lib/rechtstexte";
import { datenbankEingerichtet, kundeMitToken } from "@/lib/server/datenbank";
import { berlinDatum, checkinWoche, geltenderFokus } from "@/lib/woche";
import { ArchiviertWiderruf } from "./ArchiviertWiderruf";
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
      <>
        <Hinweisseite kicker="Wochen-Check-in" titel="Dieser Link ist nicht aktiv.">
          Bitte frag deinen Coach nach deinem aktuellen Check-in-Link.
        </Hinweisseite>
        {/* Archivierte Kunden können ihre gespeicherte Einwilligung trotzdem widerrufen */}
        {kunde?.einwilligungFassung && <ArchiviertWiderruf token={token} />}
      </>
    );
  }

  // Der Kunde sieht nur seinen Vornamen und ein leeres Formular, keine früheren Daten.
  // Ist die Einwilligung nicht in der aktuellen Fassung gespeichert, kommt das Häkchen dazu.
  // Gilt für seine laufende Woche ein Fokus? Nur Kennung und Text gehen an den Browser.
  const fokus = geltenderFokus([kunde.fokus, kunde.fokusVorher], checkinWoche(berlinDatum()));
  return (
    <main className="flex-1">
      <EchterCheckin
        token={token}
        vorname={kunde.name}
        fokus={fokus ? { id: fokus.id, text: fokus.text } : undefined}
        hatEinwilligung={kunde.einwilligungFassung === EINWILLIGUNG_FASSUNG}
        widerrufen={Boolean(kunde.widerrufenAm)}
      />
    </main>
  );
}
