"use client";

import { useState } from "react";
import { Widerruf } from "@/components/checkin/Widerruf";
import { einwilligungWiderrufen } from "./aktionen";

// Auch bei einem archivierten Kunden bleibt der Widerruf möglich, solange eine Einwilligung gespeichert ist.
export function ArchiviertWiderruf({ token }: { token: string }) {
  const [erledigt, setErledigt] = useState(false);
  if (erledigt) {
    return (
      <p role="status" className="mx-auto max-w-xl px-5 py-6 text-[14px] font-medium text-akzent">
        Deine Einwilligung ist widerrufen. Deine bisherigen Check-ins wurden gelöscht.
      </p>
    );
  }
  return (
    <Widerruf
      onWiderruf={async () => {
        const { ok } = await einwilligungWiderrufen(token);
        if (ok) setErledigt(true);
        return ok;
      }}
    />
  );
}
