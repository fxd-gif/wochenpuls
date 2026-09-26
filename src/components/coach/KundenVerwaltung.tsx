"use client";

import { Archive, ArchiveRestore, Check, Copy, Info, UserPlus } from "lucide-react";
import { useActionState, useState } from "react";
import { Abschnittskopf } from "@/components/ui/Abschnittskopf";
import { Button } from "@/components/ui/Button";
import { eingabeKlassen, mikroKlassen, panelKlassen } from "@/components/ui/stil";
import type { Kunde } from "@/lib/checkin";
import { datumKurz } from "@/lib/woche";

export type VerwaltungsAktionen = {
  // gibt eine Fehlermeldung zurück, oder null bei Erfolg
  anlegen: (vorher: string | null, daten: FormData) => Promise<string | null>;
  archivieren: (daten: FormData) => Promise<void>;
};

async function inDerDemo() {
  return "In der Demo deaktiviert.";
}

// Kunden anlegen, Link kopieren, archivieren. Ohne "aktionen" (Demo) ist alles deaktiviert.
export function KundenVerwaltung({
  kunden,
  links = {},
  aktionen,
}: {
  kunden: Kunde[];
  links?: Record<string, string>; // Kunden-ID → persönlicher Link
  aktionen?: VerwaltungsAktionen;
}) {
  const demo = !aktionen;
  const [fehler, anlegen, legtAn] = useActionState(aktionen?.anlegen ?? inDerDemo, null);
  const aktive = kunden.filter((k) => !k.archiviert);
  const archivierte = kunden.filter((k) => k.archiviert);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8 lg:py-16">
      <Abschnittskopf
        ebene="h1"
        seitlich
        kicker="Verwaltung"
        titel="Kunden"
        text="Leg Kunden an, kopier ihren persönlichen Link und archiviere, wer nicht mehr dabei ist."
      />

      {demo && (
        <p className="mb-6 flex gap-3 rounded-panel border border-linie bg-flaeche-alt p-5 text-[14px] leading-relaxed text-text-zwei">
          <Info size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-text-zwei" aria-hidden="true" />
          In der Demo kannst du nichts ändern. In der echten App legst du hier Kunden an und bekommst für
          jeden einen persönlichen Link, den du per WhatsApp verschickst.
        </p>
      )}

      {/* Neuer Kunde */}
      <form action={anlegen} className={panelKlassen}>
        <fieldset disabled={demo || legtAn}>
          <label htmlFor="neuer-name" className="font-serif text-[22px]">
            Neuen Kunden anlegen
          </label>
          <p className="mt-1 text-[13px] text-text-leise">
            Nur Vorname oder Kürzel, kein vollständiger Name.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              id="neuer-name"
              name="name"
              required
              maxLength={30}
              autoComplete="off"
              placeholder="z. B. Lena oder LK"
              aria-describedby={fehler ? "anlegen-fehler" : undefined}
              className={`${eingabeKlassen} h-12 flex-1`}
            />
            <Button type="submit">
              <UserPlus size={17} strokeWidth={2} aria-hidden="true" />
              {legtAn ? "Wird angelegt …" : "Anlegen"}
            </Button>
          </div>
          {fehler && !demo && (
            <p id="anlegen-fehler" role="alert" className="mt-3 text-[14px] font-medium text-ampel-rot">
              {fehler}
            </p>
          )}
        </fieldset>
      </form>

      <section className="mt-10">
        <h2 className={mikroKlassen}>Aktive Kunden ({aktive.length})</h2>
        {aktive.length === 0 ? (
          <p className={`mt-3 ${panelKlassen} text-text-zwei`}>
            Noch keine Kunden. Leg oben deinen ersten an.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-linie rounded-panel border border-linie bg-flaeche">
            {aktive.map((kunde) => (
              <li key={kunde.id} className="flex flex-wrap items-center gap-3 px-5 py-4 sm:px-6">
                <div className="mr-auto">
                  <p className="font-serif text-[22px] leading-tight">{kunde.name}</p>
                  <p className="font-mono text-[12px] text-text-leise">
                    Dabei seit {datumKurz(kunde.angelegtAm)}
                  </p>
                </div>
                <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
                  <LinkKopieren link={links[kunde.id]} />
                  <ArchivKnopf kunde={kunde} aktion={aktionen?.archivieren} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {archivierte.length > 0 && (
        <section className="mt-10">
          <h2 className={mikroKlassen}>Archiviert ({archivierte.length})</h2>
          <p className="mt-1 text-[13px] text-text-leise">
            Archivierte Kunden erscheinen nicht in der Übersicht, ihr Link ist gesperrt.
          </p>
          <ul className="mt-3 divide-y divide-linie rounded-panel border border-linie bg-flaeche">
            {archivierte.map((kunde) => (
              <li key={kunde.id} className="flex flex-wrap items-center gap-3 px-5 py-4 sm:px-6">
                <p className="mr-auto font-serif text-[22px] leading-tight text-text-leise">{kunde.name}</p>
                <ArchivKnopf kunde={kunde} aktion={aktionen?.archivieren} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function LinkKopieren({ link }: { link?: string }) {
  const [kopiert, setKopiert] = useState(false);
  return (
    <Button
      type="button"
      variante="sekundaer"
      groesse="klein"
      disabled={!link}
      className="w-full"
      onClick={async () => {
        if (!link) return;
        await navigator.clipboard.writeText(link);
        setKopiert(true);
        setTimeout(() => setKopiert(false), 2000);
      }}
    >
      {kopiert ? (
        <Check size={15} strokeWidth={2} aria-hidden="true" />
      ) : (
        <Copy size={15} strokeWidth={2} aria-hidden="true" />
      )}
      <span aria-live="polite">{kopiert ? "Kopiert!" : "Link kopieren"}</span>
    </Button>
  );
}

function ArchivKnopf({ kunde, aktion }: { kunde: Kunde; aktion?: (daten: FormData) => Promise<void> }) {
  return (
    <form action={aktion} className="contents sm:block">
      <input type="hidden" name="id" value={kunde.id} />
      <input type="hidden" name="archiviert" value={kunde.archiviert ? "nein" : "ja"} />
      <Button type="submit" variante="ghost" groesse="klein" disabled={!aktion} className="w-full">
        {kunde.archiviert ? (
          <ArchiveRestore size={15} strokeWidth={2} aria-hidden="true" />
        ) : (
          <Archive size={15} strokeWidth={2} aria-hidden="true" />
        )}
        {kunde.archiviert ? "Wiederherstellen" : "Archivieren"}
        <span className="sr-only"> {kunde.name}</span>
      </Button>
    </form>
  );
}
