import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const beschreibung = "Wöchentliche Check-ins für Fitness-Coaches: ein Link pro Kunde, eine Ampel für alle.";

export const metadata: Metadata = {
  metadataBase: new URL("https://wochenpuls.vercel.app"),
  title: "Wochenpuls",
  description: beschreibung,
  openGraph: {
    title: "Wochenpuls – Wer braucht dich diese Woche?",
    description: beschreibung,
    locale: "de_DE",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
