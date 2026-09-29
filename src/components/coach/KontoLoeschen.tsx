"use client";

import { Trash2 } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

// "Konto löschen" mit Rückfrage in der Zeile (kein Browser-Dialog): erst der Knopf, dann "Endgültig löschen" oder "Abbrechen".
// Für den Coach selbst und für den Admin in der Code-Zeile. "code" wird nur beim Admin mitgeschickt.
export function KontoLoeschen({
  aktion,
  knopf,
  frage,
  code,
}: {
  aktion: (vorher: string | null, daten: FormData) => Promise<string | null>;
  knopf: string;
  frage: string;
  code?: string;
}) {
  const [offen, setOffen] = useState(false);
  const [fehler, formAktion, laeuft] = useActionState(aktion, null);
  // Fokus nur nach einem Klick verschieben, nicht beim Laden der Seite
  const fokusNoetig = useRef(false);
  const knopfRef = useRef<HTMLButtonElement>(null);
  const abbrechenRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!fokusNoetig.current) return;
    fokusNoetig.current = false;
    if (offen) abbrechenRef.current?.focus();
    else knopfRef.current?.focus();
  }, [offen]);

  function umschalten(zeigen: boolean) {
    fokusNoetig.current = true;
    setOffen(zeigen);
  }

  return (
    <div className="w-full">
      <Button type="button" variante="ghost" groesse="klein" disabled={offen} ref={knopfRef} onClick={() => umschalten(true)}>
        <Trash2 size={15} strokeWidth={2} aria-hidden="true" />
        {knopf}
      </Button>
      {(offen || fehler) && (
        <div
          role="alert"
          className="mt-3 flex flex-wrap items-center gap-3 rounded-subtil border border-ampel-rot/30 bg-ampel-rot/10 p-3"
        >
          <p className="flex-1 basis-64 text-[13px] font-medium text-ampel-rot">{fehler ?? frage}</p>
          {offen && (
            <div className="flex gap-2">
              <form action={formAktion}>
                {code && <input type="hidden" name="code" value={code} />}
                <Button type="submit" variante="gefahr" groesse="klein" disabled={laeuft}>
                  {laeuft ? "Wird gelöscht …" : "Endgültig löschen"}
                </Button>
              </form>
              <Button type="button" variante="sekundaer" groesse="klein" ref={abbrechenRef} disabled={laeuft} onClick={() => umschalten(false)}>
                Abbrechen
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
