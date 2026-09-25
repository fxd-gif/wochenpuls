"use client";

import { Check, CircleAlert, Send } from "lucide-react";
import { useState, type ReactNode } from "react";
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
      {/* Kopf: blaue Fläche */}
      <header className="auf-farbe relative overflow-hidden bg-primaer text-weiss">
        <div aria-hidden="true" className="absolute -right-16 -top-20 size-56 rounded-full bg-weiss/10" />
        <div className="relative mx-auto max-w-xl px-4 pb-10 pt-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-weiss/80">Wochen-Check-in</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight">
            {vorname ? `Hallo ${vorname}!` : "Hallo!"}
            <br />
            Wie war deine Woche?
          </h1>
          <p className="mt-3 text-lg">8 kurze Fragen, etwa 2 Minuten.</p>
        </div>
      </header>

      {/* Fortschritt: bleibt beim Scrollen oben sichtbar */}
      <div className="sticky top-0 z-10 bg-weiss">
        <div className="mx-auto flex max-w-xl items-center gap-4 px-4 py-3">
          <div
            role="progressbar"
            aria-label="Fortschritt"
            aria-valuemin={0}
            aria-valuemax={pflichtfelder.length}
            aria-valuenow={beantwortet}
            className="h-2 flex-1 overflow-hidden rounded-full bg-flaeche"
          >
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                alleBeantwortet ? "bg-sekundaer" : "bg-primaer-leuchtend"
              }`}
              style={{ width: `${(beantwortet / pflichtfelder.length) * 100}%` }}
            />
          </div>
          <span className="w-24 text-right text-sm font-semibold tabular-nums">
            {alleBeantwortet ? "Fertig!" : `${beantwortet} von ${pflichtfelder.length}`}
          </span>
        </div>
      </div>

      <form noValidate onSubmit={absenden} className="mx-auto max-w-xl px-4 pb-16">
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

        <div className="mt-4 space-y-4">
          {anzahlFehler > 0 && (
            <p
              role="alert"
              className="flex items-center gap-2 rounded-md bg-flaeche p-4 font-medium text-fehler"
            >
              <CircleAlert size={20} strokeWidth={2.5} aria-hidden="true" />
              {anzahlFehler === 1 ? "Eine Angabe fehlt noch." : `${anzahlFehler} Angaben fehlen noch.`}
            </p>
          )}
          {sendeFehler && (
            <p
              role="alert"
              className="flex items-center gap-2 rounded-md bg-flaeche p-4 font-medium text-fehler"
            >
              <CircleAlert size={20} strokeWidth={2.5} aria-hidden="true" />
              Das hat nicht geklappt. Bitte versuch es gleich noch einmal.
            </p>
          )}
          <Button type="submit" disabled={sendet} className="w-full text-lg">
            {sendet ? "Wird gesendet …" : "Check-in absenden"}
            {!sendet && <Send size={20} strokeWidth={2.5} aria-hidden="true" />}
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
    <div>
      <section className="relative overflow-hidden bg-sekundaer text-dunkel">
        <div aria-hidden="true" className="absolute -right-12 -top-16 size-56 rounded-full bg-weiss/20" />
        <div className="relative mx-auto max-w-xl px-4 pb-12 pt-12">
          <span className="flex size-16 items-center justify-center rounded-full bg-weiss text-sekundaer">
            <Check size={34} strokeWidth={3} aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight">
            {vorname ? `Danke, ${vorname}!` : "Danke!"}
          </h1>
          <p className="mt-3 text-lg">
            Dein Check-in ist angekommen. Dein Coach schaut ihn sich an und meldet sich.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-xl px-4 py-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-leise">Deine Woche in Zahlen</h2>
        <div className="mt-4">
          <WochenZahlen eingabe={eingabe} />
        </div>
        {children && <div className="mt-10">{children}</div>}
      </div>
    </div>
  );
}
