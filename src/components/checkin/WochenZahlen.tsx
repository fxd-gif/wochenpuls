import type { CheckinEingabe } from "@/lib/checkin";

// Die fünf Zahlen einer Woche als Kacheln (Danke-Seite und Detailseite)
export function WochenZahlen({
  eingabe,
  kachel = "bg-flaeche",
}: {
  eingabe: CheckinEingabe;
  kachel?: string;
}) {
  const zahlen = [
    { name: "Trainings", wert: `${eingabe.trainingsGeschafft} / ${eingabe.trainingsGeplant}` },
    { name: "Energie", wert: eingabe.energie },
    { name: "Schlaf", wert: eingabe.schlaf },
    { name: "Stress", wert: eingabe.stress },
    { name: "Motivation", wert: eingabe.motivation },
  ];
  return (
    <dl className="grid grid-cols-3 gap-3 sm:grid-cols-5">
      {zahlen.map((z) => (
        <div key={z.name} className={`rounded-md p-3 text-center ${kachel}`}>
          <dt className="text-xs font-semibold uppercase tracking-wider text-leise">{z.name}</dt>
          <dd className="mt-1 text-2xl font-extrabold tabular-nums">{z.wert}</dd>
        </div>
      ))}
    </dl>
  );
}
