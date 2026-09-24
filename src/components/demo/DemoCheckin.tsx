"use client";

import { RotateCcw } from "lucide-react";
import { CheckinFormular } from "@/components/checkin/CheckinFormular";
import { Button, ButtonLink } from "@/components/ui/Button";

// Das Formular in der Demo: Es wird nichts gespeichert.
export function DemoCheckin() {
  return (
    <CheckinFormular
      onAbsenden={async () => {
        // kurze Pause, damit sich das Absenden echt anfühlt
        await new Promise((fertig) => setTimeout(fertig, 600));
      }}
      nachDemAbsenden={(neuStarten) => (
        <div className="rounded-lg bg-primaer-hell p-6">
          <p className="text-lg leading-relaxed">
            In der Demo wird nichts gespeichert. Bald siehst du deinen Check-in hier direkt in der
            Coach-Übersicht.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button variante="primaer" onClick={neuStarten}>
              <RotateCcw size={20} strokeWidth={2.5} aria-hidden="true" />
              Nochmal ausfüllen
            </Button>
            <ButtonLink href="/" variante="sekundaer">
              Zur Startseite
            </ButtonLink>
          </div>
        </div>
      )}
    />
  );
}
