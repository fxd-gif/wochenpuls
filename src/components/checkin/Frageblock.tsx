import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";

// Eine Frage im Formular als eigene Karte: Nummer, Frage, Eingabe, ggf. Fehler.
export function Frageblock({
  id,
  nummer,
  titel,
  hinweis,
  fehler,
  children,
}: {
  id: string;
  nummer: number;
  titel: string;
  hinweis?: string;
  fehler?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={`feld-${id}`}
      aria-labelledby={`titel-${id}`}
      className={`scroll-mt-24 rounded-panel border bg-flaeche p-5 transition-colors sm:p-6 ${
        fehler ? "border-ampel-rot/50" : "border-linie hover:border-linie-fokus"
      }`}
    >
      <div className="flex items-start gap-3.5">
        <span
          aria-hidden="true"
          className={`flex size-8 shrink-0 items-center justify-center rounded-full border bg-flaeche-hoch font-serif text-[15px] ${
            fehler ? "border-ampel-rot/50 text-ampel-rot" : "border-linie text-akzent"
          }`}
        >
          {nummer}
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={`titel-${id}`} className="pt-1 text-[16px] font-medium leading-snug">
            {titel}
          </h2>
          {hinweis && <p className="mt-1 text-[13px] text-text-leise">{hinweis}</p>}
        </div>
      </div>
      <div className="mt-5">{children}</div>
      {fehler && (
        <p
          id={`fehler-${id}`}
          className="mt-3 flex items-center gap-2 text-[13px] font-medium text-ampel-rot"
        >
          <CircleAlert size={15} strokeWidth={2} aria-hidden="true" />
          {fehler}
        </p>
      )}
    </section>
  );
}
