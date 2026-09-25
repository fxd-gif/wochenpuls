import { ArrowLeft, MessageCircleQuestion } from "lucide-react";
import Link from "next/link";
import { AmpelMarke } from "@/components/AmpelMarke";
import { WochenZahlen } from "@/components/checkin/WochenZahlen";
import { bewerte } from "@/lib/ampel";
import type { Checkin, Kunde } from "@/lib/checkin";
import { datumKurz } from "@/lib/woche";
import { Verlauf } from "./Verlauf";

// Detailseite eines Kunden. Funktioniert für Demo und echte Daten gleich.
export function KundenDetail({
  kunde,
  checkins,
  heute,
  basis,
}: {
  kunde: Kunde;
  checkins: Checkin[];
  heute: string;
  basis: string;
}) {
  const ampel = bewerte(kunde, checkins, heute);
  const eigene = checkins
    .filter((c) => c.kundeId === kunde.id)
    .sort((a, b) => a.woche.localeCompare(b.woche));
  const letzter = ampel.letzter;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Link
        href={basis}
        className="inline-flex items-center gap-2 font-semibold text-primaer hover:underline hover:underline-offset-4"
      >
        <ArrowLeft size={18} strokeWidth={2.5} aria-hidden="true" />
        Alle Kunden
      </Link>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight">{kunde.name}</h1>
          <p className="mt-2 text-leise">Dabei seit {datumKurz(kunde.angelegtAm)}</p>
        </div>
        <AmpelMarke stufe={ampel.stufe} gross />
      </div>

      {/* Warum diese Farbe? */}
      <section className="mt-8 rounded-lg bg-weiss p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-leise">
          {ampel.gruende.length > 1 ? "Gründe" : "Grund"}
        </h2>
        <ul className="mt-3 space-y-2">
          {ampel.gruende.map((grund) => (
            <li key={grund} className="text-xl font-semibold leading-snug">
              {grund}
            </li>
          ))}
        </ul>
      </section>

      {letzter ? (
        <section className="mt-6 rounded-lg bg-weiss p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-leise">
            Letzter Check-in · Woche bis {datumKurz(letzter.woche)}
          </h2>
          <div className="mt-4">
            <WochenZahlen eingabe={letzter} />
          </div>
          <dl className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <dt className="font-bold">Größter Erfolg</dt>
              <dd className="mt-1 text-lg leading-relaxed">{letzter.erfolg}</dd>
            </div>
            <div>
              <dt className="font-bold">Größte Hürde</dt>
              <dd className="mt-1 text-lg leading-relaxed">{letzter.huerde}</dd>
            </div>
          </dl>
          {letzter.frage && (
            <div className="mt-6 rounded-md bg-primaer-hell p-5">
              <p className="flex items-center gap-2 font-bold text-primaer">
                <MessageCircleQuestion size={20} strokeWidth={2.5} aria-hidden="true" />
                Frage an dich
              </p>
              <p className="mt-2 text-lg leading-relaxed">{letzter.frage}</p>
            </div>
          )}
        </section>
      ) : (
        <p className="mt-6 rounded-lg bg-weiss p-6 text-lg">Noch kein Check-in.</p>
      )}

      {eigene.length > 0 && <Verlauf checkins={eigene} heute={heute} />}

      {eigene.length > 0 && (
        <section className="mt-6 rounded-lg bg-weiss p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-leise">Trainings pro Woche</h2>
          <ol className="mt-4 space-y-2">
            {eigene
              .slice(-8)
              .reverse()
              .map((c) => (
                <li key={c.woche} className="flex items-center gap-4">
                  <span className="w-24 shrink-0 text-sm text-leise">{datumKurz(c.woche)}</span>
                  <span className="flex flex-1 gap-1" aria-hidden="true">
                    {Array.from({ length: Math.max(c.trainingsGeplant, c.trainingsGeschafft) }, (_, i) => (
                      <span
                        key={i}
                        className={`h-3 flex-1 rounded-sm ${i < c.trainingsGeschafft ? "bg-primaer" : "bg-flaeche-dunkel"}`}
                      />
                    ))}
                  </span>
                  <span className="w-14 text-right font-semibold tabular-nums">
                    {c.trainingsGeschafft} / {c.trainingsGeplant}
                  </span>
                </li>
              ))}
          </ol>
        </section>
      )}
    </div>
  );
}
