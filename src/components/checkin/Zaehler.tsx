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
    "flex size-14 items-center justify-center rounded-md bg-flaeche transition-all duration-200 " +
    "hover:scale-105 hover:bg-flaeche-dunkel disabled:pointer-events-none disabled:opacity-40";

  return (
    <div role="group" aria-labelledby={`beschriftung-${id}`} aria-describedby={fehlerId}>
      <p id={`beschriftung-${id}`} className="mb-2 text-sm font-semibold uppercase tracking-wider text-leise">
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
          <Minus size={22} strokeWidth={2.5} aria-hidden="true" />
        </button>
        <output aria-live="polite" className="w-14 text-center text-3xl font-extrabold tabular-nums">
          {wert ?? "–"}
        </output>
        <button
          type="button"
          className={knopf}
          aria-label={`${beschriftung}: eins mehr`}
          disabled={wert === max}
          onClick={() => onChange((alt) => Math.min(max, (alt ?? 0) + 1))}
        >
          <Plus size={22} strokeWidth={2.5} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
