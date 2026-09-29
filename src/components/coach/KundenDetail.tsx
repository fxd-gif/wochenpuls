import { ArrowLeft, Download, MessageCircleQuestion, MessageSquareText } from "lucide-react";
import Link from "next/link";
import { AmpelMarke, ampelStufen } from "@/components/AmpelMarke";
import { WochenZahlen } from "@/components/checkin/WochenZahlen";
import { Kicker } from "@/components/ui/Abschnittskopf";
import { buttonKlassen } from "@/components/ui/Button";
import { mikroKlassen, panelKlassen } from "@/components/ui/stil";
import { bewerte } from "@/lib/ampel";
import { FOKUS_ANTWORTEN, type Checkin, type Kunde } from "@/lib/checkin";
import { whatsappLink } from "@/lib/whatsapp";
import { datumKurz, datumMitJahr } from "@/lib/woche";
import { Notizen } from "./Notizen";
import { Verlauf } from "./Verlauf";
import { Wochenfokus } from "./Wochenfokus";

// Detailseite eines Kunden. Funktioniert für Demo und echte Daten gleich.
export function KundenDetail({
  kunde,
  checkins,
  heute,
  basis,
  coach,
}: {
  kunde: Kunde;
  checkins: Checkin[];
  heute: string;
  basis: string;
  // Nur in der echten App: persönlicher Link (für die Erinnerung) und private Notiz. Fehlt in der Demo.
  coach?: { link: string; notiz: string };
}) {
  const ampel = bewerte(kunde, checkins, heute);
  const stil = ampelStufen[ampel.stufe];
  const eigene = checkins
    .filter((c) => c.kundeId === kunde.id)
    .sort((a, b) => a.woche.localeCompare(b.woche));
  const letzter = ampel.letzter;
  // Wie in ordneUebersicht: Wer widerrufen hat, bekommt keine Ampel
  const widerrufen = Boolean(kunde.widerrufenAm);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8 lg:py-14">
      <Link
        href={basis}
        className="inline-flex min-h-11 items-center gap-1.5 text-[13px] font-medium text-text-zwei transition-colors hover:text-text"
      >
        <ArrowLeft size={15} strokeWidth={2} aria-hidden="true" />
        Alle Kunden
      </Link>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-4 border-b border-linie pb-6">
        <div>
          <Kicker>Dabei seit {datumKurz(kunde.angelegtAm)}</Kicker>
          <h1 className="mt-2 font-serif text-5xl font-normal tracking-tight">{kunde.name}</h1>
        </div>
        {!widerrufen && <AmpelMarke stufe={ampel.stufe} gross />}
      </div>
      {/* Nur bei echten Daten: In der Demo gibt es keine Einwilligung */}
      {basis === "/coach" && (
        <p className="mt-4 text-[13px] text-text-zwei">
          {kunde.einwilligungAm
            ? `Einwilligung erteilt am ${datumMitJahr(kunde.einwilligungAm)} (Fassung ${kunde.einwilligungFassung})`
            : kunde.widerrufenAm
              ? `Einwilligung widerrufen am ${datumMitJahr(kunde.widerrufenAm)}`
              : "Noch keine Einwilligung"}
        </p>
      )}

      {coach && (
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
          {!kunde.archiviert && !widerrufen && ampel.offen && (
            <a
              href={whatsappLink(
                `Hallo ${kunde.name}, kurze Erinnerung an deinen Wochen-Check-in. Dauert etwa 2 Minuten: ${coach.link}`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonKlassen("sekundaer", "klein")}
            >
              <MessageSquareText size={15} strokeWidth={2} aria-hidden="true" />
              Per WhatsApp erinnern
              <span className="sr-only"> (öffnet in neuem Tab)</span>
            </a>
          )}
          {eigene.length > 0 ? (
            <a href={`${basis}/kunde/${kunde.id}/export`} className={buttonKlassen("sekundaer", "klein")}>
              <Download size={15} strokeWidth={2} aria-hidden="true" />
              Als Tabelle exportieren
            </a>
          ) : (
            <>
              <button type="button" disabled className={buttonKlassen("sekundaer", "klein")}>
                <Download size={15} strokeWidth={2} aria-hidden="true" />
                Als Tabelle exportieren
              </button>
              <p className="text-[13px] text-text-leise">Noch keine Check-ins zum Exportieren.</p>
            </>
          )}
        </div>
      )}

      {/* Warum diese Farbe? Bei widerrufener Einwilligung gibt es keine Ampel, nur den Hinweis */}
      {widerrufen ? (
        <section className={`mt-8 ${panelKlassen}`}>
          <p className="font-serif text-[22px] leading-snug">
            Einwilligung widerrufen am {datumMitJahr(kunde.widerrufenAm!)}
          </p>
        </section>
      ) : (
        <section className={`mt-8 rounded-panel border p-6 sm:p-7 ${stil.getoent}`}>
          <h2 className={`text-[11px] font-semibold uppercase tracking-wider ${stil.text}`}>
            {ampel.gruende.length > 1 ? "Gründe" : "Grund"}
          </h2>
          <ul className="mt-3 space-y-2">
            {ampel.gruende.map((grund) => (
              <li key={grund} className="font-serif text-[22px] leading-snug">
                {grund}
              </li>
            ))}
          </ul>
        </section>
      )}

      {letzter ? (
        <section className={`mt-6 ${panelKlassen}`}>
          <h2 className={mikroKlassen}>Letzter Check-in · Woche bis {datumKurz(letzter.woche)}</h2>
          <div className="mt-4">
            <WochenZahlen eingabe={letzter} />
          </div>
          <dl className="mt-6 grid gap-6 border-t border-linie pt-6 md:grid-cols-2">
            <div>
              <dt className="text-[13px] font-medium text-text-zwei">Größter Erfolg</dt>
              <dd className="mt-1.5 font-serif text-[18px] italic leading-relaxed">„{letzter.erfolg}“</dd>
            </div>
            <div>
              <dt className="text-[13px] font-medium text-text-zwei">Größte Hürde</dt>
              <dd className="mt-1.5 font-serif text-[18px] italic leading-relaxed">„{letzter.huerde}“</dd>
            </div>
          </dl>
          {letzter.fokusText !== undefined && (
            <div className="mt-6 border-t border-linie pt-6 text-[15px]">
              <p className="text-[13px] font-medium text-text-zwei">Wochenfokus</p>
              <p className="mt-1.5 leading-relaxed">
                {letzter.fokusText} <span className="text-text-zwei">· {FOKUS_ANTWORTEN[letzter.fokusAntwort ?? "keine"]}</span>
              </p>
            </div>
          )}
          {letzter.frage && (
            <div className="mt-6 rounded-subtil border border-akzent/25 bg-akzent/8 p-5">
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-akzent">
                <MessageCircleQuestion size={15} strokeWidth={2} aria-hidden="true" />
                Frage an dich
              </p>
              <p className="mt-2 text-[16px] leading-relaxed">{letzter.frage}</p>
            </div>
          )}
        </section>
      ) : (
        <p className={`mt-6 ${panelKlassen} text-text-zwei`}>Noch kein Check-in.</p>
      )}

      {eigene.length > 0 && <Verlauf checkins={eigene} heute={heute} />}

      {eigene.length > 0 && (
        <section className={`mt-6 ${panelKlassen}`}>
          <h2 className={mikroKlassen}>Trainings pro Woche</h2>
          <ol className="mt-4 divide-y divide-linie">
            {eigene
              .slice(-8)
              .reverse()
              .map((c) => (
                <li key={c.woche} className="flex items-center gap-4 py-2.5">
                  <span className="w-24 shrink-0 font-mono text-[12px] text-text-leise">
                    {datumKurz(c.woche)}
                  </span>
                  <span className="flex flex-1 gap-1" aria-hidden="true">
                    {Array.from({ length: Math.max(c.trainingsGeplant, c.trainingsGeschafft) }, (_, i) => (
                      <span
                        key={i}
                        className={`h-2 flex-1 rounded-full ${i < c.trainingsGeschafft ? "bg-text-zwei" : "bg-spur"}`}
                      />
                    ))}
                  </span>
                  <span className="w-14 text-right font-mono text-[13px] tabular-nums">
                    {c.trainingsGeschafft} / {c.trainingsGeplant}
                  </span>
                </li>
              ))}
          </ol>
        </section>
      )}
      {eigene.slice(-8).some((c) => c.fokusText !== undefined) && (
        <section className={`mt-6 ${panelKlassen}`}>
          <h2 className={mikroKlassen}>Wochenfokus im Verlauf</h2>
          <ol className="mt-4 divide-y divide-linie">
            {eigene
              .slice(-8)
              .reverse()
              .filter((c) => c.fokusText !== undefined)
              .map((c) => (
                <li key={c.woche} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-2.5">
                  <span className="w-24 shrink-0 font-mono text-[12px] text-text-leise">{datumKurz(c.woche)}</span>
                  <span className="min-w-0 flex-1 text-[15px]">{c.fokusText}</span>
                  <span className="text-[13px] text-text-zwei">{FOKUS_ANTWORTEN[c.fokusAntwort ?? "keine"]}</span>
                </li>
              ))}
          </ol>
        </section>
      )}
      {coach && <Wochenfokus kunde={kunde} heute={heute} />}
      {coach && <Notizen kundeId={kunde.id} notiz={coach.notiz} />}
    </div>
  );
}
