import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
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
    <html
      lang="de"
      data-scroll-behavior="smooth"
      className={`${newsreader.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
