import { ArrowRight, CircleCheck, Clock3, Eye, Link2 } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { AmpelMarke, ampelStufen, type AmpelStufe } from "@/components/AmpelMarke";
import { KundenKarte } from "@/components/coach/KundenKarte";
import { Etikett, Logo } from "@/components/Logo";
import { Simulator } from "@/components/start/Simulator";
import { Abschnittskopf } from "@/components/ui/Abschnittskopf";
import { ButtonLink } from "@/components/ui/Button";
import { demoDaten } from "@/demo/demoDaten";
import { bewerte } from "@/lib/ampel";
import { berlinDatum } from "@/lib/woche";

// Beispiel-Kunden aus den Demo-Daten, bewertet mit den echten Ampel-Regeln.
// So passt die Startseite immer zur Demo.
const heute = berlinDatum();
const demo = demoDaten(heute);
function beispiel(id: string) {
  const kunde = demo.kunden.find((k) => k.id === id)!;
  return { kunde, ampel: bewerte(kunde, demo.checkins, heute) };
}
const lena = beispiel("lena");
const mia = beispiel("mia");
const aylin = beispiel("aylin");

const innen = "mx-auto w-full max-w-7xl";

// Reihenfolge für gestaffelte Bewegung (siehe globals.css)
const reihe = (i: number) => ({ "--i": i }) as CSSProperties;

const navigation = [
  { href: "#uebersicht", text: "Übersicht" },
  { href: "#funktionsweise", text: "Funktionsweise" },
  { href: "#ampel", text: "Ampel-System" },
  { href: "#ausprobieren", text: "Ausprobieren" },
];

const eckdaten = [
  { wert: "2 Min.", titel: "pro Check-in", text: "für deine Kunden am Sonntag", akzent: false },
  { wert: "0 Logins", titel: "für deine Kunden", text: "ein persönlicher Link reicht", akzent: false },
  { wert: "1 Seite", titel: "volle Übersicht", text: "alle Kunden auf einen Blick", akzent: true },
];

const schritte = [
  {
    titel: "Ein Link pro Kunde",
    text: "Kein Login, keine App, kein Passwort. Dein Kunde öffnet seinen persönlichen Link einfach am Handy.",
    Icon: Link2,
    fuss: "Per WhatsApp verschickbar",
    marke: "Schritt 1",
  },
  {
    titel: "Zwei Minuten pro Woche",
    text: "Trainings, Energie, Schlaf, Stress, Motivation und ein paar Sätze zur Woche, mit großen Tipp-Knöpfen.",
    Icon: Clock3,
    fuss: "Schnell ausgefüllt",
    marke: "Schritt 2",
  },
  {
    titel: "Eine Seite für alle",
    text: "Du siehst sofort, wer abrutscht, und warum, in einem einzigen Satz zusammengefasst.",
    Icon: Eye,
    fuss: "Rot steht immer oben",
    marke: "Ziel",
  },
];

const ampelKarten: { stufe: AmpelStufe; nummer: string; titel: string; fuss: string }[] = [
  { stufe: "rot", nummer: "01", titel: "Kritisch", fuss: "Höchste Dringlichkeit" },
  { stufe: "gelb", nummer: "02", titel: "Frühwarnung", fuss: "Warnsignal beachten" },
  { stufe: "gruen", nummer: "03", titel: "Stabil", fuss: "Kein Eingriff nötig" },
  { stufe: "neu", nummer: "04", titel: "Start", fuss: "Erster Check-in steht aus" },
];

export default function Startseite() {
  const anzahlRot = [lena, mia, aylin].filter((b) => b.ampel.stufe === "rot").length;

  return (
    <>
      {/* Kopfzeile */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-linie bg-leinwand/90 backdrop-blur-md">
        <div className={`${innen} flex h-16 items-center justify-between gap-6 px-5 lg:px-8`}>
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden text-xs text-text-leise sm:inline">/</span>
            <span className="hidden sm:inline">
              <Etikett>Portfolio-Projekt</Etikett>
            </span>
          </div>
          <nav aria-label="Abschnitte" className="hidden items-center gap-8 text-[13px] font-medium md:flex">
            {navigation.map((n) => (
              <a key={n.href} href={n.href} className="text-text-zwei transition-colors hover:text-text">
                {n.text}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-2 rounded-full border border-linie-fokus bg-flaeche px-2.5 py-1 font-mono text-[11px] text-text-zwei lg:flex">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-akzent" />
              Demo online
            </span>
            <ButtonLink href="/demo/checkin" variante="hell" groesse="klein">
              Check-in ausprobieren
            </ButtonLink>
          </div>
        </div>
        <div aria-hidden="true" className="fortschritt absolute inset-x-0 -bottom-px h-px bg-akzent/70" />
      </header>

      <main className="flex-1 pt-16">
        {/* Hero: Text links, Produktfenster rechts */}
        <section className="relative overflow-hidden border-b border-linie px-5 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 top-20 size-[600px] rounded-full bg-akzent/5 blur-[140px]"
          />
          <div className={`${innen} grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8`}>
            <div className="flex flex-col items-start lg:col-span-7 lg:pr-6">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-linie-fokus bg-flaeche-hoch px-3 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-akzent">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-akzent motion-safe:animate-pulse"
                />
                <span>Wochenpuls</span>
                <span aria-hidden="true" className="text-akzent/40">
                  —/—
                </span>
                <span>Check-ins für Coaches</span>
              </div>
              <h1 className="font-serif text-[48px] font-normal leading-[1.04] tracking-[-0.03em] sm:text-[66px] lg:text-[76px]">
                Wer braucht dich <span className="italic text-akzent/90">diese Woche?</span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-[1.65] text-text-zwei sm:text-[17px]">
                Einsteiger-Coaches verlieren Check-ins in WhatsApp-Chats und Tabellen. Wochenpuls sammelt sie
                an einem ruhigen Ort und zeigt mit einer Ampel, wer gerade abrutscht.
              </p>
              <div className="mt-10 flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
                <ButtonLink href="/demo" className="h-[52px]">
                  Demo ansehen
                  <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
                </ButtonLink>
                <p className="flex items-center gap-2 text-[12px] text-text-leise">
                  <CircleCheck size={15} strokeWidth={2} className="text-akzent" aria-hidden="true" />
                  Ohne Anmeldung · Alle Daten erfunden
                </p>
              </div>
              <div className="mt-12 flex w-full flex-wrap items-center gap-x-6 gap-y-3 border-t border-linie pt-8 text-[12px] text-text-zwei">
                <div className="flex items-center gap-2">
                  <div aria-hidden="true" className="flex -space-x-1.5">
                    <span className="flex size-6 items-center justify-center rounded-full border border-leinwand bg-flaeche-alt font-mono text-[10px] text-text">
                      Le
                    </span>
                    <span className="flex size-6 items-center justify-center rounded-full border border-leinwand bg-[#2A2318] font-mono text-[10px] text-ampel-gelb">
                      Mi
                    </span>
                    <span className="flex size-6 items-center justify-center rounded-full border border-leinwand bg-[#17261E] font-mono text-[10px] text-ampel-gruen">
                      Ay
                    </span>
                  </div>
                  <span>Kunden antworten ohne App-Download</span>
                </div>
                <span aria-hidden="true" className="hidden text-linie-fokus sm:inline">
                  |
                </span>
                <span className="font-mono text-text-leise">Fällig: jeden Sonntag</span>
              </div>
            </div>

            {/* Produktfenster */}
            <div className="schweben relative lg:col-span-5">
              <div className="halo overflow-hidden rounded-panel border border-linie-fokus bg-[#141815]">
                <div className="flex items-center justify-between border-b border-linie bg-[#181D1A] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true" className="size-2.5 rounded-full bg-ampel-rot/80" />
                    <span aria-hidden="true" className="size-2.5 rounded-full bg-ampel-gelb/80" />
                    <span aria-hidden="true" className="size-2.5 rounded-full bg-ampel-gruen/80" />
                    <span className="ml-2 font-mono text-[11px] text-text-leise">
                      wochenpuls.vercel.app/demo
                    </span>
                  </div>
                  <span className="hidden items-center gap-1.5 rounded-sm border border-akzent/20 bg-flaeche px-2 py-0.5 font-mono text-[10px] text-akzent sm:inline-flex">
                    <span
                      aria-hidden="true"
                      className="size-1.5 rounded-full bg-akzent motion-safe:animate-pulse"
                    />
                    Demo-Daten
                  </span>
                </div>
                <div className="flex flex-col gap-4 p-5">
                  <div className="flex items-center justify-between gap-3 border-b border-linie pb-3.5">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-leise">
                        Status deiner Kunden
                      </p>
                      <p className="mt-0.5 font-serif text-[19px] leading-tight">
                        3 Rückmeldungen eingegangen
                      </p>
                    </div>
                    <span
                      style={reihe(3)}
                      className="nacheinander shrink-0 rounded-subtil border border-ampel-rot/30 bg-ampel-rot/12 px-2.5 py-1 font-mono text-[11px] font-medium text-ampel-rot"
                    >
                      ▲ {anzahlRot} Handlungsbedarf
                    </span>
                  </div>
                  <FensterZeile {...lena} i={0} betont />
                  <FensterZeile {...mia} i={1} />
                  <div
                    style={reihe(2)}
                    className="nacheinander flex items-center justify-between rounded-sm border border-linie bg-flaeche/80 p-3 text-[12px]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span aria-hidden="true" className="size-2 rounded-full bg-ampel-gruen" />
                      <span className="font-medium">{aylin.kunde.name}</span>
                      <span className="font-mono text-[11px] text-text-leise">
                        · {aylin.ampel.letzter?.trainingsGeschafft}/{aylin.ampel.letzter?.trainingsGeplant}{" "}
                        Trainings
                      </span>
                    </div>
                    <span className="font-mono text-[11px] font-medium text-ampel-gruen">✓ Läuft</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-linie bg-flaeche-alt px-4 py-2.5 font-mono text-[11px] text-text-leise">
                  <span className="flex items-center gap-1.5">
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-akzent" />
                    Beispieldaten
                  </span>
                  <span className="text-text-zwei">Nächster Check-in: Sonntag</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Diese Woche */}
        <section id="uebersicht" className="scroll-mt-16 border-b border-linie px-5 py-20 lg:px-8 lg:py-28">
          <div className={innen}>
            <div className="einblenden">
              <Abschnittskopf
                seitlich
                kicker="Aus der Demo"
                titel="Diese Woche"
                text="So sieht deine Übersicht aus: Jeder Kunde bekommt eine Ampel und einen Satz, warum. Ohne Suchen in Chats."
              />
            </div>
            <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
              <div style={reihe(0)} className="einblenden lg:col-span-5">
                <KundenKarte {...lena} href="/demo/kunde/lena" gross zeitlos />
              </div>
              <div style={reihe(1)} className="einblenden lg:col-span-4">
                <KundenKarte {...mia} href="/demo/kunde/mia" zeitlos />
              </div>
              <div style={reihe(2)} className="einblenden lg:col-span-3">
                <KundenKarte {...aylin} href="/demo/kunde/aylin" zeitlos />
              </div>
            </div>
          </div>
        </section>

        {/* Eckdaten */}
        <section className="border-b border-linie bg-abschnitt px-5 py-20 lg:px-8">
          <dl className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-linie md:grid-cols-3 md:divide-x md:divide-y-0">
            {eckdaten.map((e, i) => (
              <div
                key={e.wert}
                style={reihe(i)}
                className="einblenden flex flex-col py-8 text-center md:px-10 md:py-4 md:text-left md:first:pl-0"
              >
                <dt className="order-2 mt-3">
                  <span className="block text-[16px] font-semibold">{e.titel}</span>
                  <span className="mt-1 block text-[13px] font-normal text-text-zwei">{e.text}</span>
                </dt>
                <dd
                  className={`order-1 font-serif text-6xl font-normal leading-none tracking-tight lg:text-[68px] ${
                    e.akzent ? "text-akzent" : "text-text"
                  }`}
                >
                  {e.wert}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* So funktioniert es */}
        <section
          id="funktionsweise"
          className="scroll-mt-16 border-b border-linie px-5 py-24 lg:px-8 lg:py-32"
        >
          <div className="mx-auto max-w-6xl">
            <div className="einblenden">
              <Abschnittskopf
                kicker="Ablauf"
                titel="So funktioniert es"
                text="Drei Schritte zu entspannter Betreuung ohne Nachrichten-Dschungel."
              />
            </div>
            <div className="relative">
              <div
                aria-hidden="true"
                className="linie-zeichnen pointer-events-none absolute left-[16%] right-[16%] top-[52px] hidden h-px items-center justify-between bg-linear-to-r from-linie-fokus via-akzent/40 to-linie-fokus md:flex"
              >
                <span className="size-2 rounded-full border border-leinwand bg-akzent/60" />
                <span className="size-2 rounded-full border border-leinwand bg-akzent/60" />
                <span className="size-2 rounded-full border border-leinwand bg-akzent/60" />
              </div>
              <ol className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {schritte.map(({ titel, text, Icon, fuss, marke }, i) => (
                  <li
                    key={titel}
                    style={reihe(i)}
                    className="einblenden group relative z-10 flex flex-col justify-between rounded-panel border border-linie-fokus bg-[#151916] p-7 transition-colors hover:border-akzent/40"
                  >
                    <div>
                      <div className="mb-6 flex items-center justify-between">
                        <span className="flex size-10 items-center justify-center rounded-full border border-linie bg-flaeche-hoch font-serif text-[18px] text-akzent transition-colors group-hover:border-akzent/60">
                          0{i + 1}
                        </span>
                        <span
                          className={`font-mono text-[11px] uppercase tracking-[0.1em] ${
                            i === 2 ? "font-semibold text-akzent" : "text-text-leise"
                          }`}
                        >
                          {marke}
                        </span>
                      </div>
                      <h3 className="mb-3 text-[18px] font-semibold">{titel}</h3>
                      <p className="text-[14px] leading-relaxed text-text-zwei">{text}</p>
                    </div>
                    <p className="mt-8 flex items-center gap-2 border-t border-linie pt-4 text-[13px] font-medium text-text-zwei">
                      <Icon size={16} strokeWidth={1.75} className="text-akzent" aria-hidden="true" />
                      {fuss}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Ampel-System */}
        <section id="ampel" className="scroll-mt-16 border-b border-linie px-5 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="einblenden">
              <Abschnittskopf
                kicker="Barrierefreies Ampel-System"
                titel="Vier Zustände. Ein Blick."
                text="Jeder Zustand hat eine eigene Farbe, ein eindeutiges Symbol und ein klares Wort, damit ihn auch farbenblinde Coaches sofort erkennen."
              />
            </div>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {ampelKarten.map(({ stufe, nummer, titel, fuss }, i) => {
                const stil = ampelStufen[stufe];
                return (
                  <li
                    key={stufe}
                    style={reihe(i)}
                    className={`einblenden flex flex-col justify-between rounded-panel bg-flaeche p-6 ${
                      stufe === "rot"
                        ? `border-2 ${stil.rand}`
                        : `border ${stufe === "neu" ? "border-linie" : stil.rand}`
                    }`}
                  >
                    <div>
                      <div className="mb-4 flex items-center justify-between border-b border-linie pb-3">
                        <span
                          className={`font-mono text-[11px] font-semibold uppercase tracking-wider ${stil.text}`}
                        >
                          {nummer} · {titel}
                        </span>
                        <span aria-hidden="true" className={`size-2 rounded-full ${stil.punkt}`} />
                      </div>
                      <AmpelMarke stufe={stufe} gross />
                      <p className="mt-3 text-[14px] leading-relaxed text-text-zwei">{stil.beschreibung}</p>
                    </div>
                    <p
                      className={`mt-6 border-t border-linie pt-5 font-mono text-[11px] font-medium uppercase tracking-wider ${stil.text}`}
                    >
                      {fuss}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Ausprobieren */}
        <section id="ausprobieren" className="scroll-mt-16 border-b border-linie px-5 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-5xl">
            <div className="einblenden mx-auto mb-12 max-w-2xl text-center">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-akzent/20 bg-akzent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-akzent">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-akzent motion-safe:animate-pulse"
                />
                Interaktive Kundensicht
              </span>
              <h2 className="font-serif text-3xl font-normal sm:text-4xl lg:text-[44px]">
                Sieh es aus Kundensicht
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-text-zwei">
                Schieb die Regler und sieh sofort, welche Ampel dein Coach bekommen würde. Oder füll den
                kompletten Check-in aus, genau wie deine Kunden.
              </p>
            </div>
            <div className="einblenden">
              <Simulator />
            </div>
          </div>
        </section>

        <section className="px-5 py-16 text-center">
          <div className="mx-auto flex max-w-xl flex-col items-center">
            <span className="mb-4 flex size-8 items-center justify-center rounded-subtil border border-linie-fokus bg-flaeche">
              <span aria-hidden="true" className="size-2 rounded-full bg-akzent" />
            </span>
            <p className="text-[13px] text-text-leise">
              Wochenpuls Portfolio-Projekt · Alle Beispieldaten sind frei erfunden
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-linie bg-abschnitt py-12">
        <div
          className={`${innen} flex flex-col items-center justify-between gap-6 px-5 text-[13px] text-text-leise sm:flex-row lg:px-8`}
        >
          <p className="flex flex-col gap-2.5 text-center sm:flex-row sm:items-center sm:text-left">
            <span className="font-semibold text-text">Wochenpuls</span>
            <span aria-hidden="true" className="hidden sm:inline">
              ·
            </span>
            <span>Das ruhige Dashboard für Coaches mit ihren ersten Kunden.</span>
          </p>
          <nav aria-label="Weitere Seiten" className="flex items-center gap-8 font-medium">
            <Link href="/demo" className="transition-colors hover:text-text">
              Demo
            </Link>
            <Link href="/login" className="transition-colors hover:text-text">
              Coach-Login
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
}

// Eine Kundenzeile im Produktfenster oben
function FensterZeile({
  kunde,
  ampel,
  i,
  betont = false,
}: ReturnType<typeof beispiel> & { i: number; betont?: boolean }) {
  const stil = ampelStufen[ampel.stufe];
  const l = ampel.letzter;
  return (
    <div
      style={reihe(i)}
      className={`nacheinander flex flex-col gap-2.5 rounded-sm border p-3.5 ${betont ? stil.getoent : `bg-flaeche ${stil.rand}`}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[14px] font-semibold">{kunde.name}</span>
        <AmpelMarke stufe={ampel.stufe} />
      </div>
      <p className={`text-[12px] font-medium ${stil.text}`}>{ampel.gruende[0]}</p>
      {betont && l && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-spur">
          <div
            className={`balken-fuellen h-full ${stil.punkt}`}
            style={{ width: `${(l.trainingsGeschafft / Math.max(l.trainingsGeplant, 1)) * 100}%` }}
          />
        </div>
      )}
      {l && <p className="font-serif text-[12px] italic leading-relaxed text-text-zwei">„{l.huerde}“</p>}
    </div>
  );
}
