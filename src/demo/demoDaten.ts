// Erfundene Demo-Kunden. Alle Daten werden relativ zu "heute" erzeugt,
// damit die Demo nie veraltet. Jeder Kunde zeigt bewusst einen anderen Fall.
import type { Checkin, Kunde } from "@/lib/checkin";
import { letzterFaelligkeitstag, plusTage } from "@/lib/woche";

// Eine Woche: [geplant, geschafft, Energie, Schlaf, Stress, Motivation] oder null = kein Check-in
type Woche = [number, number, number, number, number, number] | null;

type DemoKunde = {
  id: string;
  name: string;
  angelegtVorTagen: number;
  verlauf: Woche[]; // älteste Woche zuerst, letzte = letzter Sonntag
  erfolg: string;
  huerde: string;
  frage?: string;
};

const demoKunden: DemoKunde[] = [
  {
    // Rot: weniger als die Hälfte der Trainings
    id: "lena",
    name: "Lena",
    angelegtVorTagen: 60,
    verlauf: [
      [4, 4, 4, 3, 3, 4],
      [4, 3, 4, 4, 2, 4],
      [4, 4, 3, 3, 3, 4],
      [4, 3, 4, 3, 3, 3],
      [4, 4, 4, 4, 2, 4],
      [4, 3, 3, 3, 3, 3],
      [4, 3, 3, 3, 3, 3],
      [4, 1, 3, 3, 3, 3],
    ],
    erfolg: "Trotz Spätschicht einmal früh morgens trainiert.",
    huerde: "Drei Spätschichten hintereinander, danach war ich platt.",
    frage: "Kann ich bei Schichtdienst auch zwei kürzere Einheiten statt einer langen machen?",
  },
  {
    // Rot: Check-in seit über einer Woche überfällig
    id: "jonas",
    name: "Jonas",
    angelegtVorTagen: 70,
    verlauf: [
      [3, 3, 4, 4, 2, 5],
      [3, 3, 4, 3, 2, 4],
      [3, 2, 3, 3, 3, 4],
      [3, 3, 4, 4, 2, 4],
      [3, 2, 3, 3, 3, 3],
      [3, 2, 3, 3, 3, 3],
      null,
      null,
    ],
    erfolg: "Neue Bestleistung beim Kreuzheben.",
    huerde: "Umzug steht an, alles etwas chaotisch.",
  },
  {
    // Rot: Motivation zwei Wochen in Folge niedrig
    id: "tom",
    name: "Tom",
    angelegtVorTagen: 60,
    verlauf: [
      [3, 3, 4, 4, 2, 4],
      [3, 3, 4, 4, 2, 4],
      [3, 3, 3, 4, 3, 3],
      [3, 2, 3, 3, 3, 3],
      [3, 3, 3, 3, 3, 3],
      [3, 2, 3, 3, 3, 3],
      [3, 2, 3, 3, 3, 2],
      [3, 2, 3, 3, 3, 1],
    ],
    erfolg: "Immerhin zweimal hingegangen.",
    huerde: "Ich habe gerade null Lust und weiß nicht genau, warum.",
  },
  {
    // Gelb: Schlaf deutlich schlechter als sonst
    id: "mia",
    name: "Mia",
    angelegtVorTagen: 60,
    verlauf: [
      [3, 3, 4, 4, 2, 4],
      [3, 3, 4, 5, 2, 4],
      [3, 3, 4, 4, 2, 5],
      [3, 3, 5, 4, 2, 4],
      [3, 3, 4, 4, 2, 4],
      [3, 3, 4, 5, 2, 4],
      [3, 3, 4, 4, 2, 4],
      [3, 3, 3, 2, 3, 4],
    ],
    erfolg: "Alle drei Einheiten geschafft, auch die lange am Samstag.",
    huerde: "Nachbarn renovieren, ich komme kaum zum Schlafen.",
  },
  {
    // Gelb: Stress auf dem Maximum
    id: "sarah",
    name: "Sarah",
    angelegtVorTagen: 55,
    verlauf: [
      [3, 3, 4, 4, 3, 4],
      [3, 3, 4, 4, 3, 4],
      [3, 3, 3, 4, 4, 4],
      [3, 3, 4, 3, 4, 4],
      [3, 3, 3, 4, 4, 4],
      [3, 3, 4, 4, 4, 4],
      [3, 3, 3, 3, 4, 4],
      [3, 2, 3, 3, 5, 4],
    ],
    erfolg: "Training war mein Ventil diese Woche.",
    huerde: "Projektabgabe im Job, viele Überstunden.",
  },
  {
    // Grün, mit Frage an den Coach
    id: "aylin",
    name: "Aylin",
    angelegtVorTagen: 60,
    verlauf: [
      [3, 3, 3, 4, 3, 4],
      [3, 3, 4, 4, 2, 4],
      [4, 3, 4, 4, 2, 4],
      [4, 4, 4, 4, 2, 5],
      [4, 4, 4, 4, 2, 4],
      [4, 4, 5, 4, 2, 5],
      [4, 4, 4, 4, 2, 5],
      [4, 4, 5, 4, 2, 5],
    ],
    erfolg: "Zum ersten Mal 5 km am Stück gelaufen.",
    huerde: "Muskelkater nach dem Beintag.",
    frage: "Soll ich die Kniebeugen nächste Woche schwerer machen?",
  },
  {
    // Grün, erst seit drei Wochen dabei (kurzer Verlauf)
    id: "chris",
    name: "Chris",
    angelegtVorTagen: 24,
    verlauf: [
      [2, 2, 3, 4, 2, 5],
      [3, 3, 4, 4, 2, 5],
      [3, 3, 4, 4, 2, 5],
    ],
    erfolg: "Drei Einheiten, und es macht richtig Spaß.",
    huerde: "Die Technik beim Rudern fühlt sich noch komisch an.",
  },
  {
    // Neu: gestern angelegt, noch kein Check-in
    id: "ben",
    name: "Ben",
    angelegtVorTagen: 1,
    verlauf: [],
    erfolg: "",
    huerde: "",
  },
];

const aeltereErfolge = [
  "Alle Einheiten wie geplant durchgezogen.",
  "Mehr Wasser getrunken als sonst.",
  "Früher ins Bett gegangen.",
  "Neue Übung gelernt.",
];
const aeltereHuerden = [
  "Wenig Zeit unter der Woche.",
  "Ein Abend mit Freunden ist dazwischengekommen.",
  "Das Wetter war schlecht.",
  "Viel zu tun im Job.",
];

export function demoDaten(heute: string): { kunden: Kunde[]; checkins: Checkin[] } {
  const letzterSonntag = letzterFaelligkeitstag(heute);
  const kunden: Kunde[] = [];
  const checkins: Checkin[] = [];

  for (const k of demoKunden) {
    kunden.push({
      id: k.id,
      name: k.name,
      angelegtAm: plusTage(heute, -k.angelegtVorTagen),
      archiviert: false,
    });

    k.verlauf.forEach((woche, i) => {
      if (!woche) return;
      const wochenAbstand = k.verlauf.length - 1 - i;
      const sonntag = plusTage(letzterSonntag, -7 * wochenAbstand);
      const [trainingsGeplant, trainingsGeschafft, energie, schlaf, stress, motivation] = woche;
      const istLetzte = i === k.verlauf.findLastIndex(Boolean);
      checkins.push({
        kundeId: k.id,
        woche: sonntag,
        eingereichtAm: `${plusTage(sonntag, -(i % 2))}T18:30:00`,
        trainingsGeplant,
        trainingsGeschafft,
        energie,
        schlaf,
        stress,
        motivation,
        erfolg: istLetzte ? k.erfolg : aeltereErfolge[i % aeltereErfolge.length],
        huerde: istLetzte ? k.huerde : aeltereHuerden[i % aeltereHuerden.length],
        frage: istLetzte ? (k.frage ?? "") : "",
      });
    });
  }

  return { kunden, checkins };
}
