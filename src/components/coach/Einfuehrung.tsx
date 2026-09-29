"use client";

import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Link2,
  MessageCircle,
  NotebookPen,
  RefreshCw,
  ShieldCheck,
  Sheet,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { AmpelMarke, type AmpelStufe } from "@/components/AmpelMarke";
import { Kicker } from "@/components/ui/Abschnittskopf";
import { Button } from "@/components/ui/Button";
import { REGELN } from "@/lib/ampel";

// Gleicher Wert wie MAX_KUNDEN in src/lib/server/datenbank.ts (dort nicht importierbar, die Datei ist nur für den Server)
const HOECHSTZAHL_KUNDEN = 25;

const rahmen = "mx-auto w-full max-w-sm rounded-panel border border-linie bg-flaeche-hoch p-5 halo";
const textLink = "text-akzent underline underline-offset-4";
const icon = { size: 17, strokeWidth: 1.75, "aria-hidden": true } as const;

function AmpelZeile({ stufe, children }: { stufe: AmpelStufe; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-[14px] leading-snug text-text-zwei">
      <span className="w-28 shrink-0">
        <AmpelMarke stufe={stufe} />
      </span>
      <span>{children}</span>
    </li>
  );
}

function Werkzeug({ symbol, children }: { symbol: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-center gap-3 text-[14px] text-text">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-subtil border border-linie-fokus bg-flaeche-alt text-akzent">
        {symbol}
      </span>
      {children}
    </li>
  );
}

type Schritt = { titel: string; bild: ReactNode; text: ReactNode };

const schritte: Schritt[] = [
  {
    titel: "Willkommen bei Wochenpuls",
    bild: (
      <div className={`${rahmen} flex flex-col items-center gap-4 py-8`}>
        <span className="flex size-14 items-center justify-center rounded-full border border-linie-fokus bg-flaeche-alt text-akzent">
          <Activity size={28} strokeWidth={1.75} aria-hidden="true" />
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          <AmpelMarke stufe="rot" />
          <AmpelMarke stufe="gelb" />
          <AmpelMarke stufe="gruen" />
        </div>
      </div>
    ),
    text: (
      <p>
        Wochenpuls zeigt dir auf einer Seite, wie es deinen Kunden diese Woche geht. Sie füllen einmal pro Woche ein
        kurzes Formular aus, und du siehst sofort, um wen du dich kümmern solltest. Die nächsten Schritte zeigen dir,
        wie das geht.
      </p>
    ),
  },
  {
    titel: "Kunden anlegen",
    bild: (
      <div className={rahmen}>
        <ul className="space-y-2">
          {["Anna", "T. K.", "Ben"].map((name) => (
            <li
              key={name}
              className="flex items-center justify-between rounded-subtil border border-linie bg-flaeche-alt px-4 py-3"
            >
              <span className="font-serif text-[20px]">{name}</span>
              <Link2 size={16} strokeWidth={1.75} className="text-akzent" aria-hidden="true" />
            </li>
          ))}
        </ul>
        <p className="mt-3 text-right font-mono text-[12px] text-text-leise">3 von {HOECHSTZAHL_KUNDEN}</p>
      </div>
    ),
    text: (
      <p>
        Unter „Kunden“ legst du jeden Kunden mit Vorname oder Kürzel an, mehr braucht es nicht. Jeder bekommt einen
        persönlichen Link. Du kannst bis zu {HOECHSTZAHL_KUNDEN} Kunden anlegen.
      </p>
    ),
  },
  {
    titel: "Link verschicken, Check-in erhalten",
    bild: (
      <div className={rahmen}>
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-leise">Sonntag · 2 Minuten</p>
        <div className="mt-4 space-y-3">
          {(
            [
              ["Energie", 4],
              ["Schlaf", 3],
              ["Motivation", 5],
            ] as const
          ).map(([name, wert]) => (
            <div key={name}>
              <div className="mb-1.5 flex justify-between text-[13px] text-text-zwei">
                <span>{name}</span>
                <span className="font-mono text-text">{wert}/5</span>
              </div>
              <div className="h-1.5 rounded-full bg-spur">
                <div className="h-full rounded-full bg-akzent" style={{ width: `${(wert / 5) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    text: (
      <p>
        Schick jedem Kunden seinen Link, zum Beispiel per WhatsApp. Er füllt sonntags in etwa 2 Minuten das Formular
        aus, ganz ohne Login. Beim ersten Mal willigt er ein und kann das jederzeit widerrufen.
      </p>
    ),
  },
  {
    titel: "Die Ampel lesen",
    bild: (
      <ul className={`${rahmen} space-y-4`}>
        <AmpelZeile stufe="rot">Zum Beispiel: Check-in seit {REGELN.rotAbTagenUeberfaellig} Tagen überfällig</AmpelZeile>
        <AmpelZeile stufe="gelb">Ein Wert ist deutlich schlechter als sonst</AmpelZeile>
        <AmpelZeile stufe="gruen">Alles im grünen Bereich</AmpelZeile>
      </ul>
    ),
    text: (
      <p>
        Wer Rot hat, steht oben. Hier solltest du dich melden, zum Beispiel weil der Check-in seit{" "}
        {REGELN.rotAbTagenUeberfaellig} Tagen fehlt oder weniger als die Hälfte der Trainings geschafft wurde. Gelb
        heißt: im Blick behalten. Grün heißt: läuft. Bei jeder Karte steht der Grund dabei.
      </p>
    ),
  },
  {
    titel: "Werkzeuge pro Kunde",
    bild: (
      <ul className={`${rahmen} space-y-3`}>
        <Werkzeug symbol={<MessageCircle {...icon} />}>Erinnerung per WhatsApp</Werkzeug>
        <Werkzeug symbol={<Target {...icon} />}>Wochenfokus</Werkzeug>
        <Werkzeug symbol={<NotebookPen {...icon} />}>Private Notizen</Werkzeug>
        <Werkzeug symbol={<Sheet {...icon} />}>Export als Tabelle</Werkzeug>
        <Werkzeug symbol={<RefreshCw {...icon} />}>Link neu erzeugen</Werkzeug>
      </ul>
    ),
    text: (
      <p>
        Auf der Seite jedes Kunden findest du diese Werkzeuge. Den Wochenfokus sieht auch der Kunde in seinem
        Formular, die Notizen bleiben privat bei dir. Wurde ein Link weitergegeben, erzeugst du einen neuen.
      </p>
    ),
  },
  {
    titel: "Deine Pflicht beim Datenschutz",
    bild: (
      <div className={`${rahmen} flex items-center gap-4`}>
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-linie-fokus bg-flaeche-alt text-akzent">
          <ShieldCheck size={24} strokeWidth={1.75} aria-hidden="true" />
        </span>
        <p className="text-[14px] leading-snug text-text-zwei">Du bleibst für die Daten deiner Kunden verantwortlich.</p>
      </div>
    ),
    text: (
      <>
        <p>
          Sag deinen Kunden, dass du Wochenpuls nutzt, und schick ihnen den Link zur{" "}
          <Link href="/datenschutz" target="_blank" rel="noopener" className={textLink}>
            Datenschutzerklärung<span className="sr-only"> (öffnet in neuem Tab)</span>
          </Link>
          . Den Vertrag zur Auftragsverarbeitung findest du{" "}
          <Link href="/avv" target="_blank" rel="noopener" className={textLink}>
            hier<span className="sr-only"> (öffnet in neuem Tab)</span>
          </Link>
          .
        </p>
        <p className="mt-3">Schreib bitte keine Gesundheitsangaben in die Notizen.</p>
      </>
    ),
  },
];

// Geführte Tour durch die Coach-Funktionen. Mit "speichern" (echte App) wird das Ende gemerkt; in der Demo nicht.
export function Einfuehrung({
  fertigZiel,
  ueberspringenZiel,
  speichern,
}: {
  fertigZiel: string;
  ueberspringenZiel: string;
  speichern?: () => Promise<void>;
}) {
  const router = useRouter();
  const [nr, setNr] = useState(0);
  const [wartet, setWartet] = useState(false);
  const titelRef = useRef<HTMLHeadingElement>(null);
  const ersterDurchlauf = useRef(true);
  const letzter = nr === schritte.length - 1;

  // Beim Schrittwechsel springt der Fokus auf die neue Überschrift (nicht beim ersten Anzeigen der Seite)
  useEffect(() => {
    if (ersterDurchlauf.current) ersterDurchlauf.current = false;
    else titelRef.current?.focus();
  }, [nr]);

  // Pfeiltasten blättern; Enter löst wie gewohnt den fokussierten Knopf aus
  useEffect(() => {
    function taste(e: KeyboardEvent) {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.key === "ArrowRight" && nr < schritte.length - 1) setNr(nr + 1);
      else if (e.key === "ArrowLeft" && nr > 0) setNr(nr - 1);
    }
    window.addEventListener("keydown", taste);
    return () => window.removeEventListener("keydown", taste);
  }, [nr]);

  async function beenden(ziel: string) {
    setWartet(true);
    // Die Seite blendet aus, während gespeichert wird; weiter geht es erst, wenn beides fertig ist
    const ausgeblendet = new Promise((fertig) => setTimeout(fertig, 250));
    try {
      await speichern?.();
    } catch {
      // Speichern fehlgeschlagen: es geht trotzdem weiter, die Einführung kommt dann noch einmal
    }
    await ausgeblendet;
    router.push(ziel);
  }

  return (
    <div className="tour-huelle mx-auto max-w-2xl px-5 py-8 sm:py-12 lg:px-8" data-geht={wartet || undefined}>
      <h1 className="sr-only">Einführung in Wochenpuls</h1>

      <div className="flex items-center justify-between gap-4">
        <Kicker>
          Schritt {nr + 1} von {schritte.length}
        </Kicker>
        <Button variante="ghost" groesse="klein" disabled={wartet} onClick={() => beenden(ueberspringenZiel)}>
          Überspringen
        </Button>
      </div>

      <div
        className="mt-4 flex gap-1.5"
        role="progressbar"
        aria-label="Fortschritt der Einführung"
        aria-valuemin={1}
        aria-valuemax={schritte.length}
        aria-valuenow={nr + 1}
        aria-valuetext={`Schritt ${nr + 1} von ${schritte.length}`}
      >
        {schritte.map((s, i) => (
          <span key={s.titel} aria-hidden="true" className="h-1 flex-1 overflow-hidden rounded-full bg-spur">
            <span
              className={`block h-full origin-left rounded-full bg-akzent transition-transform duration-500 ease-out motion-reduce:duration-150 ${
                i <= nr ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </span>
        ))}
      </div>

      <div className="mt-8 grid sm:mt-10">
        {schritte.map((schritt, i) => (
          <section
            key={schritt.titel}
            inert={i !== nr}
            data-aktiv={i === nr ? "" : undefined}
            className="tour-schritt"
            style={{ "--aus": i < nr ? -1 : 1 } as CSSProperties}
          >
            <div className="tour-teil" style={{ "--i": 0 } as CSSProperties}>
              {schritt.bild}
            </div>
            <h2
              ref={i === nr ? titelRef : undefined}
              tabIndex={-1}
              className="tour-teil mt-8 font-serif text-3xl font-normal tracking-tight focus:outline-none sm:text-4xl"
              style={{ "--i": 1 } as CSSProperties}
            >
              {schritt.titel}
            </h2>
            <div
              className="tour-teil mt-3 max-w-xl text-base leading-relaxed text-text-zwei"
              style={{ "--i": 2 } as CSSProperties}
            >
              {schritt.text}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <Button
          variante="sekundaer"
          onClick={() => setNr(nr - 1)}
          disabled={wartet}
          className={nr === 0 ? "invisible" : ""}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Zurück
        </Button>
        {letzter ? (
          <Button onClick={() => beenden(fertigZiel)} disabled={wartet}>
            Los geht’s
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
        ) : (
          <Button onClick={() => setNr(nr + 1)}>
            Weiter
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
        )}
      </div>
      <p className="mt-6 hidden text-center font-mono text-[11px] text-text-leise sm:block">
        Tipp: Mit den Pfeiltasten kannst du blättern.
      </p>
    </div>
  );
}
