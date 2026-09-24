import { Activity, ArrowRight, Clock3, LayoutGrid, Link2 } from "lucide-react";
import { AmpelMarke, ampelStufen, type AmpelStufe } from "@/components/AmpelMarke";
import { ButtonLink } from "@/components/ui/Button";

// Innenrahmen: gleiche Breite und Ränder für alle Abschnitte
const innen = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

const schritte = [
  {
    nummer: "01",
    titel: "Ein Link pro Kunde",
    text: "Kein Login, keine App. Dein Kunde öffnet seinen persönlichen Link am Handy.",
    Icon: Link2,
    kreis: "bg-primaer-leuchtend text-weiss",
  },
  {
    nummer: "02",
    titel: "Zwei Minuten pro Woche",
    text: "Trainings, Energie, Schlaf, Stress, Motivation und ein paar Sätze zur Woche.",
    Icon: Clock3,
    kreis: "bg-sekundaer text-dunkel",
  },
  {
    nummer: "03",
    titel: "Eine Seite für alle",
    text: "Du siehst sofort, wer abrutscht, und warum, in einem Satz.",
    Icon: LayoutGrid,
    kreis: "bg-akzent text-dunkel",
  },
];

const eckdaten = [
  { wert: "2", einheit: "Min.", text: "pro Check-in", block: "bg-primaer text-weiss" },
  { wert: "0", einheit: "Logins", text: "für deine Kunden", block: "bg-sekundaer text-dunkel" },
  { wert: "1", einheit: "Seite", text: "für alle Kunden", block: "bg-akzent text-dunkel" },
];

// Beispielzeilen für die kleine Vorschau im Kopfbereich
const vorschau: { name: string; grund: string; stufe: AmpelStufe }[] = [
  { name: "Lena", grund: "Nur 1 von 4 Trainings geschafft", stufe: "rot" },
  { name: "Tom", grund: "Stress diese Woche sehr hoch (5)", stufe: "gelb" },
  { name: "Mia", grund: "Alles im grünen Bereich", stufe: "gruen" },
];

export default function Startseite() {
  return (
    <main className="overflow-x-clip">
      {/* Kopfbereich: blaue Fläche mit großen Deko-Formen */}
      <section className="auf-farbe relative overflow-hidden bg-primaer text-weiss">
        <div
          aria-hidden="true"
          className="absolute -right-40 -top-40 size-[32rem] rounded-full bg-weiss/10"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 left-[38%] size-72 rotate-12 rounded-lg bg-weiss/5"
        />

        <div className={`${innen} relative`}>
          <header className="flex items-center justify-between py-6">
            <span className="flex items-center gap-3 text-lg font-bold tracking-tight">
              <span className="flex size-10 items-center justify-center rounded-full bg-weiss text-primaer">
                <Activity size={22} strokeWidth={2.5} aria-hidden="true" />
              </span>
              Wochenpuls
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-weiss/80">
              Portfolio-Projekt
            </span>
          </header>

          <div className="grid items-center gap-14 pb-20 pt-10 lg:grid-cols-12 lg:pb-28 lg:pt-16">
            <div className="lg:col-span-7">
              <p className="text-sm font-semibold uppercase tracking-wider text-weiss/80">
                Check-ins für Coaches mit ihren ersten Kunden
              </p>
              <h1 className="mt-5 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                Wer braucht dich{" "}
                <span className="whitespace-nowrap rounded-md bg-akzent px-2 text-dunkel">diese Woche</span>?
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed sm:text-xl">
                Einsteiger-Coaches verlieren Check-ins in WhatsApp-Chats und Tabellen. Wochenpuls sammelt sie
                an einem Ort und zeigt mit einer Ampel, wer gerade abrutscht.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <ButtonLink href="/demo/checkin" variante="hell">
                  Check-in ausprobieren
                  <ArrowRight size={20} strokeWidth={2.5} aria-hidden="true" />
                </ButtonLink>
                <span className="text-sm font-medium text-weiss/80">Die Coach-Übersicht folgt in Kürze.</span>
              </div>
            </div>

            {/* Vorschau: flache Formen hinter einer Karte */}
            <div className="relative lg:col-span-5">
              <div
                aria-hidden="true"
                className="absolute -left-6 -top-6 size-28 rotate-6 rounded-lg bg-akzent"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-8 -right-4 size-32 rounded-full bg-sekundaer"
              />
              <div className="relative rounded-lg bg-weiss p-6 text-dunkel">
                <p className="text-xs font-semibold uppercase tracking-wider text-leise">Diese Woche</p>
                <ul className="mt-4 space-y-3">
                  {vorschau.map((zeile) => (
                    <li key={zeile.name} className="rounded-md bg-flaeche p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-lg font-bold">{zeile.name}</span>
                        <AmpelMarke stufe={zeile.stufe} />
                      </div>
                      <p className="mt-1 text-sm text-leise">{zeile.grund}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* So funktioniert es: dunkle Fläche */}
      <section className="auf-farbe bg-dunkel text-weiss">
        <div className={`${innen} py-20 lg:py-28`}>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">So funktioniert es</h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {schritte.map(({ nummer, titel, text, Icon, kreis }) => (
              <li
                key={nummer}
                className="group rounded-lg bg-weiss/5 p-8 transition-all duration-200 hover:scale-[1.02] hover:bg-weiss/10"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex size-14 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110 ${kreis}`}
                  >
                    <Icon size={26} strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold tracking-wider text-weiss/60">{nummer}</span>
                </div>
                <h3 className="mt-8 text-2xl font-bold tracking-tight">{titel}</h3>
                <p className="mt-3 text-lg leading-relaxed text-weiss/80">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Eckdaten: drei Farbblöcke */}
      <section className={`${innen} py-20 lg:py-28`}>
        <dl className="grid gap-6 md:grid-cols-3">
          {eckdaten.map((eintrag) => (
            <div key={eintrag.einheit} className={`rounded-lg p-8 ${eintrag.block}`}>
              <dt className="text-sm font-semibold uppercase tracking-wider opacity-90">{eintrag.text}</dt>
              <dd className="mt-4 text-7xl font-extrabold tracking-tight">
                {eintrag.wert}
                <span className="ml-2 text-3xl font-bold">{eintrag.einheit}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Die Ampel */}
      <section className="bg-flaeche">
        <div className={`${innen} grid gap-12 py-20 lg:grid-cols-12 lg:py-28`}>
          <div className="lg:col-span-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Vier Zustände. Ein Blick.</h2>
            <p className="mt-4 text-lg leading-relaxed text-leise">
              Jeder Zustand hat eine Farbe, ein Symbol und ein Wort, damit ihn auch farbenblinde Coaches
              sofort erkennen.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {(Object.keys(ampelStufen) as AmpelStufe[]).map((stufe) => (
              <li key={stufe} className="rounded-lg bg-weiss p-6">
                <AmpelMarke stufe={stufe} gross />
                <p className="mt-4 text-lg leading-relaxed">{ampelStufen[stufe].beschreibung}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Mitmachen: gelber Block */}
      <section className="relative overflow-hidden bg-akzent text-dunkel">
        <div aria-hidden="true" className="absolute -right-20 -top-28 size-80 rounded-full bg-weiss/20" />
        <div
          className={`${innen} relative flex flex-col gap-8 py-20 lg:flex-row lg:items-center lg:justify-between`}
        >
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Sieh es aus Kundensicht: Fülle den Check-in aus, genau wie deine Kunden.
          </h2>
          <ButtonLink href="/demo/checkin" variante="dunkel" className="shrink-0">
            Zum Check-in
            <ArrowRight size={20} strokeWidth={2.5} aria-hidden="true" />
          </ButtonLink>
        </div>
      </section>

      <footer className="auf-farbe bg-dunkel text-weiss/70">
        <div className={`${innen} flex flex-col gap-2 py-10 text-sm sm:flex-row sm:justify-between`}>
          <span className="font-bold text-weiss">Wochenpuls</span>
          <span>Portfolio-Projekt · Alle Beispieldaten sind erfunden</span>
        </div>
      </footer>
    </main>
  );
}
