"use client";

import { ArrowRight, RotateCcw } from "lucide-react";
import { CheckinFormular } from "@/components/checkin/CheckinFormular";
import { Button, ButtonLink } from "@/components/ui/Button";
import { speichereDemoCheckin } from "@/demo/useDemoDaten";

// Das Formular in der Demo: Der Check-in landet nur in diesem Browser-Tab.
export function DemoCheckin() {
  return (
    <CheckinFormular
      onAbsenden={async (eingabe) => {
        // kurze Pause, damit sich das Absenden echt anfühlt
        await new Promise((fertig) => setTimeout(fertig, 600));
        speichereDemoCheckin(eingabe);
      }}
      nachDemAbsenden={(neuStarten) => (
        <div className="rounded-lg bg-primaer-hell p-6">
          <p className="text-lg font-semibold">
            Jetzt die Seite wechseln: So sieht dein Coach deinen Check-in.
          </p>
          <p className="mt-2 leading-relaxed text-leise">
            Dein Check-in ist nur in diesem Browser-Tab gespeichert und verschwindet, wenn du ihn schließt.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/demo" variante="primaer">
              In der Coach-Übersicht ansehen
              <ArrowRight size={20} strokeWidth={2.5} aria-hidden="true" />
            </ButtonLink>
            <Button variante="sekundaer" onClick={neuStarten}>
              <RotateCcw size={20} strokeWidth={2.5} aria-hidden="true" />
              Nochmal ausfüllen
            </Button>
          </div>
        </div>
      )}
    />
  );
}
