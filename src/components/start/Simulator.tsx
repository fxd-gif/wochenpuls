"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { AmpelMarke } from "@/components/AmpelMarke";
import { ButtonLink } from "@/components/ui/Button";
import { bewerte } from "@/lib/ampel";

// Mini-Check-in auf der Startseite: zwei Regler, Ergebnis nach denselben Ampel-Regeln wie die Demo.
// Die übrigen Werte sind fest (unauffällig), die Daten sind ein fester Beispiel-Sonntag.
const GEPLANT = 4;
const stressWorte = ["", "sehr entspannt", "entspannt", "spürbar", "hoch", "sehr hoch"];

export function Simulator() {
  const [geschafft, setGeschafft] = useState(1);
  const [stress, setStress] = useState(5);

  const ampel = bewerte(
    { id: "probe", name: "Du", angelegtAm: "2026-01-01", archiviert: false },
    [
      {
        kundeId: "probe",
        woche: "2026-09-20",
        eingereichtAm: "2026-09-20T18:00:00",
        trainingsGeplant: GEPLANT,
        trainingsGeschafft: geschafft,
        energie: 4,
        schlaf: 4,
        stress,
        motivation: 4,
        erfolg: "",
        huerde: "",
        frage: "",
      },
    ],
    "2026-09-21",
  );

  const frage =
    "space-y-3 rounded-panel border border-linie bg-flaeche-hoch p-5 transition-colors hover:border-linie-fokus";

  return (
    <div className="halo relative rounded-panel border border-linie-fokus bg-flaeche p-6 sm:p-10">
      <div className="flex flex-col justify-between gap-4 border-b border-linie pb-8 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3.5">
          <span className="flex size-11 items-center justify-center rounded-full border border-akzent/30 bg-flaeche-hoch font-mono text-[15px] font-bold text-akzent">
            Du
          </span>
          <div>
            <p className="text-[17px] font-semibold">Dein Wochen-Check-in</p>
            <p className="font-mono text-[12px] text-text-leise">Sonntags · Persönlicher Link</p>
          </div>
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-sm border border-akzent/25 bg-akzent/10 px-3 py-1 font-mono text-[11px] font-medium text-akzent">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-akzent motion-safe:animate-pulse" />
          Live-Simulation
        </span>
      </div>

      <div className="flex flex-col gap-6 pt-8">
        <div className={frage}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <label htmlFor="sim-trainings" className="text-[14px] font-medium">
              1. Wie viele deiner {GEPLANT} geplanten Trainings hast du geschafft?
            </label>
            <span className="shrink-0 font-mono text-[14px] font-semibold text-text">
              {geschafft} {geschafft === 1 ? "Einheit" : "Einheiten"}
            </span>
          </div>
          <input
            id="sim-trainings"
            type="range"
            min={0}
            max={GEPLANT}
            value={geschafft}
            onChange={(e) => setGeschafft(Number(e.target.value))}
            className="mt-2 w-full"
          />
          <div aria-hidden="true" className="flex justify-between px-1 font-mono text-[11px] text-text-leise">
            {Array.from({ length: GEPLANT + 1 }, (_, i) => (
              <span key={i}>{i}</span>
            ))}
          </div>
        </div>

        <div className={frage}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <label htmlFor="sim-stress" className="text-[14px] font-medium">
              2. Wie gestresst warst du? (1 = entspannt, 5 = am Limit)
            </label>
            <span className="shrink-0 font-mono text-[14px] font-semibold text-text">
              Stufe {stress} ({stressWorte[stress]})
            </span>
          </div>
          <input
            id="sim-stress"
            type="range"
            min={1}
            max={5}
            value={stress}
            onChange={(e) => setStress(Number(e.target.value))}
            aria-valuetext={`Stufe ${stress}, ${stressWorte[stress]}`}
            className="mt-2 w-full"
          />
          <div aria-hidden="true" className="flex justify-between px-1 font-mono text-[11px] text-text-leise">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i}>{i}</span>
            ))}
          </div>
        </div>

        <div
          aria-live="polite"
          className="mt-2 flex flex-col justify-between gap-4 rounded-panel border-2 border-linie-fokus bg-flaeche-alt p-6 sm:flex-row sm:items-center"
        >
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-text-leise">
              Errechneter Wochenpuls-Status
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <AmpelMarke stufe={ampel.stufe} gross />
              <span className="text-[15px] font-medium">{ampel.gruende[0]}</span>
            </div>
          </div>
          <p className="border-t border-linie pt-3 font-mono text-[12px] text-text-leise sm:border-t-0 sm:pt-0 sm:text-right">
            Dieselben Regeln
            <br className="hidden sm:block" /> wie in der Demo
          </p>
        </div>

        <ButtonLink href="/demo/checkin" variante="sekundaer" className="self-start">
          Alle 8 Fragen ausfüllen
          <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
        </ButtonLink>
      </div>
    </div>
  );
}
