import type { Checkin, Kunde } from "@/lib/checkin";
import { datumKurz } from "@/lib/woche";

// Alle Kunden auf einer Seite. Funktioniert für Demo und echte Daten gleich.
export function Uebersicht({ kunden, checkins }: { kunden: Kunde[]; checkins: Checkin[] }) {
  const aktive = kunden.filter((k) => !k.archiviert);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Deine Kunden</h1>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {aktive.map((kunde) => {
          const letzter = checkins.filter((c) => c.kundeId === kunde.id).at(-1);
          return (
            <li key={kunde.id} className="rounded-lg bg-weiss p-6">
              <h2 className="text-2xl font-bold tracking-tight">{kunde.name}</h2>
              <p className="mt-2 text-sm text-leise">
                {letzter ? `Letzter Check-in: ${datumKurz(letzter.woche)}` : "Noch kein Check-in"}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
