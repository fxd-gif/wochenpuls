import { notFound } from "next/navigation";
import { KundenDetail } from "@/components/coach/KundenDetail";
import { anmeldungPruefen } from "@/lib/server/anmeldung";
import { checkinsVon, kundeMitId } from "@/lib/server/datenbank";
import { berlinDatum } from "@/lib/woche";

export default async function CoachKundeSeite({ params }: PageProps<"/coach/kunde/[id]">) {
  await anmeldungPruefen();
  const { id } = await params;
  const kunde = await kundeMitId(id);
  if (!kunde) notFound();
  const checkins = await checkinsVon([id]);
  return <KundenDetail kunde={kunde} checkins={checkins} heute={berlinDatum()} basis="/coach" />;
}
