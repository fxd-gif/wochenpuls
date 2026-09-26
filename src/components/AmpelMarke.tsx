// Aussehen der vier Ampel-Zustände. Die Regeln, WANN ein Kunde welche
// Stufe bekommt, stehen in src/lib/ampel.ts.
export type AmpelStufe = "rot" | "gelb" | "gruen" | "neu";

// Tailwind braucht ausgeschriebene Klassennamen, deshalb stehen sie hier vollständig.
export const ampelStufen: Record<
  AmpelStufe,
  {
    wort: string;
    symbol: string;
    beschreibung: string;
    text: string; // Schriftfarbe
    punkt: string; // kleiner Farbpunkt
    marke: string; // getönte Fläche + Rand der Marke
    rand: string; // Rand von Karten in dieser Stufe
    getoent: string; // leicht getönte Kästen in Karten
  }
> = {
  rot: {
    wort: "Handeln",
    symbol: "▲",
    beschreibung: "Check-in überfällig oder die Woche ist gekippt. Jetzt melden.",
    text: "text-ampel-rot",
    punkt: "bg-ampel-rot",
    marke: "bg-ampel-rot/12 border-ampel-rot/30",
    rand: "border-ampel-rot/45",
    getoent: "bg-ampel-rot/8 border-ampel-rot/35",
  },
  gelb: {
    wort: "Beobachten",
    symbol: "!",
    beschreibung: "Ein Wert ist deutlich schlechter als sonst. Im Blick behalten.",
    text: "text-ampel-gelb",
    punkt: "bg-ampel-gelb",
    marke: "bg-ampel-gelb/12 border-ampel-gelb/30",
    rand: "border-ampel-gelb/35",
    getoent: "bg-ampel-gelb/8 border-ampel-gelb/30",
  },
  gruen: {
    wort: "Läuft",
    symbol: "✓",
    beschreibung: "Alles im grünen Bereich. Kein Eingriff nötig.",
    text: "text-ampel-gruen",
    punkt: "bg-ampel-gruen",
    marke: "bg-ampel-gruen/12 border-ampel-gruen/30",
    rand: "border-linie",
    getoent: "bg-flaeche-alt border-linie",
  },
  neu: {
    wort: "Neu",
    symbol: "○",
    beschreibung: "Frisch angelegt, wartet auf den ersten Check-in am Sonntag.",
    text: "text-ampel-neu",
    punkt: "bg-ampel-neu",
    marke: "bg-flaeche-alt border-linie",
    rand: "border-linie",
    getoent: "bg-flaeche-alt border-linie",
  },
};

// Getöntes Rechteck mit Symbol und Wort. Farbe allein reicht nie.
export function AmpelMarke({ stufe, gross = false }: { stufe: AmpelStufe; gross?: boolean }) {
  const { wort, symbol, text, marke } = ampelStufen[stufe];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-sm border font-semibold ${text} ${marke} ${
        gross ? "px-2.5 py-1 text-[13px]" : "px-2 py-0.5 text-[11px] uppercase tracking-wider"
      }`}
    >
      <span aria-hidden="true">{symbol}</span>
      {wort}
    </span>
  );
}
