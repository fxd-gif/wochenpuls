import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";

// Ein nummerierter Abschnitt im Formular: Nummer, Frage, Eingabe, ggf. Fehler.
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
    <section id={`feld-${id}`} aria-labelledby={`titel-${id}`} className="scroll-mt-24 py-7">
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors duration-200 ${
            fehler ? "bg-ampel-rot text-weiss" : "bg-primaer-hell text-primaer"
          }`}
        >
          {nummer}
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={`titel-${id}`} className="pt-1 text-xl font-bold leading-snug tracking-tight">
            {titel}
          </h2>
          {hinweis && <p className="mt-1 text-sm text-leise">{hinweis}</p>}
          <div className="mt-4">{children}</div>
          {fehler && (
            <p id={`fehler-${id}`} className="mt-3 flex items-center gap-2 text-sm font-medium text-fehler">
              <CircleAlert size={16} strokeWidth={2.5} aria-hidden="true" />
              {fehler}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
