import { MAX_TEXTLAENGE } from "@/lib/checkin";

// Mehrzeiliges Textfeld: grau, beim Antippen weiß mit blauem Rand.
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
        className={`block w-full resize-y rounded-md border-2 bg-flaeche px-4 py-3 text-lg leading-relaxed placeholder:text-leise/80 focus:border-primaer focus:bg-weiss focus:outline-none ${
          hatFehler ? "border-fehler" : "border-transparent"
        }`}
      />
      <p id={`zaehler-${id}`} className="mt-1 text-right text-xs text-leise tabular-nums">
        {wert.length} / {MAX_TEXTLAENGE}
      </p>
    </div>
  );
}
