import { Uebersicht } from "@/components/coach/Uebersicht";
import { anmeldungPruefen } from "@/lib/server/anmeldung";
import { alleKunden, checkinsVon } from "@/lib/server/datenbank";
import { berlinDatum } from "@/lib/woche";

export default async function CoachUebersicht() {
  await anmeldungPruefen();
  const kunden = await alleKunden();
  const checkins = await checkinsVon(kunden.filter((k) => !k.archiviert).map((k) => k.id));
  return <Uebersicht kunden={kunden} checkins={checkins} heute={berlinDatum()} basis="/coach" />;
}
