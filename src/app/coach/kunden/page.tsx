import { headers } from "next/headers";
import { KundenVerwaltung } from "@/components/coach/KundenVerwaltung";
import { anmeldungPruefen } from "@/lib/server/anmeldung";
import { alleKunden, alleTokens } from "@/lib/server/datenbank";
import { kundeAnlegen, kundeArchivieren } from "../aktionen";

export default async function CoachKundenSeite() {
  await anmeldungPruefen();
  const [kunden, tokens, kopf] = await Promise.all([alleKunden(), alleTokens(), headers()]);

  // Persönliche Links mit der Adresse, unter der die Seite gerade läuft
  const adresse = `${kopf.get("x-forwarded-proto") ?? "https"}://${kopf.get("host")}`;
  const links = Object.fromEntries(
    Object.entries(tokens).map(([id, token]) => [id, `${adresse}/c/${token}`]),
  );

  return (
    <KundenVerwaltung
      kunden={kunden}
      links={links}
      aktionen={{ anlegen: kundeAnlegen, archivieren: kundeArchivieren }}
    />
  );
}
