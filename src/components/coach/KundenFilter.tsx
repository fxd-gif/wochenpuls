"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";
import { AmpelMarke, ampelStufen, type AmpelStufe } from "@/components/AmpelMarke";
import { eingabeKlassen } from "@/components/ui/stil";
import type { AmpelErgebnis } from "@/lib/ampel";
import type { Kunde } from "@/lib/checkin";
import { KundenKarte, WiderrufKarte } from "./KundenKarte";

const stufen = ["rot", "gelb", "neu", "gruen"] as const;

// Die Ampel-Kacheln sind zugleich Filter: Ein Tipp zeigt nur diese Stufe, ein zweiter Tipp wieder alle.
// Dazu eine Namenssuche. Alles passiert im Browser, die Daten sind schon da.
export function KundenFilter({
  eintraege,
  widerrufen,
  basis,
}: {
  eintraege: { kunde: Kunde; ampel: AmpelErgebnis }[];
  widerrufen: Kunde[];
  basis: string;
}) {
  const [stufe, setStufe] = useState<AmpelStufe | null>(null);
  const [suche, setSuche] = useState("");

  const anzahl = (s: AmpelStufe) => eintraege.filter((e) => e.ampel.stufe === s).length;
  const begriff = suche.trim().toLocaleLowerCase("de");
  const passt = (k: Kunde) => k.name.toLocaleLowerCase("de").includes(begriff);
  const sichtbar = eintraege.filter((e) => (!stufe || e.ampel.stufe === stufe) && passt(e.kunde));
  // Widerrufene haben keine Ampel, sie erscheinen nur ohne Stufen-Filter
  const sichtbarWiderrufen = stufe ? [] : widerrufen.filter(passt);
  const gefiltert = stufe !== null || begriff !== "";
  const leer = sichtbar.length + sichtbarWiderrufen.length === 0;
  const gesamt = eintraege.length + widerrufen.length;

  const zuruecksetzen = () => {
    setStufe(null);
    setSuche("");
  };

  return (
    <>
      <div role="group" aria-label="Nach Ampel filtern" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stufen.map((s) => {
          const aktiv = stufe === s;
          return (
            <button
              key={s}
              type="button"
              aria-pressed={aktiv}
              onClick={() => setStufe(aktiv ? null : s)}
              className={`flex items-center justify-between gap-2 rounded-panel border px-4 py-3.5 text-left transition-colors ${
                aktiv
                  ? `border-transparent bg-flaeche-hoch ring-2 ring-inset ring-current ${ampelStufen[s].text}`
                  : "border-linie bg-flaeche hover:border-linie-fokus hover:bg-flaeche-hoch"
              }`}
            >
              <AmpelMarke stufe={s} />
              <span className="font-serif text-3xl leading-none text-text tabular-nums">{anzahl(s)}</span>
            </button>
          );
        })}
      </div>

      {gesamt > 0 && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block sm:w-80">
            <span className="sr-only">Kunden nach Namen suchen</span>
            <Search
              size={16}
              strokeWidth={2}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-leise"
            />
            <input
              type="search"
              value={suche}
              onChange={(e) => setSuche(e.target.value)}
              placeholder="Name suchen"
              autoComplete="off"
              className={`${eingabeKlassen} h-11 pl-10`}
            />
          </label>
          <p aria-live="polite" className="flex items-center gap-3 text-[13px] text-text-leise">
            {gefiltert ? `${sichtbar.length + sichtbarWiderrufen.length} von ${gesamt} Kunden` : `${gesamt} Kunden`}
            {gefiltert && (
              <button
                type="button"
                onClick={zuruecksetzen}
                className="inline-flex min-h-11 items-center gap-1 font-medium text-text-zwei transition-colors hover:text-text"
              >
                <X size={14} strokeWidth={2} aria-hidden="true" />
                Filter zurücksetzen
              </button>
            )}
          </p>
        </div>
      )}

      {gefiltert && leer && (
        <div className="mt-8 rounded-panel border border-dashed border-linie-fokus p-8 text-center">
          <p className="font-serif text-2xl">Niemand passt zu diesem Filter.</p>
          <p className="mt-2 text-text-zwei">
            {stufe && anzahl(stufe) === 0
              ? `Gerade steht kein Kunde auf „${ampelStufen[stufe].wort}“.`
              : "Prüf die Schreibweise oder setz den Filter zurück."}
          </p>
        </div>
      )}

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sichtbar.map(({ kunde, ampel }) => (
          <li key={kunde.id}>
            <KundenKarte kunde={kunde} ampel={ampel} href={`${basis}/kunde/${kunde.id}`} ebene="h2" />
          </li>
        ))}
        {sichtbarWiderrufen.map((kunde) => (
          <li key={kunde.id}>
            <WiderrufKarte kunde={kunde} href={`${basis}/kunde/${kunde.id}`} />
          </li>
        ))}
      </ul>
    </>
  );
}
