import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { Kicker } from "./Abschnittskopf";

// Zentrierte Karte für kurze Seiten: Login, Status, Fehler, ungültiger Link.
export function Hinweisseite({
  kicker,
  titel,
  children,
  mitLogo = true,
}: {
  kicker: string;
  titel: ReactNode;
  children?: ReactNode;
  mitLogo?: boolean;
}) {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 size-[520px] -translate-x-1/2 rounded-full bg-akzent/5 blur-[140px]"
      />
      <div className="halo relative w-full max-w-md rounded-panel border border-linie-fokus bg-flaeche p-8">
        {mitLogo && (
          <div className="mb-8 border-b border-linie pb-6">
            <Logo />
          </div>
        )}
        <Kicker>{kicker}</Kicker>
        <h1 className="mt-2 font-serif text-[34px] font-normal leading-tight tracking-tight">{titel}</h1>
        {children && <div className="mt-4 text-[15px] leading-relaxed text-text-zwei">{children}</div>}
      </div>
    </main>
  );
}
