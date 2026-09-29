import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { KundenDetail } from "@/components/coach/KundenDetail";
import { anmeldungPruefen } from "@/lib/server/anmeldung";
import { checkinsVon, kundeMitId, notizVon, tokenVon } from "@/lib/server/datenbank";
import { berlinDatum } from "@/lib/woche";

export default async function CoachKundeSeite({ params }: PageProps<"/coach/kunde/[id]">) {
  const coach = await anmeldungPruefen();
  const { id } = await params;
  const kunde = await kundeMitId(id, coach.uid);
  if (!kunde) notFound();
  const [checkins, token, notiz, kopf] = await Promise.all([
    checkinsVon([id]),
    tokenVon(id, coach.uid),
    notizVon(id, coach.uid),
    headers(),
  ]);
  // Persönlicher Link mit der Adresse, unter der die Seite gerade läuft
  const link = `${kopf.get("x-forwarded-proto") ?? "https"}://${kopf.get("host")}/c/${token}`;
  return (
    <KundenDetail
      kunde={kunde}
      checkins={checkins}
      heute={berlinDatum()}
      basis="/coach"
      coach={{ link, notiz: notiz.notiz }}
    />
  );
}
