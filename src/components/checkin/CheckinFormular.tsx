"use client";

import { Check, CircleAlert, Send } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Kicker } from "@/components/ui/Abschnittskopf";
import { Button } from "@/components/ui/Button";
import {
  alsEingabe,
  istBeantwortet,
  leererEntwurf,
  MAX_TRAININGS,
  pflichtfelder,
  pruefeCheckin,
  skalen,
  type CheckinEingabe,
  type CheckinEntwurf,
  type Fehler,
} from "@/lib/checkin";
import { Frageblock } from "./Frageblock";
import { Skala } from "./Skala";
import { Textfeld } from "./Textfeld";
import { WochenZahlen } from "./WochenZahlen";
import { Zaehler } from "./Zaehler";

const GESUNDHEITS_HINWEIS = "Bitte keine Gesundheitsangaben wie Verletzungen oder Diagnosen.";

// Zu welchem Abschnitt gehört ein Feld? (für das Springen zum ersten Fehler)
function abschnittVon(feld: keyof CheckinEingabe) {
  return feld === "trainingsGeplant" || feld === "trainingsGeschafft" ? "trainings" : feld;
}

export function CheckinFormular({
  vorname,
  onAbsenden,
  nachDemAbsenden,
}: {
  vorname?: string;
  onAbsenden: (eingabe: CheckinEingabe) => Promise<void>;
  // Zusätzlicher Inhalt unter der Bestätigung (z. B. Knöpfe in der Demo)
  nachDemAbsenden?: (neuStarten: () => void) => ReactNode;
}) {
  const [entwurf, setEntwurf] = useState<CheckinEntwurf>(leererEntwurf);
  const [versucht, setVersucht] = useState(false);
  const [sendet, setSendet] = useState(false);
  const [sendeFehler, setSendeFehler] = useState(false);
  const [gesendet, setGesendet] = useState<CheckinEingabe | null>(null);

  // Fehler werden erst nach dem ersten Absende-Versuch angezeigt, dann aber sofort aktualisiert
  const fehler: Fehler = versucht ? pruefeCheckin(entwurf) : {};

  const beantwortet = pflichtfelder.filter((feld) => istBeantwortet(entwurf, feld)).length;
  const alleBeantwortet = beantwortet === pflichtfelder.length;

  // Ein Feld ändern: entweder mit festem Wert oder mit einer Rechenregel ("eins mehr")
  function setze<K extends keyof CheckinEntwurf>(
    feld: K,
    wert: CheckinEntwurf[K] | ((alt: CheckinEntwurf[K]) => CheckinEntwurf[K]),
  ) {
    setEntwurf((alt) => ({
      ...alt,
      [feld]:
        typeof wert === "function" ? (wert as (a: CheckinEntwurf[K]) => CheckinEntwurf[K])(alt[feld]) : wert,
    }));
  }

  async function absenden(e: React.FormEvent) {
    e.preventDefault();
    setVersucht(true);
    const neueFehler = pruefeCheckin(entwurf);

    const erstesFeld = (Object.keys(entwurf) as (keyof CheckinEingabe)[]).find((f) => neueFehler[f]);
    if (erstesFeld) {
      const block = document.getElementById(`feld-${abschnittVon(erstesFeld)}`);
      block?.scrollIntoView({ behavior: "smooth", block: "start" });
      block
        ?.querySelector<HTMLElement>("input, textarea, button[aria-label$='eins mehr']")
        ?.focus({ preventScroll: true });
      return;
    }

    setSendet(true);
    setSendeFehler(false);
    try {
      const eingabe = alsEingabe(entwurf);
      await onAbsenden(eingabe);
      setGesendet(eingabe);
      window.scrollTo({ top: 0 });
    } catch {
      setSendeFehler(true);
    } finally {
      setSendet(false);
    }
  }

  function neuStarten() {
    setEntwurf(leererEntwurf);
    setVersucht(false);
    setGesendet(null);
    window.scrollTo({ top: 0 });
  }

  if (gesendet) {
    return (
      <Bestaetigung vorname={vorname} eingabe={gesendet}>
        {nachDemAbsenden?.(neuStarten)}
      </Bestaetigung>
    );
  }

  // Fehlende Angaben pro Frage zählen (Geplant + Geschafft sind eine Frage)
  const anzahlFehler = new Set(
    (Object.keys(fehler) as (keyof CheckinEingabe)[]).map((feld) => abschnittVon(feld)),
  ).size;

  return (
    <>
      {/* Kopf */}
      <header className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-[420px] rounded-full bg-akzent/5 blur-[120px]"
        />
        <div className="relative mx-auto max-w-xl px-5 pb-8 pt-10">
          <Kicker>Wochen-Check-in</Kicker>
          <h1 className="mt-3 font-serif text-[40px] font-normal leading-[1.08] tracking-tight">
            {vorname ? `Hallo ${vorname}!` : "Hallo!"}{" "}
            <span className="italic text-akzent/90">Wie war deine Woche?</span>
          </h1>
          <p className="mt-3 text-[15px] text-text-zwei">8 kurze Fragen, etwa 2 Minuten.</p>
        </div>
      </header>

      {/* Fortschritt: bleibt beim Scrollen oben sichtbar */}
      <div className="sticky top-0 z-20 border-y border-linie bg-leinwand/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-xl items-center gap-4 px-5 py-3">
          <div
            role="progressbar"
            aria-label="Fortschritt"
            aria-valuemin={0}
            aria-valuemax={pflichtfelder.length}
            aria-valuenow={beantwortet}
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-spur"
          >
            <div
              className="h-full rounded-full bg-akzent transition-all duration-300"
              style={{ width: `${(beantwortet / pflichtfelder.length) * 100}%` }}
            />
          </div>
          <span
            className={`w-20 text-right font-mono text-[12px] tabular-nums ${
              alleBeantwortet ? "text-akzent" : "text-text-zwei"
            }`}
          >
            {alleBeantwortet ? "Fertig ✓" : `${beantwortet} von ${pflichtfelder.length}`}
          </span>
        </div>
      </div>

      <form noValidate onSubmit={absenden} className="mx-auto max-w-xl space-y-4 px-5 pb-16 pt-6">
        <Frageblock
          id="trainings"
          nummer={1}
          titel="Wie viele Trainings hattest du diese Woche?"
          fehler={fehler.trainingsGeplant ?? fehler.trainingsGeschafft}
        >
          <div className="flex flex-wrap gap-x-10 gap-y-5">
            <Zaehler
              id="trainingsGeplant"
              beschriftung="Geplant"
              wert={entwurf.trainingsGeplant}
              max={MAX_TRAININGS}
              fehlerId={fehler.trainingsGeplant ? "fehler-trainings" : undefined}
              onChange={(w) => setze("trainingsGeplant", w)}
            />
            <Zaehler
              id="trainingsGeschafft"
              beschriftung="Geschafft"
              wert={entwurf.trainingsGeschafft}
              max={MAX_TRAININGS}
              fehlerId={fehler.trainingsGeschafft ? "fehler-trainings" : undefined}
              onChange={(w) => setze("trainingsGeschafft", w)}
            />
          </div>
        </Frageblock>

        {skalen.map((skala, i) => (
          <Frageblock
            key={skala.schluessel}
            id={skala.schluessel}
            nummer={i + 2}
            titel={skala.frage}
            fehler={fehler[skala.schluessel]}
          >
            <Skala
              name={skala.schluessel}
              wert={entwurf[skala.schluessel]}
              links={skala.links}
              rechts={skala.rechts}
              hatFehler={Boolean(fehler[skala.schluessel])}
              onChange={(w) => setze(skala.schluessel, w)}
            />
          </Frageblock>
        ))}

        <Frageblock
          id="erfolg"
          nummer={6}
          titel="Was war dein größter Erfolg diese Woche?"
          hinweis={GESUNDHEITS_HINWEIS}
          fehler={fehler.erfolg}
        >
          <Textfeld
            id="erfolg"
            wert={entwurf.erfolg}
            platzhalter="Ein Satz reicht, z. B. „Zum ersten Mal 5 km am Stück gelaufen.“"
            hatFehler={Boolean(fehler.erfolg)}
            onChange={(w) => setze("erfolg", w)}
          />
        </Frageblock>

        <Frageblock
          id="huerde"
          nummer={7}
          titel="Was war deine größte Hürde?"
          hinweis={GESUNDHEITS_HINWEIS}
          fehler={fehler.huerde}
        >
          <Textfeld
            id="huerde"
            wert={entwurf.huerde}
            platzhalter="z. B. „Wenig Zeit wegen Prüfungen.“"
            hatFehler={Boolean(fehler.huerde)}
            onChange={(w) => setze("huerde", w)}
          />
        </Frageblock>

        <Frageblock
          id="frage"
          nummer={8}
          titel="Hast du eine Frage an deinen Coach?"
          hinweis="Optional."
          fehler={fehler.frage}
        >
          <Textfeld
            id="frage"
            wert={entwurf.frage}
            platzhalter="z. B. „Soll ich die Kniebeugen schwerer machen?“"
            hatFehler={Boolean(fehler.frage)}
            onChange={(w) => setze("frage", w)}
          />
        </Frageblock>

        <div className="space-y-4 pt-2">
          {anzahlFehler > 0 && (
            <p
              role="alert"
              className="flex items-center gap-2 rounded-subtil border border-ampel-rot/30 bg-ampel-rot/10 p-4 text-[14px] font-medium text-ampel-rot"
            >
              <CircleAlert size={17} strokeWidth={2} aria-hidden="true" />
              {anzahlFehler === 1 ? "Eine Angabe fehlt noch." : `${anzahlFehler} Angaben fehlen noch.`}
            </p>
          )}
          {sendeFehler && (
            <p
              role="alert"
              className="flex items-center gap-2 rounded-subtil border border-ampel-rot/30 bg-ampel-rot/10 p-4 text-[14px] font-medium text-ampel-rot"
            >
              <CircleAlert size={17} strokeWidth={2} aria-hidden="true" />
              Das hat nicht geklappt. Bitte versuch es gleich noch einmal.
            </p>
          )}
          <Button type="submit" disabled={sendet} className="h-[52px] w-full">
            {sendet ? "Wird gesendet …" : "Check-in absenden"}
            {!sendet && <Send size={17} strokeWidth={2} aria-hidden="true" />}
          </Button>
        </div>
      </form>
    </>
  );
}

function Bestaetigung({
  vorname,
  eingabe,
  children,
}: {
  vorname?: string;
  eingabe: CheckinEingabe;
  children?: ReactNode;
}) {
  return (
    <div className="relative mx-auto max-w-xl px-5 py-12">
      <span className="flex size-14 items-center justify-center rounded-full border border-akzent/30 bg-akzent/10 text-akzent">
        <Check size={26} strokeWidth={2} aria-hidden="true" />
      </span>
      <div className="mt-6">
        <Kicker>Check-in gesendet</Kicker>
      </div>
      <h1 className="mt-2 font-serif text-[40px] font-normal leading-tight tracking-tight">
        {vorname ? `Danke, ${vorname}!` : "Danke!"}
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-text-zwei">
        Dein Check-in ist angekommen. Dein Coach schaut ihn sich an und meldet sich.
      </p>

      <h2 className="mt-10 font-mono text-[11px] uppercase tracking-[0.1em] text-text-leise">
        Deine Woche in Zahlen
      </h2>
      <div className="mt-3">
        <WochenZahlen eingabe={eingabe} />
      </div>
      {children && <div className="mt-10">{children}</div>}
    </div>
  );
}
