import { LogOut } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { abmelden } from "@/app/login/aktionen";
import { CoachKopf } from "@/components/coach/CoachKopf";
import { Hinweisseite } from "@/components/ui/Hinweisseite";
import { anmeldungPruefen } from "@/lib/server/anmeldung";
import { datenbankEingerichtet } from "@/lib/server/datenbank";

export const metadata: Metadata = {
  title: "Coach · Wochenpuls",
  robots: { index: false },
};

// Rahmen aller Coach-Seiten. Jede Seite prüft die Anmeldung zusätzlich selbst.
export default async function CoachRahmen({ children }: LayoutProps<"/coach">) {
  await anmeldungPruefen();
  return (
    <>
      <CoachKopf
        basis="/coach"
        etikett="Coach"
        extra={
          <form action={abmelden}>
            <button
              type="submit"
              className="flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-subtil px-3 text-text-zwei transition-colors hover:bg-flaeche hover:text-text"
            >
              <LogOut size={15} strokeWidth={1.75} aria-hidden="true" />
              <span className="hidden sm:inline">Abmelden</span>
              <span className="sr-only sm:hidden">Abmelden</span>
            </button>
          </form>
        }
      />
      {datenbankEingerichtet() ? (
        <main className="flex-1">{children}</main>
      ) : (
        <Hinweisseite kicker="Einrichtung" titel="Datenbank noch nicht verbunden." mitLogo={false}>
          Sobald die Firebase-Zugangsdaten bei Vercel hinterlegt sind, erscheinen hier deine Kunden. Den
          aktuellen Stand zeigt die{" "}
          <Link href="/status" className="text-akzent underline underline-offset-4">
            Statusseite
          </Link>
          .
        </Hinweisseite>
      )}
    </>
  );
}
