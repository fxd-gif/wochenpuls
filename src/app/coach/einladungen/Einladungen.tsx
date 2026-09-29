"use client";

import { Check, Copy, KeyRound, Trash2 } from "lucide-react";
import { useActionState, useState } from "react";
import { KontoLoeschen } from "@/components/coach/KontoLoeschen";
import { Abschnittskopf } from "@/components/ui/Abschnittskopf";
import { Button } from "@/components/ui/Button";
import { eingabeKlassen, mikroKlassen, panelKlassen } from "@/components/ui/stil";
import type { Einladung } from "@/lib/server/datenbank";
import { datumKurz, datumMitJahr } from "@/lib/woche";

// "ABCDEFGHJK" → "ABCDE-FGHJK", leichter vorzulesen und abzutippen
const lesbar = (code: string) => `${code.slice(0, 5)}-${code.slice(5)}`;

export function Einladungen({
  liste,
  erzeugen,
  loeschen,
  kontoLoeschen,
}: {
  liste: Einladung[];
  erzeugen: (vorher: string | null, daten: FormData) => Promise<string | null>;
  loeschen: (daten: FormData) => Promise<void>;
  kontoLoeschen: (vorher: string | null, daten: FormData) => Promise<string | null>;
}) {
  const [fehler, aktion, laeuft] = useActionState(erzeugen, null);
  const [kopiert, setKopiert] = useState<string | null>(null);
  const [frage, setFrage] = useState<string | null>(null); // Code, bei dem die Löschen-Rückfrage offen ist

  async function kopieren(code: string) {
    try {
      await navigator.clipboard.writeText(lesbar(code));
      setKopiert(code);
    } catch {
      setKopiert(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8 lg:py-16">
      <Abschnittskopf
        ebene="h1"
        seitlich
        kicker="Nur für dich"
        titel="Einladungscodes"
        text="Jeder Code gilt für genau ein neues Coach-Konto. Der Coach gibt ihn beim ersten Anmelden mit Google ein."
      />

      <form action={aktion} className={panelKlassen}>
        <fieldset disabled={laeuft}>
          <label htmlFor="vermerk" className="font-serif text-[22px]">
            Neuen Code erzeugen
          </label>
          <p className="mt-1 text-[13px] text-text-leise">Vermerk nur für dich, z. B. „für Michelle“.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              id="vermerk"
              name="vermerk"
              required
              maxLength={40}
              autoComplete="off"
              placeholder="für …"
              className={`${eingabeKlassen} h-12 sm:flex-1`}
            />
            <Button type="submit">
              <KeyRound size={17} strokeWidth={2} aria-hidden="true" />
              {laeuft ? "Wird erzeugt …" : "Code erzeugen"}
            </Button>
          </div>
          {fehler && (
            <p role="alert" className="mt-3 text-[14px] font-medium text-ampel-rot">
              {fehler}
            </p>
          )}
        </fieldset>
      </form>

      <h2 className={`${mikroKlassen} mt-12 mb-4`}>Alle Codes ({liste.length})</h2>
      {liste.length === 0 ? (
        <p className="text-[15px] text-text-zwei">Noch keine Codes.</p>
      ) : (
        <ul className="divide-y divide-linie border-y border-linie">
          {liste.map((e) => (
            <li key={e.code} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div className="min-w-0">
                <p className="font-mono text-[16px] tracking-wider text-text">{lesbar(e.code)}</p>
                <p className="mt-0.5 text-[13px] text-text-zwei">
                  {e.kontoGeloescht ? "" : `${e.vermerk} · `}erstellt {datumKurz(e.erstelltAm)} ·{" "}
                  {e.kontoGeloescht
                    ? `Konto gelöscht (eingelöst ${datumKurz(e.eingeloestAm!)})`
                    : e.eingeloestAm
                      ? `eingelöst ${datumKurz(e.eingeloestAm)}`
                      : "offen"}
                </p>
              </div>
              {!e.eingeloestAm && (
                <div className="flex gap-2">
                  <Button type="button" variante="sekundaer" groesse="klein" onClick={() => kopieren(e.code)}>
                    {kopiert === e.code ? (
                      <Check size={15} strokeWidth={2} aria-hidden="true" />
                    ) : (
                      <Copy size={15} strokeWidth={1.75} aria-hidden="true" />
                    )}
                    {kopiert === e.code ? "Kopiert" : "Kopieren"}
                  </Button>
                  <Button
                    type="button"
                    variante="ghost"
                    groesse="klein"
                    disabled={frage === e.code}
                    aria-label={`Code ${lesbar(e.code)} löschen`}
                    onClick={() => setFrage(e.code)}
                  >
                    <Trash2 size={15} strokeWidth={1.75} aria-hidden="true" />
                  </Button>
                </div>
              )}
              {frage === e.code && (
                <div
                  role="alert"
                  className="flex w-full flex-wrap items-center gap-3 rounded-subtil border border-ampel-rot/30 bg-ampel-rot/10 p-3"
                >
                  <p className="flex-1 basis-64 text-[13px] font-medium text-ampel-rot">
                    Code {lesbar(e.code)} endgültig löschen?
                  </p>
                  <div className="flex gap-2">
                    <form action={loeschen}>
                      <input type="hidden" name="code" value={e.code} />
                      <Button type="submit" variante="gefahr" groesse="klein">
                        Endgültig löschen
                      </Button>
                    </form>
                    <Button type="button" variante="sekundaer" groesse="klein" autoFocus onClick={() => setFrage(null)}>
                      Abbrechen
                    </Button>
                  </div>
                </div>
              )}
              {e.eingeloestAm && !e.kontoGeloescht && (
                <KontoLoeschen
                  aktion={kontoLoeschen}
                  code={e.code}
                  knopf="Coach-Konto löschen"
                  frage={`Coach-Konto „${e.vermerk}“ (eingelöst am ${datumMitJahr(e.eingeloestAm)}) endgültig löschen? Alle Kunden, Check-ins, Notizen und Einwilligungen dieses Coaches gehen für immer verloren.`}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
