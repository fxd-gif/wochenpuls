"use client";

import { useActionState, useState } from "react";
import { notizSpeichern, type NotizZustand } from "@/app/coach/aktionen";
import { Button } from "@/components/ui/Button";
import { eingabeKlassen, mikroKlassen, panelKlassen } from "@/components/ui/stil";

const MAX_NOTIZ = 2000;

// Private Notiz des Coaches zu einem Kunden. Der Text bleibt im Feld stehen, auch wenn das Speichern scheitert.
export function Notizen({ kundeId, notiz }: { kundeId: string; notiz: string }) {
  const [text, setText] = useState(notiz);
  const [zustand, speichern, speichertGerade] = useActionState<NotizZustand, FormData>(notizSpeichern, {});

  return (
    <section className={`mt-6 ${panelKlassen}`}>
      <form action={speichern}>
        <input type="hidden" name="id" value={kundeId} />
        <label htmlFor="notiz" className={mikroKlassen}>
          Notizen (nur für dich)
        </label>
        <textarea
          id="notiz"
          name="notiz"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={MAX_NOTIZ}
          rows={5}
          aria-describedby="notiz-hinweis"
          className={`${eingabeKlassen} mt-3 py-3 leading-relaxed`}
        />
        <p id="notiz-hinweis" className="mt-2 text-[13px] text-text-leise">
          Bitte keine Gesundheitsangaben wie Verletzungen oder Diagnosen.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Button type="submit" variante="sekundaer" groesse="klein" disabled={speichertGerade}>
            {speichertGerade ? "Wird gespeichert …" : "Speichern"}
          </Button>
          <p role="status" className="text-[13px] text-text-zwei">
            {zustand.gespeichertAm && `Gespeichert · ${zustand.gespeichertAm}`}
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
