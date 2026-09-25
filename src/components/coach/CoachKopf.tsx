import { Activity } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

// Dunkle Kopfzeile aller Coach-Seiten (Demo und echt). "basis" ist "/demo" oder "/coach".
export function CoachKopf({ basis, extra }: { basis: string; extra?: ReactNode }) {
  const link = "rounded-md px-3 py-2 font-medium transition-colors duration-200 hover:bg-weiss/10";
  return (
    <header className="auf-farbe bg-dunkel text-weiss">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-2 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
        <Link href={basis} className="mr-auto flex items-center gap-2 font-bold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-full bg-primaer-leuchtend">
            <Activity size={18} strokeWidth={2.5} aria-hidden="true" />
          </span>
          Wochenpuls
        </Link>
        <Link href={basis} className={link}>
          Übersicht
        </Link>
        <Link href={`${basis}/kunden`} className={link}>
          Kunden
        </Link>
        {extra}
      </nav>
    </header>
  );
}
