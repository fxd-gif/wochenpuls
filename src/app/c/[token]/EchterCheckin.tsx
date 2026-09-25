"use client";

import { CheckinFormular } from "@/components/checkin/CheckinFormular";
import { checkinSenden } from "./aktionen";

export function EchterCheckin({ token, vorname }: { token: string; vorname: string }) {
  return (
    <CheckinFormular
      vorname={vorname}
      onAbsenden={async (eingabe) => {
        const { ok } = await checkinSenden(token, eingabe);
        if (!ok) throw new Error("Check-in wurde nicht gespeichert");
      }}
    />
  );
}
