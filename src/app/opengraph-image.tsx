import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Vorschaubild, das LinkedIn & Co. beim Teilen des Links anzeigen
export const alt = "Wochenpuls: Wöchentliche Check-ins für Fitness-Coaches";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const farbe = {
  leinwand: "#0F1210",
  fenster: "#141815",
  kopf: "#181D1A",
  flaeche: "#161A17",
  text: "#F0EEE8",
  zwei: "#A8ACA6",
  leise: "#8A908A",
  linie: "rgba(240,238,232,0.10)",
  akzent: "#8DB8A6",
  rot: "#EF766C",
  gelb: "#DBA55C",
};

// Ampel-Symbole als Grafik, weil Schriften ▲ und ✓ oft nicht enthalten
function Symbol({ art, f }: { art: "rot" | "gelb" | "gruen"; f: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12">
      {art === "rot" && <path d="M6 1.5 L11 10.5 H1 Z" fill={f} />}
      {art === "gelb" && <path d="M5 1 H7 V7.5 H5 Z M5 9 H7 V11 H5 Z" fill={f} />}
      {art === "gruen" && (
        <path d="M2 6.5 L4.8 9.2 L10 3" stroke={f} strokeWidth={2} fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}

function Marke({ art, f, wort }: { art: "rot" | "gelb" | "gruen"; f: string; wort: string }) {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 8px",
        borderRadius: 4,
        border: `1px solid ${f}55`,
        background: `${f}1F`,
        color: f,
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: 1,
      }}
    >
      <Symbol art={art} f={f} />
      {wort}
    </span>
  );
}

const zeilen = [
  { name: "Lena", grund: "Nur 1 von 4 Trainings geschafft", art: "rot" as const, f: farbe.rot, wort: "HANDELN" },
  {
    name: "Mia",
    grund: "Schlaf deutlich schlechter als sonst",
    art: "gelb" as const,
    f: farbe.gelb,
    wort: "BEOBACHTEN",
  },
  { name: "Aylin", grund: "Alles im grünen Bereich", art: "gruen" as const, f: farbe.akzent, wort: "LÄUFT" },
];

export default async function Vorschaubild() {
  const schrift = (datei: string) => readFile(join(process.cwd(), `src/app/_schrift/${datei}`));

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: farbe.leinwand,
        color: farbe.text,
        padding: "60px 64px",
        fontFamily: "Inter",
        position: "relative",
      }}
    >
      {/* Text links */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 600 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "#1C211D",
              border: `1px solid ${farbe.linie}`,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                d="M2 12h4l2.5-6 4 12 3-8 2.5 5 2-3h4"
                fill="none"
                stroke={farbe.akzent}
                strokeWidth={1.9}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span style={{ fontSize: 26, fontWeight: 600 }}>Wochenpuls</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 15, letterSpacing: 2, color: farbe.akzent, marginBottom: 18 }}>
            CHECK-INS FÜR COACHES
          </span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Newsreader",
              fontSize: 84,
              lineHeight: 1.04,
              letterSpacing: -2.5,
            }}
          >
            <span>Wer braucht dich</span>
            <span style={{ fontStyle: "italic", color: farbe.akzent }}>diese Woche?</span>
          </div>
        </div>

        <span style={{ fontSize: 22, color: farbe.zwei }}>Ein Link pro Kunde. Eine Ampel für alle.</span>
      </div>

      {/* Produktfenster rechts */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginLeft: "auto",
          alignSelf: "center",
          width: 440,
          background: farbe.fenster,
          border: `1px solid ${farbe.linie}`,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 16px",
            background: farbe.kopf,
            borderBottom: `1px solid ${farbe.linie}`,
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: 99, background: farbe.rot }} />
          <div style={{ width: 10, height: 10, borderRadius: 99, background: farbe.gelb }} />
          <div style={{ width: 10, height: 10, borderRadius: 99, background: farbe.akzent }} />
          <span style={{ marginLeft: 8, fontSize: 13, color: farbe.leise }}>wochenpuls.vercel.app/demo</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", padding: 20, gap: 12 }}>
          {zeilen.map((z) => (
            <div
              key={z.name}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: 16,
                borderRadius: 6,
                background: z.art === "gruen" ? farbe.flaeche : `${z.f}14`,
                border: `1px solid ${z.art === "gruen" ? farbe.linie : `${z.f}55`}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "Newsreader", fontSize: 28 }}>{z.name}</span>
                <Marke art={z.art} f={z.f} wort={z.wort} />
              </div>
              <span style={{ fontSize: 16, color: farbe.zwei, marginTop: 4 }}>{z.grund}</span>
            </div>
          ))}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Inter", data: await schrift("Inter-400.ttf"), weight: 400, style: "normal" },
        { name: "Inter", data: await schrift("Inter-600.ttf"), weight: 600, style: "normal" },
        { name: "Newsreader", data: await schrift("Newsreader-400.ttf"), weight: 400, style: "normal" },
        { name: "Newsreader", data: await schrift("Newsreader-400-kursiv.ttf"), weight: 400, style: "italic" },
      ],
    },
  );
}
