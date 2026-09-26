// Gemeinsame Stil-Bausteine, damit Karten, Überschriften und Felder überall gleich aussehen.

// Karte / Datenmodul: Fläche mit Haarlinie
export const panelKlassen = "rounded-panel border border-linie bg-flaeche p-6 sm:p-7";

// Kleine Überschrift in Mono-Großbuchstaben (z. B. "Letzter Check-in")
export const mikroKlassen = "font-mono text-[11px] uppercase tracking-[0.1em] text-text-leise";

// Eingabefelder: dunkle Fläche, Haarlinie, beim Antippen salbeigrüner Rand
export const eingabeKlassen =
  "w-full rounded-subtil border border-linie-fokus bg-abschnitt px-4 text-[15px] text-text " +
  "placeholder:text-text-leise focus:border-akzent focus:outline-none disabled:opacity-50";
