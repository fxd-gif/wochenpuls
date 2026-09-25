"use client";

import { Archive, ArchiveRestore, Check, Copy, Info, UserPlus } from "lucide-react";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
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
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Kunden verwalten</h1>

      {demo && (
        <p className="mt-6 flex gap-3 rounded-lg bg-akzent-hell p-5 leading-relaxed">
          <Info size={22} strokeWidth={2.5} className="mt-0.5 shrink-0" aria-hidden="true" />
          In der Demo kannst du nichts ändern. In der echten App legst du hier Kunden an und bekommst für
          jeden einen persönlichen Link, den du per WhatsApp verschickst.
        </p>
      )}

      {/* Neuer Kunde */}
      <form action={anlegen} className="mt-8 rounded-lg bg-weiss p-6">
        <fieldset disabled={demo || legtAn}>
          <label htmlFor="neuer-name" className="text-xl font-bold">
            Neuen Kunden anlegen
          </label>
          <p className="mt-1 text-sm text-leise">Nur Vorname oder Kürzel, kein vollständiger Name.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              id="neuer-name"
              name="name"
              required
              maxLength={30}
              autoComplete="off"
              placeholder="z. B. Lena oder LK"
              aria-describedby={fehler ? "anlegen-fehler" : undefined}
              className="h-14 flex-1 rounded-md border-2 border-transparent bg-flaeche px-4 text-lg placeholder:text-leise/80 focus:border-primaer focus:bg-weiss focus:outline-none disabled:opacity-60"
            />
            <Button type="submit">
              <UserPlus size={20} strokeWidth={2.5} aria-hidden="true" />
              {legtAn ? "Wird angelegt …" : "Anlegen"}
            </Button>
          </div>
          {fehler && !demo && (
            <p id="anlegen-fehler" role="alert" className="mt-3 font-medium text-fehler">
              {fehler}
            </p>
          )}
        </fieldset>
      </form>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-leise">
          Aktive Kunden ({aktive.length})
        </h2>
        {aktive.length === 0 ? (
          <p className="mt-3 rounded-lg bg-weiss p-6 text-lg">
            Noch keine Kunden. Leg oben deinen ersten an.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {aktive.map((kunde) => (
              <li key={kunde.id} className="flex flex-wrap items-center gap-3 rounded-lg bg-weiss p-4 sm:p-5">
                <div className="mr-auto">
                  <p className="text-xl font-bold">{kunde.name}</p>
                  <p className="text-sm text-leise">Dabei seit {datumKurz(kunde.angelegtAm)}</p>
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
          <h2 className="text-sm font-semibold uppercase tracking-wider text-leise">
            Archiviert ({archivierte.length})
          </h2>
          <p className="mt-1 text-sm text-leise">
            Archivierte Kunden erscheinen nicht in der Übersicht, ihr Link ist gesperrt.
          </p>
          <ul className="mt-3 space-y-3">
            {archivierte.map((kunde) => (
              <li key={kunde.id} className="flex flex-wrap items-center gap-3 rounded-lg bg-weiss p-4 sm:p-5">
                <p className="mr-auto text-xl font-bold text-leise">{kunde.name}</p>
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
      disabled={!link}
      className="h-12 w-full whitespace-nowrap px-3 text-sm sm:px-5 sm:text-base [&_svg]:shrink-0"
      onClick={async () => {
        if (!link) return;
        await navigator.clipboard.writeText(link);
        setKopiert(true);
        setTimeout(() => setKopiert(false), 2000);
      }}
    >
      {kopiert ? (
        <Check size={18} strokeWidth={2.5} aria-hidden="true" />
      ) : (
        <Copy size={18} strokeWidth={2.5} aria-hidden="true" />
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
      <Button
        type="submit"
        variante="sekundaer"
        disabled={!aktion}
        className="h-12 w-full whitespace-nowrap px-3 text-sm sm:px-5 sm:text-base [&_svg]:shrink-0"
      >
        {kunde.archiviert ? (
          <ArchiveRestore size={18} strokeWidth={2.5} aria-hidden="true" />
        ) : (
          <Archive size={18} strokeWidth={2.5} aria-hidden="true" />
        )}
        {kunde.archiviert ? "Wiederherstellen" : "Archivieren"}
        <span className="sr-only"> {kunde.name}</span>
      </Button>
    </form>
  );
}
