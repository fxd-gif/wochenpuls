import type { ReactNode } from "react";

// Kleine Überzeile: grüner Punkt + Mono-Großbuchstaben
export function Kicker({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden="true" className="size-2 rounded-full bg-akzent" />
      <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-leise">{children}</p>
    </div>
  );
}

// Kopf eines Abschnitts: Überzeile, Serif-Überschrift, Erklärtext.
// "seitlich": Erklärtext rechts daneben, mit Haarlinie darunter (wie "Diese Woche").
export function Abschnittskopf({
  kicker,
  titel,
  text,
  seitlich = false,
  ebene = "h2",
}: {
  kicker: string;
  titel: ReactNode;
  text?: ReactNode;
  seitlich?: boolean;
  ebene?: "h1" | "h2";
}) {
  const Titel = ebene;
  const titelKlassen =
    "mt-2 font-serif text-3xl font-normal tracking-tight text-text sm:text-4xl lg:text-[44px]";

  if (seitlich) {
    return (
      <div className="mb-10 flex flex-col justify-between gap-6 border-b border-linie pb-6 md:flex-row md:items-end lg:mb-14">
        <div>
          <Kicker>{kicker}</Kicker>
          <Titel className={titelKlassen}>{titel}</Titel>
        </div>
        {text && (
          <div className="max-w-md text-[14px] leading-relaxed text-text-zwei sm:text-[15px]">{text}</div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-12 lg:mb-16">
      <Kicker>{kicker}</Kicker>
      <Titel className={titelKlassen}>{titel}</Titel>
      {text && <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-zwei">{text}</p>}
    </div>
  );
}
