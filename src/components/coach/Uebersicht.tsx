import { AmpelMarke, type AmpelStufe } from "@/components/AmpelMarke";
import { Abschnittskopf } from "@/components/ui/Abschnittskopf";
import { ButtonLink } from "@/components/ui/Button";
import { bewerte, sortiereNachAmpel } from "@/lib/ampel";
import type { Checkin, Kunde } from "@/lib/checkin";
import { checkinWoche, datumKurz } from "@/lib/woche";
import { KundenKarte } from "./KundenKarte";

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
  const eintraege = sortiereNachAmpel(
    kunden.filter((k) => !k.archiviert).map((kunde) => ({ kunde, ampel: bewerte(kunde, checkins, heute) })),
  );
  const anzahl = (stufe: AmpelStufe) => eintraege.filter((e) => e.ampel.stufe === stufe).length;

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      <Abschnittskopf
        ebene="h1"
        seitlich
        kicker={`Woche bis ${datumKurz(checkinWoche(heute))}`}
        titel="Deine Kunden"
        text="Rot steht oben. Jede Karte sagt in einem Satz, warum sie diese Farbe hat."
      />

      {/* Zusammenfassung */}
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["rot", "gelb", "neu", "gruen"] as const).map((stufe) => (
          <div
            key={stufe}
            className="flex items-center justify-between gap-2 rounded-panel border border-linie bg-flaeche px-4 py-3.5"
          >
            <dt>
              <AmpelMarke stufe={stufe} />
            </dt>
            <dd className="font-serif text-3xl leading-none tabular-nums">{anzahl(stufe)}</dd>
          </div>
        ))}
      </dl>

      {eintraege.length === 0 && (
        <div className="mt-8 rounded-panel border border-linie bg-flaeche p-8">
          <p className="font-serif text-2xl">Noch keine Kunden.</p>
          <p className="mt-2 text-text-zwei">
            Leg deinen ersten Kunden an und schick ihm seinen persönlichen Link.
          </p>
          <ButtonLink href={`${basis}/kunden`} className="mt-6">
            Kunden anlegen
          </ButtonLink>
        </div>
      )}

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {eintraege.map(({ kunde, ampel }) => (
          <li key={kunde.id}>
            <KundenKarte kunde={kunde} ampel={ampel} href={`${basis}/kunde/${kunde.id}`} ebene="h2" />
          </li>
        ))}
      </ul>
    </div>
  );
}
