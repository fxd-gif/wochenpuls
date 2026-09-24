const schritte = [
  {
    nummer: "01",
    titel: "Ein Link pro Kunde",
    text: "Kein Login, keine App. Dein Kunde öffnet seinen persönlichen Link am Handy.",
  },
  {
    nummer: "02",
    titel: "Zwei Minuten pro Woche",
    text: "Trainings, Energie, Schlaf, Stress, Motivation und ein paar Sätze zur Woche.",
  },
  {
    nummer: "03",
    titel: "Eine Seite für alle",
    text: "Du siehst sofort, wer abrutscht, und warum, in einem Satz.",
  },
];

const eckdaten = [
  { wert: "2", einheit: "Min.", text: "pro Check-in" },
  { wert: "0", einheit: "Logins", text: "für deine Kunden" },
  { wert: "1", einheit: "Seite", text: "für alle Kunden" },
];

const ampel = [
  {
    farbe: "bg-ampel-rot",
    symbol: "▲",
    wort: "Handeln",
    text: "Check-in überfällig oder die Woche ist gekippt.",
  },
  {
    farbe: "bg-ampel-gelb",
    symbol: "!",
    wort: "Beobachten",
    text: "Ein Wert ist deutlich schlechter als sonst.",
  },
  {
    farbe: "bg-ampel-gruen",
    symbol: "✓",
    wort: "Läuft",
    text: "Alles im grünen Bereich.",
  },
  {
    farbe: "bg-ampel-neu",
    symbol: "○",
    wort: "Neu",
    text: "Wartet auf den ersten Check-in.",
  },
];

// Innenrahmen: gleiche Breite und Ränder für alle Abschnitte
const innen = "mx-auto w-full max-w-6xl px-6 md:px-8 lg:px-12";

export default function Startseite() {
  return (
    <main className="overflow-x-clip">
      <div className={innen}>
        {/* Kopfzeile */}
        <header className="flex items-baseline justify-between py-6 font-mono text-xs uppercase tracking-widest">
          <span>Wochenpuls</span>
          <span className="text-leise">Portfolio-Projekt</span>
        </header>
        <hr className="border-t-4 border-schwarz" />

        {/* Große Überschrift */}
        <section className="py-20 md:py-28 lg:py-32">
          <p className="mb-8 font-mono text-xs uppercase tracking-widest text-leise">
            Check-ins für Coaches mit ihren ersten Kunden
          </p>
          <h1 className="font-display text-5xl tracking-tight sm:text-7xl lg:text-8xl">
            Wer braucht dich <em className="italic">diese</em> Woche?
          </h1>

          {/* Dicke Linie mit kleinem Quadrat als Satzzeichen */}
          <div className="mt-14 flex items-center" aria-hidden="true">
            <div className="h-1 flex-1 bg-schwarz" />
            <div className="size-4 border-2 border-schwarz bg-weiss" />
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-12">
            <p className="text-xl leading-relaxed md:col-span-7">
              Einsteiger-Coaches verlieren Check-ins in WhatsApp-Chats und
              Tabellen. Wochenpuls sammelt sie an einem Ort und zeigt mit einer
              Ampel, wer gerade abrutscht, bevor es zu spät ist.
            </p>
            <p className="self-end font-mono text-xs uppercase tracking-widest text-leise md:col-span-4 md:col-start-9">
              Die Demo erscheint hier in Kürze.
            </p>
          </div>
        </section>

        <hr className="border-t-4 border-schwarz" />

        {/* So funktioniert es */}
        <section className="py-20 md:py-28">
          <h2 className="mb-12 font-mono text-xs uppercase tracking-widest">
            So funktioniert es
          </h2>
          <ol className="grid border border-schwarz md:grid-cols-3">
            {schritte.map((schritt, i) => (
              <li
                key={schritt.nummer}
                className={`group p-8 transition-colors duration-100 hover:bg-schwarz hover:text-weiss ${
                  i > 0
                    ? "border-t border-schwarz md:border-t-0 md:border-l"
                    : ""
                }`}
              >
                <span className="font-mono text-xs tracking-widest text-leise group-hover:text-weiss">
                  {schritt.nummer}
                </span>
                <h3 className="mt-6 font-display text-3xl leading-tight">
                  {schritt.titel}
                </h3>
                <p className="mt-4 text-lg leading-relaxed">{schritt.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Eckdaten, schwarz invertiert, über die volle Breite */}
      </div>
      <section className="textur-senkrecht bg-schwarz text-weiss">
        <dl className={`${innen} grid py-20 md:grid-cols-3 md:py-28`}>
          {eckdaten.map((eintrag, i) => (
            <div
              key={eintrag.einheit}
              className={`py-8 md:px-8 md:py-0 ${i > 0 ? "border-t border-weiss/30 md:border-t-0 md:border-l" : ""}`}
            >
              <dt className="font-mono text-xs uppercase tracking-widest opacity-70">
                {eintrag.text}
              </dt>
              <dd className="mt-4 font-display text-7xl tracking-tight">
                {eintrag.wert}
                <span className="ml-3 text-3xl italic">{eintrag.einheit}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className={innen}>
        {/* Die Ampel: die einzige Farbe */}
        <section className="py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <h2 className="font-mono text-xs uppercase tracking-widest">
                Die Ampel
              </h2>
              <p className="mt-8 font-display text-4xl italic leading-tight">
                Die einzige Farbe auf dieser Seite hat eine Aufgabe.
              </p>
            </div>
            <ul className="md:col-span-6 md:col-start-7">
              {ampel.map((stufe) => (
                <li
                  key={stufe.wort}
                  className="flex items-start gap-5 border-t border-schwarz py-6 last:border-b"
                >
                  <span
                    className={`mt-1 size-4 shrink-0 ${stufe.farbe}`}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-mono text-sm uppercase tracking-widest">
                      <span aria-hidden="true">{stufe.symbol}</span>{" "}
                      {stufe.wort}
                    </p>
                    <p className="mt-2 text-lg leading-relaxed text-leise">
                      {stufe.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <hr className="border-t-4 border-schwarz" />
        <footer className="flex flex-col gap-2 py-8 font-mono text-xs uppercase tracking-widest text-leise sm:flex-row sm:justify-between">
          <span>Wochenpuls</span>
          <span>Alle Beispieldaten sind erfunden</span>
        </footer>
      </div>
    </main>
  );
}
