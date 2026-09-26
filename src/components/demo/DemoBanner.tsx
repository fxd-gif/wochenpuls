import Link from "next/link";

// Schmaler Hinweis über jeder Demo-Seite
export function DemoBanner() {
  return (
    <div className="border-b border-linie bg-abschnitt">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.08em] lg:px-8">
        <span className="flex items-center gap-2 text-text-zwei">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-text-leise" />
          Demo · Alle Daten sind erfunden
        </span>
        <Link href="/" className="text-text-zwei transition-colors hover:text-text">
          Zur Startseite
        </Link>
      </div>
    </div>
  );
}
