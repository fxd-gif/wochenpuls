import { MessageCircleQuestion } from "lucide-react";
import Link from "next/link";
import { AmpelMarke, ampelStufen, type AmpelStufe } from "@/components/AmpelMarke";
import { bewerte, sortiereNachAmpel } from "@/lib/ampel";
import type { Checkin, Kunde } from "@/lib/checkin";
import { checkinWoche, datumKurz } from "@/lib/woche";

const streifen: Record<AmpelStufe, string> = {
  rot: "bg-ampel-rot",
  gelb: "bg-ampel-gelb",
  gruen: "bg-ampel-gruen",
  neu: "bg-ampel-neu",
};

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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <p className="text-sm font-semibold uppercase tracking-wider text-leise">
        Woche bis {datumKurz(checkinWoche(heute))}
      </p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">Deine Kunden</h1>

      {/* Zusammenfassung */}
      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["rot", "gelb", "neu", "gruen"] as const).map((stufe) => (
          <div key={stufe} className="flex items-center justify-between gap-2 rounded-lg bg-weiss p-3 sm:p-4">
            <dt>
              <AmpelMarke stufe={stufe} />
            </dt>
            <dd className="text-3xl font-extrabold tabular-nums">{anzahl(stufe)}</dd>
          </div>
        ))}
      </dl>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {eintraege.map(({ kunde, ampel }) => (
          <li key={kunde.id}>
            <Link
              href={`${basis}/kunde/${kunde.id}`}
              className="flex h-full flex-col overflow-hidden rounded-lg bg-weiss transition-all duration-200 hover:scale-[1.02]"
            >
              <div aria-hidden="true" className={`h-2 ${streifen[ampel.stufe]}`} />
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-2xl font-bold tracking-tight">{kunde.name}</h2>
                  <AmpelMarke stufe={ampel.stufe} />
                </div>
                <p className="mt-3 text-lg font-medium leading-snug">
                  <span className="sr-only">{ampelStufen[ampel.stufe].wort}: </span>
                  {ampel.gruende[0]}
                  {ampel.gruende.length > 1 && (
                    <span className="text-leise"> · +{ampel.gruende.length - 1} weitere</span>
                  )}
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-5 text-sm">
                  {ampel.offen && (
                    <span className="rounded-full bg-flaeche px-3 py-1 font-semibold">Check-in offen</span>
                  )}
                  {ampel.frage && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primaer-hell px-3 py-1 font-semibold text-primaer">
                      <MessageCircleQuestion size={16} strokeWidth={2.5} aria-hidden="true" />
                      Frage an dich
                    </span>
                  )}
                  <span className="ml-auto text-leise">
                    {ampel.letzter ? `Zuletzt ${datumKurz(ampel.letzter.woche)}` : "Noch kein Check-in"}
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
