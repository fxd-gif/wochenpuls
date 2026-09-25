import { CircleCheck, CircleX } from "lucide-react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { anmeldungEingerichtet } from "@/lib/server/anmeldung";
import { datenbankEingerichtet, verbindungOk } from "@/lib/server/datenbank";

export const metadata: Metadata = {
  title: "Status · Wochenpuls",
  robots: { index: false },
};

// Zeigt nur, OB etwas eingerichtet ist – nie die Geheimnisse selbst.
export default async function StatusSeite() {
  await connection(); // bei jedem Aufruf neu prüfen
  const datenbank = datenbankEingerichtet() && (await verbindungOk());
  const login = anmeldungEingerichtet();

  const zeilen = [
    {
      name: "Datenbank verbunden",
      ok: datenbank,
      hilfe: "FIREBASE_SERVICE_ACCOUNT fehlt oder ist ungültig.",
    },
    { name: "Coach-Login eingerichtet", ok: login, hilfe: "COACH_PASSWORD oder SESSION_SECRET fehlt." },
  ];

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-16">
      <h1 className="text-4xl font-extrabold tracking-tight">Status</h1>
      <ul className="mt-8 space-y-3">
        {zeilen.map((z) => (
          <li key={z.name} className="flex items-start gap-3 rounded-lg bg-flaeche p-5">
            {z.ok ? (
              <CircleCheck
                className="shrink-0 text-ampel-gruen"
                size={28}
                strokeWidth={2.5}
                aria-hidden="true"
              />
            ) : (
              <CircleX className="shrink-0 text-ampel-rot" size={28} strokeWidth={2.5} aria-hidden="true" />
            )}
            <div>
              <p className="text-lg font-bold">
                {z.name}: {z.ok ? "ja" : "nein"}
              </p>
              {!z.ok && <p className="text-leise">{z.hilfe}</p>}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
