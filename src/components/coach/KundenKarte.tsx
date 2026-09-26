import { ArrowRight, MessageCircleQuestion } from "lucide-react";
import Link from "next/link";
import { AmpelMarke, ampelStufen } from "@/components/AmpelMarke";
import type { AmpelErgebnis } from "@/lib/ampel";
import type { Kunde } from "@/lib/checkin";
import { datumKurz } from "@/lib/woche";

const kurzNamen = [
  ["energie", "Energie"],
  ["schlaf", "Schlaf"],
  ["stress", "Stress"],
  ["motivation", "Motiv."],
] as const;

// Eine Kundenkarte: Ampel, Name, Grund, Zahlen der Woche, O-Ton. Die ganze Karte ist ein Link.
export function KundenKarte({
  kunde,
  ampel,
  href,
  gross = false,
  zeitlos = false,
  ebene = "h3",
}: {
  kunde: Kunde;
  ampel: AmpelErgebnis;
  href: string;
  gross?: boolean;
  // Ohne Datum und "Check-in offen" (für die Startseite, die nur einmal beim Hochladen erzeugt wird)
  zeitlos?: boolean;
  // Überschriften-Ebene des Kundennamens, je nachdem, was auf der Seite darüber steht
  ebene?: "h2" | "h3";
}) {
  const stil = ampelStufen[ampel.stufe];
  const Name = ebene;
  const letzter = ampel.letzter;
  const anteil =
    letzter && letzter.trainingsGeplant > 0 ? letzter.trainingsGeschafft / letzter.trainingsGeplant : 0;
  const zitat = letzter && (ampel.stufe === "gruen" ? letzter.erfolg : letzter.huerde);

  return (
    <Link
      href={href}
      className={`group flex h-full flex-col rounded-panel bg-flaeche p-6 transition-colors hover:bg-flaeche-hoch sm:p-7 ${
        ampel.stufe === "rot" ? `border-2 ${stil.rand}` : `border ${stil.rand} hover:border-linie-fokus`
      }`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-linie pb-4">
        <AmpelMarke stufe={ampel.stufe} />
        <span className="font-mono text-[12px] text-text-leise">
          {zeitlos ? "Beispiel" : letzter ? `Zuletzt ${datumKurz(letzter.woche)}` : "Noch kein Check-in"}
        </span>
      </div>

      <Name className={`mt-5 font-serif font-normal leading-tight ${gross ? "text-[34px]" : "text-[28px]"}`}>
        {kunde.name}
      </Name>

      <div className={`mt-4 rounded-subtil border p-3.5 ${stil.getoent}`}>
        <p className={`text-[11px] font-semibold uppercase tracking-wider ${stil.text}`}>
          {ampel.stufe === "gruen" || ampel.stufe === "neu" ? "Diese Woche" : "Grund"}
        </p>
        <p className="mt-1 text-[14px] font-medium leading-snug">
          {ampel.gruende[0]}
          {ampel.gruende.length > 1 && (
            <span className="text-text-zwei"> · +{ampel.gruende.length - 1} weitere</span>
          )}
        </p>
      </div>

      {letzter && (
        <div className="mt-5 space-y-3 text-[13px]">
          <div>
            <div className="mb-1.5 flex justify-between font-medium text-text-zwei">
              <span>Trainings</span>
              <span className="font-mono text-text tabular-nums">
                {letzter.trainingsGeschafft} / {letzter.trainingsGeplant}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-spur">
              <div className={`h-full ${stil.punkt}`} style={{ width: `${Math.min(anteil, 1) * 100}%` }} />
            </div>
          </div>
          <dl className="grid grid-cols-4 gap-2 border-t border-linie pt-3">
            {kurzNamen.map(([schluessel, name]) => (
              <div key={schluessel}>
                <dt className="text-[11px] text-text-leise">{name}</dt>
                <dd className="font-mono text-text tabular-nums">{letzter[schluessel]}</dd>
              </div>
            ))}
          </dl>
          {zitat && (
            <p className="border-t border-linie pt-3 font-serif text-[15px] italic leading-snug text-text-zwei">
              „{zitat}“
            </p>
          )}
        </div>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
        {!zeitlos && ampel.offen && (
          <span className="rounded-sm border border-linie bg-flaeche-alt px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-text-zwei">
            Check-in offen
          </span>
        )}
        {ampel.frage && (
          <span className="inline-flex items-center gap-1.5 rounded-subtil border border-linie-fokus bg-flaeche-alt px-2 py-0.5 text-[12px] font-medium text-text-zwei">
            <MessageCircleQuestion size={13} strokeWidth={2} aria-hidden="true" />
            Frage an dich
          </span>
        )}
        <span className="ml-auto inline-flex items-center gap-1 text-[13px] font-medium text-text-zwei transition-colors group-hover:text-text">
          Details
          <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
