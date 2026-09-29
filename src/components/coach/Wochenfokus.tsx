"use client";

import { useActionState, useState } from "react";
import { fokusSpeichern, type FokusZustand } from "@/app/coach/aktionen";
import { Button } from "@/components/ui/Button";
import { eingabeKlassen, mikroKlassen, panelKlassen } from "@/components/ui/stil";
import { MAX_FOKUS, type Kunde } from "@/lib/checkin";
import { checkinWoche, datumKurz, fokusGiltAb, geltenderFokus } from "@/lib/woche";

// Wochenfokus eines Kunden (nur echte App). Eine neue Fassung gilt erst ab der nächsten Check-in-Woche.
export function Wochenfokus({ kunde, heute }: { kunde: Kunde; heute: string }) {
  const [text, setText] = useState(kunde.fokus?.text ?? "");
  const [zustand, speichern, speichertGerade] = useActionState<FokusZustand, FormData>(fokusSpeichern, {});

  // Fragt das Formular diese Woche noch nach einer älteren Fassung?
  const neuAb = kunde.fokus ? fokusGiltAb(kunde.fokus.gesetztAm) : null;
  const jetzt = neuAb && neuAb > checkinWoche(heute) ? geltenderFokus([kunde.fokus, kunde.fokusVorher], checkinWoche(heute)) : null;

  return (
    <section className={`mt-6 ${panelKlassen}`}>
      <form action={speichern}>
        <input type="hidden" name="id" value={kunde.id} />
        <label htmlFor="fokus" className={mikroKlassen}>
          Wochenfokus
        </label>
        <input
          id="fokus"
          name="fokus"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={MAX_FOKUS}
          aria-describedby="fokus-hinweis"
          placeholder="z. B. „Dreimal 20 Minuten spazieren gehen“"
          className={`${eingabeKlassen} mt-3 h-12`}
        />
        <p id="fokus-hinweis" className="mt-2 text-[13px] text-text-leise">
          Bitte keine Gesundheitsangaben wie Verletzungen oder Diagnosen. Leer lassen und speichern, um den Fokus zu entfernen.
        </p>
        {neuAb && (
          <p className="mt-3 text-[13px] text-text-zwei">Gilt ab dem Check-in für die Woche bis {datumKurz(neuAb)}.</p>
        )}
        {jetzt && (
          <p className="mt-1 text-[13px] text-text-zwei">Diese Woche fragt das Formular noch nach: {jetzt.text}</p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Button type="submit" variante="sekundaer" groesse="klein" disabled={speichertGerade}>
            {speichertGerade ? "Wird gespeichert …" : "Speichern"}
          </Button>
          <p role="status" className="text-[13px] text-text-zwei">
            {zustand.gespeichert && "Gespeichert"}
          </p>
          {zustand.fehler && (
            <p role="alert" className="text-[13px] font-medium text-ampel-rot">
              {zustand.fehler}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
