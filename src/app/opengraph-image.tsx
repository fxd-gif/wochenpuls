import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Vorschaubild, das LinkedIn & Co. beim Teilen des Links anzeigen
export const alt = "Wochenpuls: Wöchentliche Check-ins für Fitness-Coaches";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Ampel-Symbole als Grafik, weil Schriften ▲ und ✓ oft nicht enthalten
const symbole = {
  rot: <path d="M9 3 L16 15 H2 Z" fill="#ffffff" />,
  gelb: <path d="M8 3 H10 V11 H8 Z M8 13 H10 V15 H8 Z" fill="#111827" />,
  gruen: (
    <path d="M4 9.5 L7.5 13 L14 5.5" stroke="#ffffff" strokeWidth={2.6} fill="none" strokeLinecap="round" />
  ),
};

const zeilen = [
  {
    name: "Lena",
    grund: "Nur 1 von 4 Trainings geschafft",
    farbe: "#dc2626",
    symbol: symbole.rot,
    wort: "HANDELN",
  },
  {
    name: "Tom",
    grund: "Stress diese Woche sehr hoch",
    farbe: "#f59e0b",
    symbol: symbole.gelb,
    wort: "BEOBACHTEN",
  },
  { name: "Mia", grund: "Alles im grünen Bereich", farbe: "#059669", symbol: symbole.gruen, wort: "LÄUFT" },
];

export default async function Vorschaubild() {
  const schrift = (gewicht: number) =>
    readFile(join(process.cwd(), `src/app/_schrift/Outfit-${gewicht}.ttf`));

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#2563eb",
        color: "#ffffff",
        padding: 64,
        position: "relative",
        overflow: "hidden",
        fontFamily: "Outfit",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -160,
          top: -160,
          width: 520,
          height: 520,
          borderRadius: 9999,
          background: "rgba(255,255,255,0.1)",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 640 }}>
        <div style={{ fontSize: 34, fontWeight: 800 }}>Wochenpuls</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 80,
            fontWeight: 800,
            lineHeight: 1.05,
          }}
        >
          <span>Wer braucht dich</span>
          <span style={{ display: "flex" }}>
            <span style={{ background: "#f59e0b", color: "#111827", borderRadius: 10, padding: "0 12px" }}>
              diese Woche
            </span>
            ?
          </span>
        </div>
        <div style={{ fontSize: 30 }}>Check-ins für Fitness-Coaches</div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginLeft: "auto",
          width: 420,
          background: "#ffffff",
          color: "#111827",
          borderRadius: 12,
          padding: "24px 24px 12px",
          alignSelf: "center",
        }}
      >
        {zeilen.map((z) => (
          <div
            key={z.name}
            style={{
              display: "flex",
              flexDirection: "column",
              background: "#f3f4f6",
              borderRadius: 8,
              padding: 18,
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 30, fontWeight: 800 }}>{z.name}</span>
              <span style={{ display: "flex", alignItems: "center", fontSize: 16, fontWeight: 800 }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    borderRadius: 9999,
                    background: z.farbe,
                    marginRight: 8,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    {z.symbol}
                  </svg>
                </span>
                {z.wort}
              </span>
            </div>
            <span style={{ fontSize: 20, color: "#4b5563", marginTop: 4 }}>{z.grund}</span>
          </div>
        ))}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Outfit", data: await schrift(400), weight: 400, style: "normal" },
        { name: "Outfit", data: await schrift(800), weight: 800, style: "normal" },
      ],
    },
  );
}
