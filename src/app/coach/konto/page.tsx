import type { Metadata } from "next";
import Link from "next/link";
import { KontoLoeschen } from "@/components/coach/KontoLoeschen";
import { Abschnittskopf } from "@/components/ui/Abschnittskopf";
import { mikroKlassen, panelKlassen } from "@/components/ui/stil";
import { anmeldungPruefen } from "@/lib/server/anmeldung";
import { alleKunden } from "@/lib/server/datenbank";
import { datumMitJahr } from "@/lib/woche";
import { kontoLoeschen } from "./aktionen";

export const metadata: Metadata = { title: "Konto · Wochenpuls", robots: { index: false } };

export default async function KontoSeite() {
  const coach = await anmeldungPruefen();
  const anzahl = (await alleKunden(coach.uid)).length;
  const kunden = anzahl === 1 ? "1 Kunde" : `${anzahl} Kunden`;

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8 lg:py-16">
      <Abschnittskopf ebene="h1" seitlich kicker="Nur für dich" titel="Dein Konto" />

      <section className={panelKlassen}>
        <h2 className={mikroKlassen}>Angemeldet mit Google</h2>
        <p className="mt-2 break-all text-[16px]">{coach.email}</p>
        {!coach.istAdmin && coach.avvAm && (
          <p className="mt-4 text-[14px] text-text-zwei">
            Vertrag zur Auftragsverarbeitung abgeschlossen am {datumMitJahr(coach.avvAm)} (Fassung{" "}
            {coach.avvFassung}) ·{" "}
            <Link href="/avv" className="text-akzent underline underline-offset-4">
              Vertrag lesen
            </Link>
          </p>
        )}
      </section>

      <section className={`${panelKlassen} mt-6`}>
        <h2 className={mikroKlassen}>Konto löschen</h2>
        <p className="mt-2 mb-4 text-[14px] text-text-zwei">
          Löscht dein Konto, alle deine Kunden (aktuell {kunden}) mit ihren Check-ins, Notizen und Einwilligungen
          und deinen Zugang zu Wochenpuls. Das lässt sich nicht rückgängig machen.
        </p>
        <KontoLoeschen
          aktion={kontoLoeschen}
          knopf="Konto löschen"
          frage={`Konto endgültig löschen? Alle deine Kunden (aktuell ${kunden}) mit Check-ins, Notizen und Einwilligungen gehen für immer verloren.`}
        />
      </section>
    </div>
  );
}
