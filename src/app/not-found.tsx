import { ButtonLink } from "@/components/ui/Button";

export default function NichtGefunden() {
  return (
    <main className="auf-farbe relative flex flex-1 items-center overflow-hidden bg-primaer text-weiss">
      <div aria-hidden="true" className="absolute -right-32 -top-32 size-96 rounded-full bg-weiss/10" />
      <div className="relative mx-auto w-full max-w-xl px-4 py-24">
        <p className="text-sm font-semibold uppercase tracking-wider text-weiss/80">Fehler 404</p>
        <h1 className="mt-3 text-5xl font-extrabold tracking-tight">Diese Seite gibt es nicht.</h1>
        <p className="mt-4 text-lg">Vielleicht hat sich ein Tippfehler in die Adresse geschlichen.</p>
        <ButtonLink href="/" variante="hell" className="mt-8">
          Zur Startseite
        </ButtonLink>
      </div>
    </main>
  );
}
