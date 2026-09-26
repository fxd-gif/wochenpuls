import { eingabeKlassen } from "@/components/ui/stil";
import { MAX_TEXTLAENGE } from "@/lib/checkin";

// Mehrzeiliges Textfeld mit Zeichenzähler
export function Textfeld({
  id,
  wert,
  platzhalter,
  hatFehler,
  onChange,
}: {
  id: string;
  wert: string;
  platzhalter: string;
  hatFehler: boolean;
  onChange: (wert: string) => void;
}) {
  return (
    <div>
      <textarea
        id={`eingabe-${id}`}
        aria-labelledby={`titel-${id}`}
        aria-describedby={`${hatFehler ? `fehler-${id} ` : ""}zaehler-${id}`}
        aria-invalid={hatFehler || undefined}
        rows={3}
        maxLength={MAX_TEXTLAENGE}
        value={wert}
        placeholder={platzhalter}
        onChange={(e) => onChange(e.target.value)}
        className={`${eingabeKlassen} block resize-y py-3 leading-relaxed aria-invalid:border-ampel-rot/60`}
      />
      <p
        id={`zaehler-${id}`}
        className="mt-1.5 text-right font-mono text-[11px] text-text-leise tabular-nums"
      >
        {wert.length} / {MAX_TEXTLAENGE}
      </p>
    </div>
  );
}
