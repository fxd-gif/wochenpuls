import type { Checkin, Kunde } from "@/lib/checkin";
import { checkinWoche, datumKurz, ueberfaelligeTage } from "@/lib/woche";

// Alle Kunden auf einer Seite. Funktioniert für Demo und echte Daten gleich.
export function Uebersicht({
  kunden,
  checkins,
  heute,
}: {
  kunden: Kunde[];
  checkins: Checkin[];
  heute: string;
}) {
  const aktive = kunden.filter((k) => !k.archiviert);
  const dieseWoche = checkinWoche(heute);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <p className="text-sm font-semibold uppercase tracking-wider text-leise">
        Woche bis {datumKurz(dieseWoche)}
      </p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">Deine Kunden</h1>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {aktive.map((kunde) => {
          const eigene = checkins.filter((c) => c.kundeId === kunde.id);
          const letzter = eigene.at(-1);
          const offen = !eigene.some((c) => c.woche === dieseWoche);
          const ueberfaellig = ueberfaelligeTage(kunde.angelegtAm, letzter?.woche, heute);
          return (
            <li key={kunde.id} className="rounded-lg bg-weiss p-6">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-2xl font-bold tracking-tight">{kunde.name}</h2>
                {offen && (
                  <span className="rounded-full bg-flaeche px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                    Check-in offen
                  </span>
                )}
              </div>
              {ueberfaellig > 0 && (
                <p className="mt-2 font-medium">Seit {ueberfaellig} Tagen überfällig</p>
              )}
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
