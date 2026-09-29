import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Kicker } from "@/components/ui/Abschnittskopf";
import { AVV_FASSUNG, BETREIBER, KONTAKT_EMAIL, RECHTSTEXTE_STAND } from "@/lib/rechtstexte";

export const metadata: Metadata = {
  title: "Vertrag zur Auftragsverarbeitung · Wochenpuls",
  description: "Auftragsverarbeitungsvertrag nach Art. 28 DSGVO zwischen Coach und Wochenpuls.",
  robots: { index: true },
};

const stand = RECHTSTEXTE_STAND.split("-").reverse().join(".");
const linkKlassen = "text-akzent underline underline-offset-4 break-words";

function Paragraf({ titel, children }: { titel: string; children: ReactNode }) {
  return (
    <section className="mt-9">
      <h2 className="font-serif text-[24px] font-normal leading-tight tracking-tight">{titel}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-text-zwei">{children}</div>
    </section>
  );
}

function Liste({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-1.5 pl-5 marker:text-text-leise">{children}</ul>;
}

export default function AvvSeite() {
  return (
    <main className="flex-1">
      <article className="mx-auto max-w-2xl px-5 py-12 lg:py-16">
        <Kicker>Rechtliches</Kicker>
        <h1 className="mt-2 font-serif text-3xl font-normal tracking-tight sm:text-4xl">
          Vertrag zur Auftragsverarbeitung
        </h1>
        <p className="mt-2 font-mono text-[12px] text-text-leise">
          nach Art. 28 Abs. 3 DSGVO · Fassung {AVV_FASSUNG} · Stand {stand}
        </p>

        <div className="mt-6 space-y-3 rounded-panel border border-linie bg-flaeche p-5 text-[15px] leading-relaxed text-text-zwei">
          <p>
            <strong className="font-semibold text-text">Auftraggeber</strong> (Verantwortlicher) ist der Coach,
            der sich bei Wochenpuls registriert. Er ist an seinem Google-Konto erkennbar, mit dem er sich
            anmeldet.
          </p>
          <p>
            <strong className="font-semibold text-text">Auftragnehmer</strong> (Auftragsverarbeiter) ist{" "}
            {BETREIBER}, erreichbar unter{" "}
            <a href={`mailto:${KONTAKT_EMAIL}`} className={linkKlassen}>
              {KONTAKT_EMAIL}
            </a>
            .
          </p>
        </div>

        <Paragraf titel="Präambel">
          <p>
            Der Auftraggeber möchte den Auftragnehmer mit den in § 3 genannten Leistungen beauftragen. Teil der
            Leistung ist die Verarbeitung von personenbezogenen Daten. Insbesondere Art. 28 DSGVO stellt
            bestimmte Anforderungen an eine solche Auftragsverarbeitung. Zur Wahrung dieser Anforderungen
            schließen die Parteien die nachfolgende Vereinbarung. Ihre Erfüllung wird nicht gesondert vergütet.
          </p>
        </Paragraf>

        <Paragraf titel="§ 1 Begriffsbestimmungen">
          <p>
            Begriffe, die in Art. 4, 9 und 10 DSGVO definiert werden, sind im Sinne dieser gesetzlichen
            Definition zu verstehen.
          </p>
        </Paragraf>

        <Paragraf titel="§ 2 Vertreter innerhalb der Europäischen Union">
          <p>
            Der Auftragnehmer hat seinen Sitz in Deutschland. Ein Vertreter nach Art. 27 Abs. 1 DSGVO ist nicht
            erforderlich und nicht benannt.
          </p>
        </Paragraf>

        <Paragraf titel="§ 3 Vertragsgegenstand">
          <p>
            (1) Der Auftragnehmer stellt dem Auftraggeber die Web-Anwendung Wochenpuls zur Verfügung
            (wöchentliche Check-ins von Kunden, Übersicht für den Coach). Grundlage ist die Nutzung von
            Wochenpuls nach der Registrierung. Dabei erhält der Auftragnehmer Zugriff auf personenbezogene
            Daten und verarbeitet diese ausschließlich im Auftrag und nach Weisung des Auftraggebers, sofern er
            nicht durch das Recht der Union oder der Mitgliedstaaten, dem er unterliegt, zu einer anderen
            Verarbeitung verpflichtet ist. Umfang und Zweck ergeben sich aus diesem Vertrag und aus Anlage 1.
            Dem Auftraggeber obliegt die alleinige Beurteilung der Zulässigkeit der Datenverarbeitung nach
            Art. 6 Abs. 1 DSGVO.
          </p>
          <p>
            (2) Zur Konkretisierung der beiderseitigen datenschutzrechtlichen Rechte und Pflichten schließen die
            Parteien diese Vereinbarung. Sie geht im Zweifel den Nutzungsbedingungen von Wochenpuls vor.
          </p>
          <p>
            (3) Die Bestimmungen dieses Vertrags gelten für alle Tätigkeiten, bei denen der Auftragnehmer
            personenbezogene Daten verarbeitet, die vom Auftraggeber stammen oder für ihn erhoben werden.
          </p>
          <p>
            (4) Der Vertrag beginnt mit der Zustimmung bei der Registrierung und läuft bis zur Löschung des
            Coach-Kontos, sofern sich aus den folgenden Bestimmungen keine darüber hinausgehenden Pflichten
            ergeben.
          </p>
          <p>
            (5) Die Verarbeitung findet auf Servern in Deutschland statt (Vercel, Region Frankfurt; Google Cloud
            Firestore, Region europe-west3). Die Unterauftragnehmer sind Unternehmen mit Sitz in den USA. Eine
            Übermittlung in ein Drittland erfolgt nur, soweit die besonderen Voraussetzungen der Art. 44 ff.
            DSGVO erfüllt sind. Mit der Zustimmung zu diesem Vertrag erklärt sich der Auftraggeber mit den in
            Anlage 3 genannten Unterauftragnehmern einverstanden.
          </p>
        </Paragraf>

        <Paragraf titel="§ 4 Art der verarbeiteten Daten, Kreis der betroffenen Personen">
          <p>
            Der Auftragnehmer erhält Zugriff auf die in Anlage 1 näher beschriebenen personenbezogenen Daten der
            dort beschriebenen betroffenen Personen. Diese Daten umfassen die in Anlage 1 aufgeführten und als
            solche gekennzeichneten besonderen Kategorien personenbezogener Daten (Einschätzungen zu Energie,
            Schlaf, Stress und Motivation). Hinzu kommen Notizen und der Wochenfokus, die der Auftraggeber
            frei formuliert; sie enthalten keine solchen Angaben, wenn der Auftraggeber sich an den Hinweis
            in der App hält.
          </p>
        </Paragraf>

        <Paragraf titel="§ 5 Weisungsrecht">
          <p>
            (1) Der Auftragnehmer darf Daten nur im Rahmen dieses Vertrags und gemäß den Weisungen des
            Auftraggebers verarbeiten; dies gilt insbesondere für die Übermittlung personenbezogener Daten in
            ein Drittland oder an eine internationale Organisation. Wird der Auftragnehmer durch das Recht der
            Europäischen Union oder der Mitgliedstaaten zu weiteren Verarbeitungen verpflichtet, teilt er dem
            Auftraggeber diese rechtlichen Anforderungen vor der Verarbeitung mit.
          </p>
          <p>
            (2) Die Weisungen des Auftraggebers werden anfänglich durch diesen Vertrag festgelegt. Der
            Auftraggeber erteilt weitere Weisungen durch die Funktionen der App (Kunden anlegen, archivieren,
            löschen, Notizen und Wochenfokus schreiben, Link neu erzeugen, Konto löschen) und in Textform per E-Mail. Dies umfasst auch Weisungen zur Berichtigung, Löschung und
            Sperrung von Daten. Die weisungsberechtigten Personen ergeben sich aus Anlage 4.
          </p>
          <p>
            Als vereinbart gilt ausdrücklich: Kunden willigen auf ihrer Check-in-Seite in die Verarbeitung ein
            und können diese Einwilligung dort jederzeit widerrufen. Der Widerruf löscht ihre gespeicherten
            Check-ins. Der Auftragnehmer führt diese Löschung ohne weitere Weisung des Auftraggebers aus.
          </p>
          <p>
            (3) Alle erteilten Weisungen dokumentieren beide Parteien für die Dauer ihrer Geltung und
            anschließend für drei weitere Jahre.
          </p>
          <p>
            (4) Ist der Auftragnehmer der Ansicht, dass eine Weisung gegen datenschutzrechtliche Bestimmungen
            verstößt, weist er den Auftraggeber unverzüglich darauf hin. Er darf die Durchführung der Weisung
            aussetzen, bis der Auftraggeber sie bestätigt oder ändert. Eine offensichtlich rechtswidrige
            Weisung darf er ablehnen.
          </p>
        </Paragraf>

        <Paragraf titel="§ 6 Schutzmaßnahmen des Auftragnehmers">
          <p>
            (1) Der Auftragnehmer beachtet die gesetzlichen Bestimmungen über den Datenschutz und gibt die aus
            dem Bereich des Auftraggebers erlangten Informationen nicht an Dritte weiter. Daten sind unter
            Berücksichtigung des Stands der Technik gegen die Kenntnisnahme durch Unbefugte zu sichern.
          </p>
          <p>
            (2) Der Auftragnehmer gestaltet seine Organisation so, dass sie den besonderen Anforderungen des
            Datenschutzes gerecht wird, und trifft alle erforderlichen technischen und organisatorischen
            Maßnahmen nach Art. 32 DSGVO, mindestens die in Anlage 2 aufgeführten. Weil auch besondere
            Kategorien personenbezogener Daten verarbeitet werden, trifft er zusätzlich die angemessenen und
            spezifischen Maßnahmen nach § 22 Abs. 2 BDSG; diese sind in Anlage 2 enthalten. Eine Änderung der
            Maßnahmen bleibt dem Auftragnehmer vorbehalten, das vereinbarte Schutzniveau darf nicht
            unterschritten werden.
          </p>
          <p>
            (3) Ansprechpartner für den Datenschutz beim Auftragnehmer (ein Datenschutzbeauftragter muss nicht
            bestellt werden) ist {BETREIBER},{" "}
            <a href={`mailto:${KONTAKT_EMAIL}`} className={linkKlassen}>
              {KONTAKT_EMAIL}
            </a>
            .
          </p>
          <p>
            (4) Der Auftragnehmer betreibt Wochenpuls allein und beschäftigt niemanden. Er selbst ist zur
            Vertraulichkeit verpflichtet, auch über das Ende des Vertrags hinaus. Sollte er künftig Personen
            einsetzen, verpflichtet er sie entsprechend zur Vertraulichkeit.
          </p>
          <p>
            (5) Der Auftragnehmer arbeitet unter Umständen von zu Hause. Die Maßnahmen nach Absatz 1 und 2 und
            Art. 32 DSGVO sind dort in gleicher Weise sicherzustellen.
          </p>
        </Paragraf>

        <Paragraf titel="§ 7 Informationspflichten des Auftragnehmers">
          <p>
            (1) Bei Störungen, Verdacht auf Datenschutzverletzungen oder Verletzungen vertraglicher
            Pflichten, bei sicherheitsrelevanten Vorfällen oder anderen Unregelmäßigkeiten informiert der
            Auftragnehmer den Auftraggeber unverzüglich in Textform. Dasselbe gilt für Prüfungen des
            Auftragnehmers durch die Datenschutz-Aufsichtsbehörde. Die Meldung einer Verletzung des Schutzes
            personenbezogener Daten enthält soweit möglich: a) eine Beschreibung der Art der Verletzung mit
            Kategorien und Zahl der betroffenen Personen und Datensätze, b) eine Beschreibung der
            wahrscheinlichen Folgen und c) eine Beschreibung der ergriffenen oder vorgeschlagenen Maßnahmen.
          </p>
          <p>
            (2) Der Auftragnehmer trifft unverzüglich die erforderlichen Maßnahmen zur Sicherung der Daten und
            zur Minderung möglicher nachteiliger Folgen, informiert den Auftraggeber und bittet um weitere
            Weisungen.
          </p>
          <p>
            (3) Der Auftragnehmer erteilt dem Auftraggeber jederzeit Auskunft, soweit dessen Daten von einer
            Verletzung nach Absatz 1 betroffen sind.
          </p>
          <p>
            (4) Der Auftragnehmer unterstützt den Auftraggeber bei dessen Pflichten nach Art. 33 und 34 DSGVO
            in angemessener Weise. Meldungen für den Auftraggeber nach Art. 33 oder 34 DSGVO darf er nur nach
            vorheriger Weisung durchführen.
          </p>
          <p>
            (5) Werden die Daten des Auftraggebers beim Auftragnehmer durch Pfändung, Beschlagnahme, ein
            Insolvenz- oder Vergleichsverfahren oder sonstige Maßnahmen Dritter gefährdet, informiert der
            Auftragnehmer den Auftraggeber unverzüglich, sofern dem keine gerichtliche oder behördliche
            Anordnung entgegensteht. Er weist alle zuständigen Stellen darauf hin, dass die
            Entscheidungshoheit über die Daten allein beim Auftraggeber als Verantwortlichem liegt.
          </p>
          <p>
            (6) Über wesentliche Änderungen der Sicherheitsmaßnahmen nach § 6 Abs. 2 unterrichtet der
            Auftragnehmer den Auftraggeber unverzüglich.
          </p>
          <p>(7) Ein Wechsel des Ansprechpartners für den Datenschutz wird dem Auftraggeber unverzüglich mitgeteilt.</p>
          <p>
            (8) Der Auftragnehmer führt ein Verzeichnis aller im Auftrag durchgeführten Verarbeitungstätigkeiten
            mit den Angaben nach Art. 30 Abs. 2 DSGVO und stellt es dem Auftraggeber auf Anforderung zur
            Verfügung.
          </p>
          <p>
            (9) Bei der Erstellung des Verzeichnisses des Auftraggebers, einer Datenschutz-Folgenabschätzung
            nach Art. 35 DSGVO und gegebenenfalls der Konsultation der Aufsichtsbehörde nach Art. 36 DSGVO wirkt
            der Auftragnehmer im angemessenen Umfang mit.
          </p>
        </Paragraf>

        <Paragraf titel="§ 8 Kontrollrechte des Auftraggebers">
          <p>
            (1) Der Auftraggeber überzeugt sich vor Beginn der Verarbeitung und danach regelmäßig von den
            technischen und organisatorischen Maßnahmen des Auftragnehmers. Dafür kann er Auskünfte einholen
            oder sich vorhandene Nachweise vorlegen lassen. Eine Prüfung vor Ort ist wegen der Größe des
            Betriebs nur nach vorheriger Abstimmung und nur im erforderlichen Umfang vorgesehen, ohne die
            Abläufe des Auftragnehmers unverhältnismäßig zu stören.
          </p>
          <p>
            (2) Der Auftragnehmer stellt dem Auftraggeber auf Anforderung innerhalb angemessener Frist alle
            Auskünfte und Nachweise zur Verfügung, die für eine Kontrolle erforderlich sind.
          </p>
          <p>
            (3) Der Auftraggeber dokumentiert das Ergebnis und teilt es dem Auftragnehmer mit. Fehler und
            Unregelmäßigkeiten meldet er unverzüglich. Erfordert die künftige Vermeidung Änderungen des
            Verfahrens, teilt er sie dem Auftragnehmer unverzüglich mit.
          </p>
          <p>
            (4) Auf Wunsch stellt der Auftragnehmer dem Auftraggeber eine Beschreibung seines Datenschutz- und
            Sicherheitskonzepts sowie der zugriffsberechtigten Personen zur Verfügung. Diese Beschreibung
            entspricht Anlage 2.
          </p>
          <p>(5) Die Verpflichtung nach § 6 Abs. 4 weist der Auftragnehmer auf Verlangen nach.</p>
        </Paragraf>

        <Paragraf titel="§ 9 Einsatz von Unterauftragnehmern">
          <p>
            (1) Die Leistungen werden unter Einschaltung der in Anlage 3 genannten Unterauftragnehmer
            erbracht. Der Auftragnehmer darf weitere Unterauftragnehmer einsetzen, wenn er den Auftraggeber
            vorab informiert und dieser vorab in Textform zustimmt. Der Auftragnehmer wählt Unterauftragnehmer
            sorgfältig nach Eignung und Zuverlässigkeit aus und verpflichtet sie entsprechend dieser
            Vereinbarung. Erfolgt der Einsatz in einem Drittland, stellt er ein angemessenes Datenschutzniveau
            sicher (z. B. durch EU-Standardvertragsklauseln) und weist dies auf Verlangen nach.
          </p>
          <p>
            (2) Kein Unterauftragsverhältnis liegt vor bei reinen Nebenleistungen wie Post-, Transport- und
            Telekommunikationsleistungen ohne konkreten Bezug zur Leistung für den Auftraggeber. Wartungs- und
            Prüfleistungen an IT-Systemen, die auch für diese Leistung genutzt werden, sind zustimmungspflichtig.
          </p>
        </Paragraf>

        <Paragraf titel="§ 10 Anfragen und Rechte betroffener Personen">
          <p>
            (1) Der Auftragnehmer unterstützt den Auftraggeber nach Möglichkeit mit geeigneten technischen und
            organisatorischen Maßnahmen bei der Erfüllung seiner Pflichten nach Art. 12 bis 22 sowie 32 und 36
            DSGVO.
          </p>
          <p>
            (2) Macht eine betroffene Person ihre Rechte unmittelbar gegenüber dem Auftragnehmer geltend, etwa
            auf Auskunft, Berichtigung oder Löschung, reagiert dieser nicht selbstständig, sondern verweist
            die Person unverzüglich an den Auftraggeber und wartet dessen Weisungen ab. Ausgenommen ist der
            Widerruf der Einwilligung, den Kunden selbst in der App erklären (§ 5 Abs. 2).
          </p>
        </Paragraf>

        <Paragraf titel="§ 11 Haftung">
          <p>
            (1) Auftraggeber und Auftragnehmer haften gegenüber betroffenen Personen nach Art. 82 DSGVO. Der
            Auftragnehmer stimmt die Erfüllung etwaiger Haftungsansprüche mit dem Auftraggeber ab.
          </p>
          <p>
            (2) Der Auftragnehmer stellt den Auftraggeber auf erstes Anfordern von Ansprüchen betroffener
            Personen frei, die diese wegen der Verletzung einer dem Auftragnehmer durch die DSGVO auferlegten
            Pflicht oder wegen der Verletzung einer Weisung des Auftraggebers geltend machen.
          </p>
          <p>
            (3) Die Parteien stellen sich jeweils von der Haftung frei, soweit eine Partei nachweist, dass sie
            in keinerlei Hinsicht für den Umstand verantwortlich ist, durch den der Schaden bei einer
            betroffenen Person eingetreten ist. Im Übrigen gilt Art. 82 Abs. 5 DSGVO.
          </p>
          <p>
            (4) Wochenpuls ist ein kostenloses Portfolio-Projekt. Über die Absätze 1 bis 3 und die gesetzliche
            Haftung hinaus, die sich nicht ausschließen lässt, übernimmt der Auftragnehmer keine Haftung für
            die ständige Verfügbarkeit des Dienstes.
          </p>
        </Paragraf>

        <Paragraf titel="§ 12 Außerordentliches Kündigungsrecht">
          <p>
            Der Auftraggeber kann die Nutzung von Wochenpuls und diesen Vertrag fristlos kündigen, indem er sein
            Konto löscht, wenn der Auftragnehmer seinen Pflichten aus diesem Vertrag nicht
            nachkommt, Bestimmungen der DSGVO oder andere Datenschutzvorschriften vorsätzlich oder grob
            fahrlässig verletzt, eine Weisung nicht ausführen kann oder will oder sich den Kontrollrechten des
            Auftraggebers vertragswidrig widersetzt. Insbesondere die Nichteinhaltung der aus Art. 28 DSGVO
            abgeleiteten Pflichten ist ein schwerer Verstoß.
          </p>
        </Paragraf>

        <Paragraf titel="§ 13 Beendigung">
          <p>
            (1) Nach Beendigung der Nutzung oder jederzeit auf Anforderung gibt der Auftragnehmer dem
            Auftraggeber alle überlassenen Daten zurück oder löscht sie auf dessen Wunsch, sofern nicht nach
            Unionsrecht oder deutschem Recht eine Pflicht zur Speicherung besteht. Das betrifft auch etwaige
            Datensicherungen. Der Auftraggeber kann sein Konto jederzeit selbst auf der Seite „Konto“ im Coach-Bereich
            löschen („Konto löschen“); das gilt als Weisung zur Löschung. Mit dem Coach-Konto entfernt der
            Auftragnehmer alle Kunden des Coaches samt Check-ins, Notizen und Einwilligungen sowie den
            Anmeldenutzer bei Firebase. Die Löschung bestätigt er dem Auftraggeber auf Wunsch in Textform.
          </p>
          <p>
            (2) Der Auftraggeber kann die vollständige und vertragsgerechte Rückgabe bzw. Löschung beim
            Auftragnehmer in geeigneter Weise kontrollieren.
          </p>
          <p>
            (3) Der Auftragnehmer behandelt die ihm bekannt gewordenen Daten auch nach Ende der Nutzung
            vertraulich. Dieser Vertrag gilt so lange fort, wie der Auftragnehmer noch personenbezogene Daten
            des Auftraggebers hat.
          </p>
        </Paragraf>

        <Paragraf titel="§ 14 Schlussbestimmungen">
          <p>
            (1) Die Einrede des Zurückbehaltungsrechts nach § 273 BGB ist hinsichtlich der Daten und der
            zugehörigen Datenträger ausgeschlossen.
          </p>
          <p>
            (2) Der Vertrag wird nicht durch Unterschrift, sondern im dokumentierten elektronischen Format
            geschlossen: durch die Zustimmung des Auftraggebers per Häkchen bei der Registrierung. Wochenpuls
            speichert diese Zustimmung mit Zeitpunkt und Fassung des Vertrags (Fassung {AVV_FASSUNG}, Stand{" "}
            {stand}). Änderungen und Ergänzungen bedürfen der Schriftform oder eines dokumentierten
            elektronischen Formats. Der Vorrang individueller Vertragsabreden bleibt unberührt.
          </p>
          <p>
            (3) Sind einzelne Bestimmungen ganz oder teilweise unwirksam oder nicht durchführbar, bleibt die
            Gültigkeit der übrigen unberührt.
          </p>
          <p>
            (4) Es gilt deutsches Recht. Gerichtsstand ist, soweit gesetzlich zulässig, der Wohnsitz des
            Auftragnehmers.
          </p>
        </Paragraf>

        <Paragraf titel="Pflicht des Coaches: Kunden informieren">
          <p>
            Der Auftraggeber ist für die Daten seiner Kunden verantwortlich. Er informiert seine Kunden selbst
            nach Art. 13 DSGVO darüber, dass er Wochenpuls nutzt und ihre Daten dort verarbeitet werden. Dafür
            kann er ihnen den Link zur{" "}
            <Link href="/datenschutz" className={linkKlassen}>
              Datenschutzerklärung
            </Link>{" "}
            schicken. Wochenpuls erinnert beim Anlegen eines Kunden daran.
          </p>
        </Paragraf>

        <Paragraf titel="Anlage 1: Betroffene Personen und Daten">
          <p>
            <strong className="font-semibold text-text">Betroffene:</strong> Kunden des Auftraggebers.
          </p>
          <p>
            <strong className="font-semibold text-text">Daten der Kunden:</strong>
          </p>
          <Liste>
            <li>Vorname oder Kürzel, persönlicher Link (Token), Anlagedatum, Archiv-Status,</li>
            <li>Zeitpunkt der Einwilligung und Fassung des Einwilligungstextes,</li>
            <li>
              je Woche: geplante und geschaffte Trainings, drei kurze Freitexte, Zeitpunkt des Absendens; gibt
              es für die Woche einen Wochenfokus des Auftraggebers, eine Kopie des Fokus-Textes und die
              Antwort des Kunden,
            </li>
            <li>
              private Notiz des Auftraggebers zum Kunden (Freitext mit Zeitpunkt der letzten Änderung): für den
              Kunden nicht sichtbar und nicht im Export,
            </li>
            <li>Zeitpunkt des Widerrufs, falls der Kunde seine Einwilligung widerrufen hat,</li>
            <li>
              <strong className="font-semibold text-text">besondere Kategorien (Gesundheitsdaten möglich):</strong>{" "}
              die vier Einschätzungen von 1 bis 5 zu Energie, Schlaf, Stress und Motivation.
            </li>
          </Liste>
          <p>
            Zusätzlich verarbeitet der Auftragnehmer technische Zugriffsdaten (z. B. IP-Adresse) beim Aufruf der
            Seiten.
          </p>
        </Paragraf>

        <Paragraf titel="Anlage 2: Technische und organisatorische Maßnahmen">
          <Liste>
            <li>
              Zugriffskontrolle: Die Datenbank ist für Browser gesperrt. Nur der Server greift darauf zu. Nur
              der Auftragnehmer hat Zugang zur Verwaltungskonsole.
            </li>
            <li>
              Trennung: Jede Abfrage im Coach-Bereich filtert nach dem angemeldeten Coach. Kunden anderer
              Coaches werden behandelt, als gäbe es sie nicht.
            </li>
            <li>
              Anmeldung: Google-Anmeldung, Sitzungs-Cookie (httpOnly, in Produktion nur über HTTPS, 14 Tage).
              Ein Coach-Konto kann gesperrt werden; die Sitzung endet dann sofort.
            </li>
            <li>
              Kunden-Links: 32 zufällige Zeichen, praktisch nicht zu erraten; archivierte Kunden sind
              gesperrt; die Check-in-Seite gibt keine Herkunft weiter und ist für Suchmaschinen gesperrt.
            </li>
            <li>Verschlüsselte Übertragung (HTTPS) und Speicherung bei den Unterauftragnehmern.</li>
            <li>Kein Tracking, keine Analyse, keine Werbung, keine extern geladenen Schriften.</li>
            <li>Löschung: Kunden werden samt Check-ins und Notiz vollständig gelöscht, ebenso ein ganzes Coach-Konto.</li>
            <li>Zugriff auf Kundendaten nur zur Fehlerbehebung, für Löschungen und bei Missbrauch.</li>
          </Liste>
        </Paragraf>

        <Paragraf titel="Anlage 3: Genehmigte Unterauftragnehmer">
          <Liste>
            <li>
              Google Cloud (Google LLC, USA): Cloud Firestore, Region
              europe-west3 (Frankfurt) – Speicherung der Kundendaten.
            </li>
            <li>
              Vercel Inc., USA: Hosting, Region fra1 (Frankfurt) – Auslieferung der Website und Ausführung des
              Servers.
            </li>
          </Liste>
          <p>
            Firebase Authentication (Google) verarbeitet nur die Kontodaten der Coaches; dafür ist der
            Auftragnehmer selbst verantwortlich.
          </p>
        </Paragraf>

        <Paragraf titel="Anlage 4: Weisungsberechtigte Personen">
          <p>
            Weisungsberechtigt für den Auftraggeber ist der Coach, der sich mit seinem Google-Konto
            angemeldet hat. Weisungsempfänger beim Auftragnehmer ist {BETREIBER}. Kommunikationswege:
            die Funktionen der App und E-Mail an{" "}
            <a href={`mailto:${KONTAKT_EMAIL}`} className={linkKlassen}>
              {KONTAKT_EMAIL}
            </a>
            .
          </p>
        </Paragraf>

        <Paragraf titel="Zustimmung">
          <p>
            Statt Unterschriften gilt die gespeicherte Zustimmung des Auftraggebers per Häkchen bei der
            Registrierung, mit Zeitpunkt und Fassung ({AVV_FASSUNG}).
          </p>
          <p>
            Siehe auch die{" "}
            <Link href="/datenschutz" className={linkKlassen}>
              Datenschutzerklärung
            </Link>
            .
          </p>
        </Paragraf>
      </article>
    </main>
  );
}
