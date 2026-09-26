import type { Metadata } from "next";
import { connection } from "next/server";
import { Hinweisseite } from "@/components/ui/Hinweisseite";
import { anmeldungEingerichtet } from "@/lib/server/anmeldung";
import { datenbankEingerichtet, verbindungOk } from "@/lib/server/datenbank";

export const metadata: Metadata = {
  title: "Status · Wochenpuls",
  robots: { index: false },
};

// Zeigt nur, OB etwas eingerichtet ist – nie die Geheimnisse selbst.
export default async function StatusSeite() {
  await connection(); // bei jedem Aufruf neu prüfen
  const zeilen = [
    {
      name: "Datenbank verbunden",
      ok: datenbankEingerichtet() && (await verbindungOk()),
      hilfe: "FIREBASE_SERVICE_ACCOUNT fehlt oder ist ungültig.",
    },
    {
      name: "Coach-Login eingerichtet",
      ok: anmeldungEingerichtet(),
      hilfe: "COACH_PASSWORD oder SESSION_SECRET fehlt.",
    },
  ];

  return (
    <Hinweisseite kicker="Einrichtung" titel="Status">
      <ul className="divide-y divide-linie border-y border-linie">
        {zeilen.map((z) => (
          <li key={z.name} className="flex items-start justify-between gap-4 py-4">
            <div>
              <p className="font-medium text-text">{z.name}</p>
              {!z.ok && <p className="mt-0.5 text-[13px] text-text-leise">{z.hilfe}</p>}
            </div>
            <span
              className={`shrink-0 rounded-sm border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                z.ok
                  ? "border-ampel-gruen/30 bg-ampel-gruen/12 text-ampel-gruen"
                  : "border-ampel-rot/30 bg-ampel-rot/12 text-ampel-rot"
              }`}
            >
              {z.ok ? "✓ Ja" : "▲ Nein"}
            </span>
          </li>
        ))}
      </ul>
    </Hinweisseite>
  );
}
