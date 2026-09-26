import Link from "next/link";

// Das Wochenpuls-Zeichen: Pulslinie im Kästchen, daneben der Name mit pulsierendem Punkt
export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="group flex min-h-11 items-center gap-2.5">
      <span className="flex size-8 items-center justify-center rounded-subtil border border-linie-fokus bg-flaeche-hoch transition-colors group-hover:border-akzent/50">
        <svg
          aria-hidden="true"
          className="size-4 text-akzent"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          viewBox="0 0 24 24"
        >
          <path d="M2 12h4l2.5-6 4 12 3-8 2.5 5 2-3h4" />
        </svg>
      </span>
      <span className="flex items-baseline gap-1.5">
        <span className="text-[15px] font-semibold tracking-tight text-text">Wochenpuls</span>
        <span aria-hidden="true" className="size-1.5 rounded-full bg-akzent motion-safe:animate-pulse" />
      </span>
    </Link>
  );
}

// Kleines Etikett in Mono-Schrift, z. B. "Portfolio-Projekt"
export function Etikett({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-sm border border-akzent/20 bg-akzent/10 px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.08em] text-akzent/80">
      {children}
    </span>
  );
}
