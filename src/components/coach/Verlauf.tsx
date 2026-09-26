import { skalen, type Checkin, type SkalaSchluessel } from "@/lib/checkin";
import { mikroKlassen, panelKlassen } from "@/components/ui/stil";
import { datumKurz, letzterFaelligkeitstag, plusTage } from "@/lib/woche";

const WOCHEN = 8;
const titel: Record<SkalaSchluessel, string> = {
  energie: "Energie",
  schlaf: "Schlaf",
  stress: "Stress",
  motivation: "Motivation",
};

// Maße der kleinen Diagramme (in SVG-Einheiten, skaliert mit der Breite)
const B = 320;
const H = 150;
const RAND = { links: 24, rechts: 28, oben: 12, unten: 24 };
const x = (i: number) => RAND.links + (i * (B - RAND.links - RAND.rechts)) / (WOCHEN - 1);
const y = (wert: number) => RAND.oben + ((5 - wert) * (H - RAND.oben - RAND.unten)) / 4;

// Vier kleine Verlaufskurven (je eine pro Skala) über die letzten 8 Wochen.
// Verpasste Wochen bleiben als Lücke sichtbar.
export function Verlauf({ checkins, heute }: { checkins: Checkin[]; heute: string }) {
  // Letzte Woche im Diagramm: der letzte Fälligkeitstag, oder ein schon eingereichter Check-in für die laufende Woche
  const letzteWoche = [letzterFaelligkeitstag(heute), ...checkins.map((c) => c.woche)].sort().at(-1)!;
  const wochen = Array.from({ length: WOCHEN }, (_, i) => plusTage(letzteWoche, -7 * (WOCHEN - 1 - i)));
  const proWoche = wochen.map((w) => checkins.find((c) => c.woche === w));

  return (
    <section className={`mt-6 ${panelKlassen}`}>
      <h2 className={mikroKlassen}>Verlauf der letzten 8 Wochen</h2>
      <div className="mt-5 grid gap-x-10 gap-y-8 md:grid-cols-2">
        {skalen.map(({ schluessel }) => (
          <figure key={schluessel}>
            <figcaption className="font-serif text-[20px] leading-tight">
              {titel[schluessel]}
              {schluessel === "stress" && (
                <span className="font-sans text-[13px] text-text-leise"> · niedriger ist besser</span>
              )}
            </figcaption>
            <Diagramm werte={proWoche.map((c) => c?.[schluessel])} wochen={wochen} name={titel[schluessel]} />
          </figure>
        ))}
      </div>

      <details className="mt-6 border-t border-linie pt-5">
        <summary className="cursor-pointer text-[14px] font-medium text-akzent">Als Tabelle anzeigen</summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left font-mono text-[13px] tabular-nums">
            <thead className="font-sans text-text-leise">
              <tr>
                <th className="py-2 pr-4 font-medium">Woche bis</th>
                <th className="py-2 pr-4 font-medium">Trainings</th>
                {skalen.map(({ schluessel }) => (
                  <th key={schluessel} className="py-2 pr-4 font-medium">
                    {titel[schluessel]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {wochen.map((w, i) => {
                const c = proWoche[i];
                return (
                  <tr key={w} className="border-t border-linie">
                    <td className="py-2 pr-4">{datumKurz(w)}</td>
                    {c ? (
                      <>
                        <td className="py-2 pr-4">
                          {c.trainingsGeschafft} / {c.trainingsGeplant}
                        </td>
                        {skalen.map(({ schluessel }) => (
                          <td key={schluessel} className="py-2 pr-4">
                            {c[schluessel]}
                          </td>
                        ))}
                      </>
                    ) : (
                      <td colSpan={5} className="py-2 pr-4 font-sans text-text-leise">
                        kein Check-in
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}

function Diagramm({
  werte,
  wochen,
  name,
}: {
  werte: (number | undefined)[];
  wochen: string[];
  name: string;
}) {
  // Linienstücke nur zwischen direkt aufeinanderfolgenden Wochen
  const stuecke: string[] = [];
  werte.forEach((wert, i) => {
    const davor = werte[i - 1];
    if (i > 0 && wert !== undefined && davor !== undefined) {
      stuecke.push(`M${x(i - 1)},${y(davor)}L${x(i)},${y(wert)}`);
    }
  });
  const letzterIndex = werte.findLastIndex((w) => w !== undefined);

  return (
    <svg viewBox={`0 0 ${B} ${H}`} className="mt-2 w-full" role="img" aria-label={`${name} über 8 Wochen`}>
      {/* Hilfslinien 1 bis 5 */}
      {[1, 2, 3, 4, 5].map((stufe) => (
        <g key={stufe}>
          <line
            x1={RAND.links}
            x2={B - RAND.rechts}
            y1={y(stufe)}
            y2={y(stufe)}
            className="stroke-linie-fokus"
            strokeWidth={1}
          />
          <text
            x={RAND.links - 10}
            y={y(stufe)}
            dy="0.35em"
            textAnchor="middle"
            className="fill-text-leise font-mono text-[10px]"
          >
            {stufe}
          </text>
        </g>
      ))}
      <text x={x(0)} y={H - 4} textAnchor="start" className="fill-text-leise font-mono text-[10px]">
        {datumKurz(wochen[0])}
      </text>
      <text x={x(WOCHEN - 1)} y={H - 4} textAnchor="end" className="fill-text-leise font-mono text-[10px]">
        {datumKurz(wochen[WOCHEN - 1])}
      </text>

      <path
        d={stuecke.join("")}
        className="stroke-akzent"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {werte.map((wert, i) =>
        wert === undefined ? null : (
          <g key={wochen[i]}>
            <title>{`Woche bis ${datumKurz(wochen[i])}: ${wert}`}</title>
            {/* großer unsichtbarer Bereich, damit der Tooltip leicht zu treffen ist */}
            <circle cx={x(i)} cy={y(wert)} r={12} fill="transparent" />
            <circle cx={x(i)} cy={y(wert)} r={4} className="fill-akzent stroke-flaeche" strokeWidth={2} />
          </g>
        ),
      )}

      {letzterIndex >= 0 && (
        <text
          x={x(letzterIndex) + 10}
          y={y(werte[letzterIndex]!)}
          dy="0.35em"
          className="fill-text font-mono text-[13px] font-semibold"
        >
          {werte[letzterIndex]}
        </text>
      )}
    </svg>
  );
}
