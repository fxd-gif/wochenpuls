// Fünf große Tipp-Knöpfe von 1 bis 5. Technisch echte Radio-Buttons,
// damit Tastatur und Screenreader sie verstehen.
export function Skala({
  name,
  wert,
  links,
  rechts,
  hatFehler,
  onChange,
}: {
  name: string;
  wert: number | null;
  links: string;
  rechts: string;
  hatFehler: boolean;
  onChange: (wert: number) => void;
}) {
  return (
    <div>
      <div
        role="radiogroup"
        aria-labelledby={`titel-${name}`}
        aria-describedby={hatFehler ? `fehler-${name}` : undefined}
        className="grid grid-cols-5 gap-2"
      >
        {[1, 2, 3, 4, 5].map((zahl) => (
          <label key={zahl} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={zahl}
              checked={wert === zahl}
              onChange={() => onChange(zahl)}
              aria-label={zahl === 1 ? `1, ${links}` : zahl === 5 ? `5, ${rechts}` : String(zahl)}
              className="peer sr-only"
            />
            <span className="flex h-12 items-center justify-center rounded-subtil border border-linie bg-flaeche-hoch font-mono text-[17px] text-text-zwei transition-colors hover:border-linie-fokus hover:text-text peer-checked:border-akzent peer-checked:bg-akzent peer-checked:font-semibold peer-checked:text-auf-akzent peer-checked:hover:border-akzent peer-checked:hover:bg-akzent peer-checked:hover:text-auf-akzent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-akzent">
              {zahl}
            </span>
          </label>
        ))}
      </div>
      <div aria-hidden="true" className="mt-2 flex justify-between text-[12px] text-text-leise">
        <span>{links}</span>
        <span>{rechts}</span>
      </div>
    </div>
  );
}
