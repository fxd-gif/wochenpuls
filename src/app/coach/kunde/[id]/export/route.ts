import { checkinsAlsCsv } from "@/lib/csv";
import { anmeldungPruefen } from "@/lib/server/anmeldung";
import { alleCheckinsVon, kundeMitId } from "@/lib/server/datenbank";
import { berlinDatum } from "@/lib/woche";

// CSV-Download aller Check-ins eines Kunden. Anmeldung und Besitz werden hier selbst geprüft.
export async function GET(_anfrage: Request, ctx: RouteContext<"/coach/kunde/[id]/export">) {
  const coach = await anmeldungPruefen();
  const { id } = await ctx.params;
  const kunde = await kundeMitId(id, coach.uid);
  const checkins = kunde ? await alleCheckinsVon(id, coach.uid) : null;
  if (!kunde || !checkins || checkins.length === 0) return new Response("Nicht gefunden", { status: 404 });

  // Nur Buchstaben, Ziffern und Bindestrich (Umlaute ohne Punkte, alles andere wird "-")
  const name =
    kunde.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Za-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "kunde";

  return new Response(checkinsAlsCsv(checkins), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="wochenpuls-${name}-${berlinDatum()}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
