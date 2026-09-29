"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

// Widerruf der Einwilligung mit Rückfrage in der Zeile (ohne Browser-Dialog).
// onWiderruf gibt true zurück, wenn der Server den Widerruf ausgeführt hat.
export function Widerruf({ onWiderruf }: { onWiderruf: () => Promise<boolean> }) {
  const [frage, setFrage] = useState(false);
  const [laeuft, setLaeuft] = useState(false);
  const [fehler, setFehler] = useState(false);

  async function widerrufen() {
    setLaeuft(true);
    setFehler(false);
    try {
      if (!(await onWiderruf())) setFehler(true);
    } catch {
      setFehler(true);
    } finally {
      setLaeuft(false);
    }
  }

  return (
    <section className="mx-auto max-w-xl border-t border-linie px-5 pb-16 pt-6">
      {frage ? (
        <div>
          <p className="text-[14px] leading-relaxed text-text-zwei">
            Dein Coach bekommt dann keine Check-ins mehr von dir, und alle bisherigen Check-ins werden gelöscht.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button" variante="gefahr" groesse="klein" disabled={laeuft} onClick={widerrufen}>
              {laeuft ? "Einen Moment …" : "Widerrufen"}
            </Button>
            <Button type="button" variante="sekundaer" groesse="klein" disabled={laeuft} onClick={() => setFrage(false)}>
              Abbrechen
            </Button>
          </div>
          {fehler && (
            <p role="alert" className="mt-3 text-[14px] font-medium text-ampel-rot">
              Das hat nicht geklappt. Bitte versuch es gleich noch einmal.
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Button type="button" variante="ghost" groesse="klein" onClick={() => setFrage(true)}>
            Einwilligung widerrufen
          </Button>
          <a href="/datenschutz" target="_blank" rel="noopener" className="text-[13px] text-text-zwei underline hover:text-text">
            Datenschutzerklärung
          </a>
        </div>
      )}
    </section>
  );
}
