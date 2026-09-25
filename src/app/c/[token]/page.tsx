import { Link2Off } from "lucide-react";
import type { Metadata } from "next";
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
      <main className="flex flex-1 items-center justify-center bg-flaeche px-4 py-16">
        <div className="w-full max-w-md rounded-lg bg-weiss p-8">
          <span className="flex size-12 items-center justify-center rounded-full bg-flaeche">
            <Link2Off size={24} strokeWidth={2.5} aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Dieser Link ist nicht aktiv.</h1>
          <p className="mt-3 text-lg leading-relaxed text-leise">
            Bitte frag deinen Coach nach deinem aktuellen Check-in-Link.
          </p>
        </div>
      </main>
    );
  }

  // Der Kunde sieht nur seinen Vornamen und ein leeres Formular, keine früheren Daten
  return (
    <main>
      <EchterCheckin token={token} vorname={kunde.name} />
    </main>
  );
}
