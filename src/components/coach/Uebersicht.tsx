import { Abschnittskopf } from "@/components/ui/Abschnittskopf";
import { ButtonLink } from "@/components/ui/Button";
import type { Checkin, Kunde } from "@/lib/checkin";
import { ordneUebersicht } from "@/lib/uebersicht";
import { checkinWoche, datumKurz } from "@/lib/woche";
import { KundenFilter } from "./KundenFilter";

// Alle Kunden auf einer Seite, Rot zuerst. Funktioniert für Demo und echte Daten gleich.
export function Uebersicht({
  kunden,
  checkins,
  heute,
  basis,
}: {
  kunden: Kunde[];
  checkins: Checkin[];
  heute: string;
  basis: string; // "/demo" oder "/coach"
}) {
  const { bewertet: eintraege, widerrufen } = ordneUebersicht(kunden, checkins, heute);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      <Abschnittskopf
        ebene="h1"
        seitlich
        kicker={`Woche bis ${datumKurz(checkinWoche(heute))}`}
        titel="Deine Kunden"
        text="Rot steht oben. Jede Karte sagt in einem Satz, warum sie diese Farbe hat. Tipp auf eine Farbe, um nur diese zu sehen."
      />

      <KundenFilter eintraege={eintraege} widerrufen={widerrufen} basis={basis} />

      {eintraege.length === 0 && widerrufen.length === 0 && (
        <div className="rounded-panel border border-linie bg-flaeche p-8">
          <p className="font-serif text-2xl">Noch keine Kunden.</p>
          <p className="mt-2 text-text-zwei">
            Leg deinen ersten Kunden an und schick ihm seinen persönlichen Link.
          </p>
          <ButtonLink href={`${basis}/kunden`} className="mt-6">
            Kunden anlegen
          </ButtonLink>
        </div>
      )}
    </div>
  );
}
