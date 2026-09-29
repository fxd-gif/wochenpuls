import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Kicker } from "@/components/ui/Abschnittskopf";
import { BETREIBER, EINWILLIGUNG_TEXT, KONTAKT_EMAIL, RECHTSTEXTE_STAND } from "@/lib/rechtstexte";

export const metadata: Metadata = {
  title: "Datenschutzerklärung · Wochenpuls",
  description: "Welche Daten Wochenpuls verarbeitet, warum, wo und wie lange.",
  robots: { index: true },
};

const stand = RECHTSTEXTE_STAND.split("-").reverse().join(".");
const linkKlassen = "text-akzent underline underline-offset-4 break-words";

function Abschnitt({ titel, children }: { titel: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-serif text-[26px] font-normal leading-tight tracking-tight">{titel}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-text-zwei">{children}</div>
    </section>
  );
}

function Liste({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-1.5 pl-5 marker:text-text-leise">{children}</ul>;
}

function Mail() {
  return (
    <a href={`mailto:${KONTAKT_EMAIL}`} className={linkKlassen}>
      {KONTAKT_EMAIL}
    </a>
  );
}

export default function DatenschutzSeite() {
  return (
    <main className="flex-1">
      <article className="mx-auto max-w-2xl px-5 py-12 lg:py-16">
        <Kicker>Rechtliches</Kicker>
        <h1 className="mt-2 font-serif text-3xl font-normal tracking-tight sm:text-4xl">
          Datenschutzerklärung
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-text-zwei">
          Hier steht in einfachen Worten, welche Daten Wochenpuls verarbeitet, wozu, wo und wie lange. Stand:{" "}
          {stand}.
        </p>

        <Abschnitt titel="Wer ist verantwortlich?">
          <p>
            Für Coach-Konten, Einladungscodes und Besuche der Website ist {BETREIBER} verantwortlich. Erreichbar
            per E-Mail unter <Mail />.
          </p>
          <p>
            Wochenpuls ist ein kostenloses Portfolio-Projekt. Es gibt keine Zahlungen und keine Werbung.
          </p>
          <p>
            Für die Daten der Kunden eines Coaches (Check-ins) ist der jeweilige Coach verantwortlich.{" "}
            {BETREIBER} verarbeitet sie in seinem Auftrag, siehe{" "}
            <a href="#auftragsverarbeitung" className={linkKlassen}>
              Auftragsverarbeitung
            </a>
            .
          </p>
        </Abschnitt>

        <Abschnitt titel="Überblick">
          <Liste>
            <li>
              <strong className="font-semibold text-text">Startseite und Demo besuchen:</strong> Du brauchst
              kein Konto. Der Hoster verarbeitet dabei technische Zugriffsdaten (siehe Hosting). In der Demo
              gibst du keine echten Daten ein; ein Check-in, den du dort ausfüllst, bleibt im Speicher deines
              Browser-Tabs und erreicht nie den Server.
            </li>
            <li>
              <strong className="font-semibold text-text">Check-in als Kunde:</strong> Du brauchst kein Konto.
              Deine Angaben werden nach deiner Einwilligung gespeichert und gehen an deinen Coach.
            </li>
            <li>
              <strong className="font-semibold text-text">Login-Seite öffnen:</strong> Solange du nicht auf „Mit
              Google anmelden“ tippst, baut dein Browser keine Verbindung zu Google auf und es wird nichts im
              Browser gespeichert.
            </li>
            <li>
              <strong className="font-semibold text-text">Als Coach anmelden:</strong> Dafür brauchst du ein
              Google-Konto und beim ersten Mal einen Einladungscode. Dann entsteht dein Coach-Konto.
            </li>
          </Liste>
          <p>Es gibt kein Tracking, keine Analyse und keine Werbung.</p>
        </Abschnitt>

        <Abschnitt titel="Hosting (Vercel)">
          <p>
            Die Website läuft bei Vercel Inc. (USA) in der Serverregion Frankfurt (fra1). Wenn du eine Seite
            aufrufst, verarbeitet der Hoster technische Zugriffsdaten, die dafür nötig sind, etwa deine
            IP-Adresse, Datum und Uhrzeit, die aufgerufene Adresse und Angaben zu deinem Browser. Das dient
            dem sicheren und stabilen Betrieb (Art. 6 Abs. 1 lit. f DSGVO). Wie lange Vercel solche
            Protokolldaten aufbewahrt, bestimmt Vercel nach den eigenen Bedingungen; Wochenpuls wertet sie
            nicht aus.
          </p>
          <p>
            Die Schriften sind selbst gehostet und werden nicht von Google oder anderen Anbietern nachgeladen.
          </p>
        </Abschnitt>

        <Abschnitt titel="Datenbank (Google Cloud Firestore)">
          <p>
            Alle gespeicherten Daten liegen in Google Cloud Firestore in der Region europe-west3 (Frankfurt).
            Nur der Server von Wochenpuls greift auf die Datenbank zu, nie dein Browser. Google ist dabei
            Dienstleister im Auftrag und verarbeitet die Daten nach den „Data Processing and Security Terms“
            von Google Cloud.
          </p>
        </Abschnitt>

        <Abschnitt titel="Anmeldung mit Google (Firebase Authentication)">
          <p>
            Coaches melden sich mit ihrem Google-Konto an, über Firebase Authentication von Google. Firebase
            speichert dazu Daten deines Google-Kontos: E-Mail-Adresse, Name, Adresse des Profilbilds, eine
            Konto-ID und Anmeldezeitpunkte, soweit Firebase sie erfasst. Firebase Authentication verarbeitet
            diese Daten in Rechenzentren in den USA. Rechtsgrundlage ist die Durchführung des Nutzungsverhältnisses
            mit dem Coach (Art. 6 Abs. 1 lit. b DSGVO).
          </p>
          <p>
            Die Übermittlung in die USA stützt sich auf die Garantien, die Google und Vercel nach ihren
            Vertragsbedingungen bieten (EU-Standardvertragsklauseln bzw. das EU-US Data Privacy Framework).
          </p>
          <p>
            <strong className="font-semibold text-text">Wann Google ins Spiel kommt:</strong> Erst der Klick
            auf „Mit Google anmelden“ startet Firebase und öffnet das Google-Fenster. Dabei erhält Google
            technische Verbindungsdaten wie IP-Adresse und Browser-Kennung. Vorher geht von der Login-Seite
            keine Anfrage an Google oder Firebase. Im Google-Fenster gelten die Bestimmungen von Google.
          </p>
          <p>
            Meldet sich jemand ohne gültigen Einladungscode an, löscht Wochenpuls den dabei neu entstandenen
            Firebase-Nutzer, sobald die Anmeldung beim Server ankommt. Bricht der Vorgang vorher ab, etwa weil
            der Tab geschlossen wird, kann der Nutzer bestehen bleiben, bis der Betreiber ihn entfernt.
          </p>
        </Abschnitt>

        <Abschnitt titel="Coach-Konto und Einladungscodes">
          <p>Für ein Coach-Konto speichert Wochenpuls:</p>
          <Liste>
            <li>E-Mail-Adresse, Konto-ID und Anlagedatum des Coaches sowie den eingelösten Einladungscode,</li>
            <li>
              die Zustimmung zum{" "}
              <Link href="/avv" className={linkKlassen}>
                Vertrag zur Auftragsverarbeitung
              </Link>{" "}
              mit Zeitpunkt und Fassung,
            </li>
            <li>zu jedem Einladungscode einen kurzen Vermerk (z. B. einen Vornamen), Status, Erstell- und Einlösedatum,</li>
            <li>
              intern die Zuordnung eines eingelösten Codes zum Konto. Sie wird nirgends angezeigt und dient
              nur dazu, ein Konto auf Anfrage oder bei Missbrauch zu löschen.
            </li>
          </Liste>
          <p>
            Wird ein Konto gelöscht, bleibt der Einladungscode nur als „Konto gelöscht“ übrig, ohne Vermerk
            und ohne Zuordnung zu einer Person.
          </p>
        </Abschnitt>

        <Abschnitt titel="Kunden und Check-ins">
          <p>
            Der Coach legt Kunden mit Vorname oder Kürzel an. Jeder Kunde bekommt einen persönlichen,
            zufälligen Link. Das Formular fragt: geplante und geschaffte Trainings, vier Einschätzungen von 1
            bis 5 (Energie, Schlaf, Stress, Motivation), drei kurze Freitexte (Erfolg, Hürde, Frage an den
            Coach) und speichert den Zeitpunkt des Absendens. Gibt es für die Woche einen Wochenfokus (siehe unten),
            kommt eine Frage dazu und deine Antwort wird mitgespeichert. Weitere Gesundheitsangaben wie Gewicht, Fotos,
            Ernährung oder Verletzungen werden nicht abgefragt. Bitte schreib auch in die Freitexte nichts
            der Art.
          </p>
          <p>
            Kunden brauchen kein Konto. Die Check-ins eines Kunden sieht in der App nur sein Coach. Der
            technische Zugriff des Betreibers ist im Abschnitt „Technischer Zugriff“ beschrieben.
          </p>
          <p>
            Ein Kunden-Link ist Teil der Adresse. Die Check-in-Seite gibt ihn nicht an andere Seiten weiter
            und ist für Suchmaschinen gesperrt. Der Coach kann einen Link neu erzeugen; der alte Link wird
            dann sofort ungültig.
          </p>
        </Abschnitt>

        <Abschnitt titel="Notizen und Wochenfokus">
          <p>
            <strong className="font-semibold text-text">Notizen:</strong> Der Coach kann zu jedem Kunden eine
            private Notiz speichern, mit dem Zeitpunkt der letzten Änderung. Die Notiz sieht in der App nur der
            Coach, nicht der Kunde. Sie steht auch nicht im Export. Wochenpuls bittet darin um keine
            Gesundheitsangaben wie Verletzungen oder Diagnosen.
          </p>
          <p>
            <strong className="font-semibold text-text">Wochenfokus:</strong> Der Coach schreibt ihn selbst.
            Der Kunde sieht im Formular den Fokus, der für seine Woche gilt, und beantwortet ihn. Im Check-in
            werden eine Kopie des Fokus-Textes und die Antwort gespeichert.
          </p>
          <p>Zum technischen Zugriff siehe „Technischer Zugriff und Dienstleister“.</p>
        </Abschnitt>

        <Abschnitt titel="WhatsApp-Erinnerung und Export">
          <p>
            <strong className="font-semibold text-text">WhatsApp:</strong> Wochenpuls übermittelt nichts an
            WhatsApp und speichert keine Telefonnummern. Erst wenn der Coach auf „Per WhatsApp erinnern“
            tippt, öffnet sein Gerät WhatsApp (Meta) mit einem vorbereiteten Text. Er enthält den Vornamen des
            Kunden und dessen persönlichen Link; den Empfänger wählt der Coach dort aus. Für WhatsApp gelten
            die Bedingungen von WhatsApp.
          </p>
          <p>
            <strong className="font-semibold text-text">Export:</strong> Die Tabelle (CSV) mit den Check-ins
            eines Kunden entsteht nur, wenn der Coach sie anfordert. Danach liegt die Datei bei ihm. Notizen
            sind darin nicht enthalten.
          </p>
        </Abschnitt>

        <Abschnitt titel="Einwilligung der Kunden">
          <p>
            Die Einschätzungen zu Energie, Schlaf, Stress und Motivation können Gesundheitsdaten sein. Sie
            werden deshalb nur nach deiner ausdrücklichen Einwilligung gespeichert (Art. 9 Abs. 2 lit. a und
            Art. 6 Abs. 1 lit. a DSGVO). Der Text lautet:
          </p>
          <blockquote className="rounded-subtil border border-linie-fokus bg-flaeche p-4 text-text">
            {EINWILLIGUNG_TEXT}
          </blockquote>
          <p>
            Gespeichert werden der Zeitpunkt der Einwilligung und die Fassung des Textes, nach einem
            Widerruf der Zeitpunkt des Widerrufs. Du kannst die Einwilligung jederzeit auf deiner
            Check-in-Seite widerrufen, auch wenn dein Coach dich archiviert hat. Dabei werden alle deine
            gespeicherten Check-ins gelöscht, samt deinen Antworten zum Wochenfokus (Art. 17 Abs. 1 lit. b DSGVO). Was bis zum Widerruf verarbeitet wurde, bleibt
            rechtmäßig.
          </p>
        </Abschnitt>

        <Abschnitt titel="Cookies und Browser-Speicher">
          <p>
            Wochenpuls setzt genau ein Cookie: „wochenpuls-coach“. Es entsteht nur, wenn sich ein Coach
            anmeldet, hält die Anmeldung, ist für JavaScript nicht lesbar (httpOnly) und läuft nach 14 Tagen
            ab oder endet beim Abmelden. Es ist technisch notwendig (§ 25 Abs. 2 Nr. 2 TDDDG). Besucher und
            Kunden bekommen keine Cookies.
          </p>
          <p>
            Die Demo speichert deinen ausgefüllten Check-in im sessionStorage, dem Speicher deines Browser-Tabs.
            Er verschwindet, wenn du den Tab schließt, und wird nie an den Server geschickt. Sonst speichert
            Wochenpuls nichts in deinem Browser.
          </p>
        </Abschnitt>

        <Abschnitt titel="Speicherdauer und Löschung">
          <Liste>
            <li>
              Der Coach kann jeden Kunden mit allen Check-ins und der Notiz selbst löschen; das ist endgültig.
            </li>
            <li>
              Kunden widerrufen ihre Einwilligung auf ihrer Check-in-Seite; dann werden ihre Check-ins gelöscht.
            </li>
            <li>
              Ein Coach-Konto löschst du selbst auf der Seite „Konto“ im Coach-Bereich („Konto löschen“). Oder
              der Betreiber löscht es auf Anfrage per E-Mail an <Mail /> oder bei Missbrauch. Dabei werden das
              Konto, der Firebase-Nutzer und die Kunden samt Check-ins, Notizen und Einwilligungen entfernt.
              Ein eingelöster Einladungscode bleibt nur als „Konto gelöscht“ übrig, ohne Vermerk und ohne
              Zuordnung.
            </li>
            <li>Das Cookie läuft nach 14 Tagen ab.</li>
          </Liste>
        </Abschnitt>

        <Abschnitt titel="Deine Rechte">
          <p>
            Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
            Widerspruch und Datenübertragbarkeit sowie auf Widerruf einer Einwilligung. Du kannst dich bei
            einer Datenschutz-Aufsichtsbehörde beschweren.
          </p>
          <p>
            <strong className="font-semibold text-text">Coaches</strong> wenden sich dafür an <Mail /> oder
            löschen ihr Konto selbst auf der Konto-Seite.{" "}
            <strong className="font-semibold text-text">Kunden</strong> widerrufen ihre Einwilligung selbst auf
            ihrer Check-in-Seite und wenden sich für alle anderen Rechte an ihren Coach als Verantwortlichen.
            Schreibst du als Kunde an <Mail />, leitet der Betreiber deine Anfrage an den zuständigen Coach
            weiter.
          </p>
        </Abschnitt>

        <Abschnitt titel="Technischer Zugriff und Dienstleister">
          <p>
            Als Betreiber kann {BETREIBER} über die Firebase-Konsole technisch alle gespeicherten Daten
            einsehen, auch Notizen und Wochenfokus. Er nutzt diesen Zugriff nur zur Fehlerbehebung, für
            Löschungen auf Anfrage und bei Missbrauch, nicht zum Lesen von Kundendaten.
          </p>
          <p>
            Dienstleister, die Daten verarbeiten: Google (Firebase Authentication, Cloud Firestore) und Vercel
            (Hosting).
          </p>
        </Abschnitt>

        <section id="auftragsverarbeitung" className="mt-10 scroll-mt-6">
          <h2 className="font-serif text-[26px] font-normal leading-tight tracking-tight">
            Auftragsverarbeitung
          </h2>
          <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-text-zwei">
            <p>
              Coaches schließen bei der Registrierung mit dem Betreiber einen{" "}
              <Link href="/avv" className={linkKlassen}>
                Vertrag zur Auftragsverarbeitung
              </Link>
              . {BETREIBER} verarbeitet die Daten der Kunden nur im Auftrag der Coaches. Unterauftragsverarbeiter
              dafür sind Google (Cloud Firestore, europe-west3) und Vercel (Hosting, fra1). Firebase
              Authentication verarbeitet nur die Kontodaten der Coaches; dafür ist der Betreiber selbst
              verantwortlich.
            </p>
            <p>
              Coaches informieren ihre Kunden selbst darüber, dass sie Wochenpuls nutzen (Art. 13 DSGVO). Diese
              Seite dürfen sie dafür weitergeben.
            </p>
          </div>
        </section>

        <p className="mt-12 border-t border-linie pt-6 font-mono text-[12px] text-text-leise">
          Stand: {stand}
        </p>
      </article>
    </main>
  );
}
