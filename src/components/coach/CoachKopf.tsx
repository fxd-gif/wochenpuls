import type { ReactNode } from "react";
import { Etikett, Logo } from "@/components/Logo";
import { NavLink } from "./NavLink";

// Kopfzeile aller Coach-Seiten (Demo und echt). "basis" ist "/demo" oder "/coach".
export function CoachKopf({ basis, etikett, extra }: { basis: string; etikett: string; extra?: ReactNode }) {
  return (
    <header className="sticky top-0 z-40 border-b border-linie bg-leinwand/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        <div className="flex items-center gap-3">
          <Logo href={basis} />
          <span className="hidden text-xs text-text-leise sm:inline">/</span>
          <span className="hidden sm:inline">
            <Etikett>{etikett}</Etikett>
          </span>
        </div>
        <nav aria-label="Coach-Bereich" className="flex items-center gap-1 text-[13px] font-medium">
          <NavLink href={basis} genau>
            Übersicht
          </NavLink>
          <NavLink href={`${basis}/kunden`}>Kunden</NavLink>
          {extra}
        </nav>
      </div>
    </header>
  );
}
