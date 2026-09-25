import { LogOut } from "lucide-react";
import type { Metadata } from "next";
import { abmelden } from "@/app/login/aktionen";
import { CoachKopf } from "@/components/coach/CoachKopf";
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
    <main className="min-h-screen bg-flaeche">
      <CoachKopf
        basis="/coach"
        extra={
          <form action={abmelden}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-md px-3 py-2 font-medium transition-colors duration-200 hover:bg-weiss/10"
            >
              <LogOut size={18} strokeWidth={2.5} aria-hidden="true" />
              Abmelden
            </button>
          </form>
        }
      />
      {datenbankEingerichtet() ? (
        children
      ) : (
        <p className="mx-auto max-w-3xl px-4 py-16 text-lg">
          Die Datenbank ist noch nicht eingerichtet. Details stehen auf der Seite /status.
        </p>
      )}
    </main>
  );
}
