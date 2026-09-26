import { Minus, Plus } from "lucide-react";

// Zahl mit Minus- und Plus-Knopf. Startet leer ("–"), damit bewusst geantwortet wird.
export function Zaehler({
  id,
  beschriftung,
  wert,
  max,
  fehlerId,
  onChange,
}: {
  id: string;
  beschriftung: string;
  wert: number | null;
  max: number;
  fehlerId?: string;
  // bekommt eine Rechenregel statt eines festen Werts, damit schnelles Tippen nichts verliert
  onChange: (rechne: (alt: number | null) => number) => void;
}) {
  const knopf =
    "flex size-12 items-center justify-center rounded-subtil border border-linie-fokus bg-flaeche-hoch text-text " +
    "transition-colors hover:bg-flaeche-alt active:scale-95 disabled:pointer-events-none disabled:opacity-35";

  return (
    <div role="group" aria-labelledby={`beschriftung-${id}`} aria-describedby={fehlerId}>
      <p
        id={`beschriftung-${id}`}
        className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-text-leise"
      >
        {beschriftung}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={knopf}
          aria-label={`${beschriftung}: eins weniger`}
          disabled={wert === 0}
          onClick={() => onChange((alt) => Math.max(0, (alt ?? 1) - 1))}
        >
          <Minus size={18} strokeWidth={2} aria-hidden="true" />
        </button>
        <output aria-live="polite" className="w-14 text-center font-mono text-3xl tabular-nums">
          {wert ?? "–"}
        </output>
        <button
          type="button"
          className={knopf}
          aria-label={`${beschriftung}: eins mehr`}
          disabled={wert === max}
          onClick={() => onChange((alt) => Math.min(max, (alt ?? 0) + 1))}
        >
          <Plus size={18} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
