import { ButtonLink } from "@/components/ui/Button";
import { Hinweisseite } from "@/components/ui/Hinweisseite";

export default function NichtGefunden() {
  return (
    <Hinweisseite kicker="Fehler 404" titel="Diese Seite gibt es nicht.">
      <p>Vielleicht hat sich ein Tippfehler in die Adresse geschlichen.</p>
      <ButtonLink href="/" className="mt-6">
        Zur Startseite
      </ButtonLink>
    </Hinweisseite>
  );
}
