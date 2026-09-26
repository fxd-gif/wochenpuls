"use client";

import { Archive, ArchiveRestore, Check, Copy, Info, Trash2, UserPlus } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { Abschnittskopf } from "@/components/ui/Abschnittskopf";
import { Button } from "@/components/ui/Button";
import { eingabeKlassen, mikroKlassen, panelKlassen } from "@/components/ui/stil";
import type { Kunde } from "@/lib/checkin";
import { datumKurz } from "@/lib/woche";

export type VerwaltungsAktionen = {
  // gibt eine Fehlermeldung zurück, oder null bei Erfolg
  anlegen: (vorher: string | null, daten: FormData) => Promise<string | null>;
  archivieren: (daten: FormData) => Promise<void>;
  loeschen: (daten: FormData) => Promise<void>;
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
              className={`${eingabeKlassen} h-12 sm:flex-1`}
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
              <KundenZeile key={kunde.id} kunde={kunde} aktionen={aktionen} link={links[kunde.id]} />
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
              <KundenZeile key={kunde.id} kunde={kunde} aktionen={aktionen} archiviert />
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

// Eine Kundenzeile: Name, Buttons, und bei Bedarf die Löschen-Rückfrage als eigene volle Zeile darunter
// (kein Browser-Dialog): erst "Löschen" antippen, dann "Endgültig löschen" oder "Abbrechen".
function KundenZeile({
  kunde,
  aktionen,
  link,
  archiviert,
}: {
  kunde: Kunde;
  aktionen?: VerwaltungsAktionen;
  link?: string;
  archiviert?: boolean;
}) {
  const [bestaetigen, setBestaetigen] = useState(false);
  // Fokus nur nach einem Klick verschieben, nicht beim Laden der Seite
  const fokusNoetig = useRef(false);
  const loeschenRef = useRef<HTMLButtonElement>(null);
  const abbrechenRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!fokusNoetig.current) return;
    fokusNoetig.current = false;
    if (bestaetigen) abbrechenRef.current?.focus();
    else loeschenRef.current?.focus();
  }, [bestaetigen]);

  function rueckfrageZeigen(zeigen: boolean) {
    fokusNoetig.current = true;
    setBestaetigen(zeigen);
  }

  return (
    <li className="flex flex-col gap-3 px-5 py-4 sm:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <p className={`font-serif text-[22px] leading-tight ${archiviert ? "text-text-leise" : ""}`}>
            {kunde.name}
          </p>
          {!archiviert && (
            <p className="font-mono text-[12px] text-text-leise">Dabei seit {datumKurz(kunde.angelegtAm)}</p>
          )}
        </div>
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
          {!archiviert && <LinkKopieren link={link} />}
          <ArchivKnopf kunde={kunde} aktion={aktionen?.archivieren} />
          <Button
            type="button"
            variante="ghost"
            groesse="klein"
            disabled={!aktionen?.loeschen || bestaetigen}
            className={archiviert ? "w-full" : "col-span-2 w-full"}
            ref={loeschenRef}
            onClick={() => rueckfrageZeigen(true)}
          >
            <Trash2 size={15} strokeWidth={2} aria-hidden="true" />
            Löschen
            <span className="sr-only"> {kunde.name}</span>
          </Button>
        </div>
      </div>

      {bestaetigen && (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-3 rounded-subtil border border-ampel-rot/30 bg-ampel-rot/10 p-3"
        >
          <p className="flex-1 text-[13px] font-medium text-ampel-rot">
            {kunde.name} endgültig löschen? Alle Check-ins gehen verloren.
          </p>
          <div className="flex gap-2">
            <form action={aktionen?.loeschen}>
              <input type="hidden" name="id" value={kunde.id} />
              <Button type="submit" variante="gefahr" groesse="klein">
                Endgültig löschen
              </Button>
            </form>
            <Button
              type="button"
              variante="sekundaer"
              groesse="klein"
              ref={abbrechenRef}
              onClick={() => rueckfrageZeigen(false)}
            >
              Abbrechen
            </Button>
          </div>
        </div>
      )}
    </li>
  );
}
