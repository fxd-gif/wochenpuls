import type { CheckinEingabe } from "@/lib/checkin";

// Die fünf Zahlen einer Woche als Kacheln (Danke-Seite und Detailseite)
export function WochenZahlen({ eingabe }: { eingabe: CheckinEingabe }) {
  const zahlen = [
    { name: "Trainings", wert: `${eingabe.trainingsGeschafft} / ${eingabe.trainingsGeplant}` },
    { name: "Energie", wert: eingabe.energie },
    { name: "Schlaf", wert: eingabe.schlaf },
    { name: "Stress", wert: eingabe.stress },
    { name: "Motivation", wert: eingabe.motivation },
  ];
  return (
    <dl className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
      {zahlen.map((z) => (
        <div key={z.name} className="rounded-subtil border border-linie bg-flaeche-alt px-3 py-3">
          <dt className="text-[11px] font-medium text-text-leise">{z.name}</dt>
          <dd className="mt-1 font-mono text-xl text-text tabular-nums">{z.wert}</dd>
        </div>
      ))}
    </dl>
  );
}
