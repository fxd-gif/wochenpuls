// Aussehen der vier Ampel-Zustände. Die Regeln, WANN ein Kunde welche
// Stufe bekommt, kommen später in src/lib/ampel.ts.
export type AmpelStufe = "rot" | "gelb" | "gruen" | "neu";

export const ampelStufen: Record<
  AmpelStufe,
  { wort: string; symbol: string; kreis: string; beschreibung: string }
> = {
  rot: {
    wort: "Handeln",
    symbol: "▲",
    kreis: "bg-ampel-rot text-weiss",
    beschreibung: "Check-in überfällig oder die Woche ist gekippt.",
  },
  gelb: {
    wort: "Beobachten",
    symbol: "!",
    kreis: "bg-ampel-gelb text-dunkel",
    beschreibung: "Ein Wert ist deutlich schlechter als sonst.",
  },
  gruen: {
    wort: "Läuft",
    symbol: "✓",
    kreis: "bg-ampel-gruen text-dunkel",
    beschreibung: "Alles im grünen Bereich.",
  },
  neu: {
    wort: "Neu",
    symbol: "○",
    kreis: "bg-ampel-neu text-dunkel",
    beschreibung: "Wartet auf den ersten Check-in.",
  },
};

// Farbiger Kreis mit Symbol, daneben das Wort. Farbe allein reicht nie.
export function AmpelMarke({ stufe, gross = false }: { stufe: AmpelStufe; gross?: boolean }) {
  const { wort, symbol, kreis } = ampelStufen[stufe];
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold ${kreis} ${
          gross ? "size-10 text-lg" : "size-7 text-sm"
        }`}
      >
        {symbol}
      </span>
      <span className={`font-semibold uppercase tracking-wider ${gross ? "text-sm" : "text-xs"}`}>
        {wort}
      </span>
    </span>
  );
}
