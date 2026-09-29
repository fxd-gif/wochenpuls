"use client";

import { useState } from "react";
import { CheckinFormular, MeldungsFehler } from "@/components/checkin/CheckinFormular";
import { Widerruf } from "@/components/checkin/Widerruf";
import { checkinSenden, einwilligungWiderrufen } from "./aktionen";

// "hatEinwilligung": Für den Kunden ist die aktuelle Einwilligung gespeichert. "widerrufen": Er hat sie zurückgenommen.
export function EchterCheckin({
  token,
  vorname,
  hatEinwilligung: anfangs,
  widerrufen: anfangsWiderrufen,
  fokus,
}: {
  token: string;
  vorname: string;
  hatEinwilligung: boolean;
  widerrufen: boolean;
  fokus?: { id: string; text: string };
}) {
  const [hatEinwilligung, setHatEinwilligung] = useState(anfangs);
  const [widerrufen, setWiderrufen] = useState(anfangsWiderrufen);
  const [durchlauf, setDurchlauf] = useState(0); // neuer Wert = leeres Formular

  return (
    <>
      {widerrufen && !hatEinwilligung && (
        <p role="status" className="mx-auto max-w-xl px-5 pt-6 text-[14px] font-medium text-akzent">
          Deine Einwilligung ist widerrufen. Deine bisherigen Check-ins wurden gelöscht.
        </p>
      )}
      <CheckinFormular
        key={durchlauf}
        vorname={vorname}
        fokus={fokus}
        braucheEinwilligung={!hatEinwilligung}
        onAbsenden={async (eingabe, einwilligung, fokusAntwort) => {
          const { ok, linkInaktiv } = await checkinSenden(
            token,
            eingabe,
            einwilligung,
            fokus && fokusAntwort ? { id: fokus.id, antwort: fokusAntwort } : undefined,
          );
          if (linkInaktiv) {
            throw new MeldungsFehler(
              "Dieser Link ist nicht mehr aktiv. Bitte frag deinen Coach nach deinem neuen Link.",
            );
          }
          if (!ok) throw new Error("Check-in wurde nicht gespeichert");
          setHatEinwilligung(true);
        }}
      />
      {hatEinwilligung && (
        <Widerruf
          onWiderruf={async () => {
            const { ok } = await einwilligungWiderrufen(token);
            if (ok) {
              setHatEinwilligung(false);
              setWiderrufen(true);
              setDurchlauf((n) => n + 1);
              window.scrollTo({ top: 0 });
            }
            return ok;
          }}
        />
      )}
    </>
  );
}
